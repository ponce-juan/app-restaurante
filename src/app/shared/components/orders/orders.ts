import { Component, DestroyRef, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Product } from '@models/products.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Item, Order, OrderRequest, OrderStatus, OrderType } from '@core/models/order.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderTypeService } from '@services/order-type.service';
import { ProductService } from '@core/services/product.service';
import { EventEmitter } from '@angular/core';
import { OrderStoreService } from '@core/services/order-store.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit{
  
  // @Input() table!: Table;
  @Output() closeOrderForm = new EventEmitter<void>();

  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _orderTypesService = inject(OrderTypeService);
  private _fb = inject(FormBuilder);
  
  private _itemsInOrder: Item[] = [];
  // orders: Order[] = [];

  public productService = inject(ProductService);
  public orderTypes = signal<OrderType[]>([]);
  public orderStore = inject(OrderStoreService);
  loading = signal<boolean>(true);
  errormsg = signal<string | null>(null);

  //FLAGS
  orderTypeSelected= signal<boolean>(false);
  selectedProduct: Product | null = null;
  private _newOrderReq: OrderRequest = {} as OrderRequest;

  // orderForm = this._fb.group({  })

  itemForm = this._fb.group({
    quantity: this._fb.control<number>(1, [Validators.required, Validators.min(1)])
  });

  orderTypeForm = this._fb.group({
    type: this._fb.control<OrderType | null>(null, Validators.required)
  });

  ngOnInit(){
    this.loadOrderTypes();
    this.loadProducts();
  }

  //Carga de tipo de orden desde db
  private loadOrderTypes(): void {
    this.loading.set(true);

    this._orderTypesService.getOrderTypes()
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (types) => {
        // console.log(types)
        this.errormsg.set(null);
        this.loading.set(false);
        this.orderTypes.set(types.filter(t => t.type !== 'DINE_IN'));
      },
      error: (err) => {
        console.error("Error al obtenes los tipos de ordenes: ", err);
        this.loading.set(false);
        this.errormsg.set(err.error.message);
        this.orderTypes.set([]);
      }
    })
  }
  //Carga de productos GLOBALES
  private loadProducts() {
    this.loading.set(true);
    this.productService.loadProducts()
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: () => {
        this.errormsg.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.errormsg.set(err.error.message);
        console.log(this.errormsg);
      }
    })
  }

  //Actualizo el producto seleccionado 
  onSelectProduct(product : Product){
    this.selectedProduct = product;
    // console.log(product);
  }

  //Transformo un producto en un item para la orden
  prodToItem(product: Product): Item | null{

    //Creo el item a agregar
    const item: Item = {
      name: product.name,
      quantity: this.itemForm.get('quantity')?.value!!,
      price: product.price
    } as Item;
    
    return item;

  }

  //Agrego o actualizo un item en la orden
  addOrUpdateItem(item: Item, product: Product){
  // addOrUpdateItem(item: Item, product: Product){
    //Verifico si existe el item en la lista
    const index = this._itemsInOrder.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase())

    //Si existe, actualizo la cantidad
    if(index !== -1){
      const currentQty = this._itemsInOrder[index].quantity;
      const newQty = currentQty + item.quantity;

      if(newQty > product.stock){
        alert(`No podes agregar mas de ${product.stock} unidades de este producto.`)
        return;
      }

      //Actualizo la cantidad del item existente
      this._itemsInOrder[index].quantity = newQty;

      // console.log("Se incremento la cantidad del item: ", this._itemsInOrder[index]);

      //Actualizo la información del producto en DB
      // this.updateProductStock(item, product);
      // return;
    }else{

      //Si no existe, lo agrego
      this._itemsInOrder.push(item);
    }

    // console.log("Se agrego un nuevo item: ", item);
    // console.log(this._itemsInOrder)

    //Actualizo la información del producto en DB
    this.updateProductStock(item, product);
    console.log("neworder: ", this._newOrderReq);
    this.updateOrderTotal();

  }

  updateOrderTotal(){
    const total = this._itemsInOrder.reduce((acc, item) => {
      return acc + (item.price * item.quantity)
    }, 0);
    this._newOrderReq.total = total;
  }

  //Actualizo el stock del producto en base de datos y estado global
  updateProductStock(item: Item, product: Product){
    const newStock = product.stock - item.quantity;
    product.stock = newStock;
    this.productService.updateProduct(product.id!, product)
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (updatedProduct) => {
        // console.log("Stock actualizado: ", updatedProduct);
      },
      error: (err) => {
        console.error("Error al actualizar el stock del producto: ", err.error.message);
      }
    })
  }

  saveOrder(){

    if(!this._validateForms()) return;

    this._newOrderReq.items = [...this._itemsInOrder];
    console.log("Nueva orden a guardar: ", this._newOrderReq);

    // this.orders.push(this._newOrderReq);
    //Actualizo ordenes en servicio globalmente
    this.orderStore.addOrder(this._newOrderReq).subscribe({
      next: (order) => {
        console.log("Orden guardada correctamente: ", order);
        //Genero el PDF de la orden
        this._generateOrderPDF(order);
      },
      error: (err) => {
        console.error("Error al guardar la orden: ", err);
      }
    });

    alert("Pedido registrado exitosamente.\nGenerando comprobante...");

    //Reset ordertype flag
    this.orderTypeSelected.set(false);
    //Emito evento para cerrar el formulario
    this.closeOrderForm.emit();
  }

  cancelOrder(): void {

    this.selectedProduct = null;
    this.orderTypeSelected.set(false);
    this.closeOrderForm.emit();
  }

  confirmAddProductToOrder(){
    // console.log("ordertypeform: ordertype: ", this.orderTypeForm.value.type as OrderType);
    // this.addItem(this.selectedProduct!, this.itemForm.get('quantity')?.value!!);
    //Si los forms no son validos, retorno
    if(!this._validateForms()) return;

    //Cargo los datos INMUTABLES de la orden
    if(this._newOrderReq.id === undefined){
      // console.log("Asignando datos inmutables a la orden...");
      // this._newOrderReq.id = new Date().getTime(); //ID que se asigna en base de datos
      this._newOrderReq.status = 'PENDING'; //Estado inicial
      this._newOrderReq.type = this.orderTypeForm.value.type!;
      
      this._newOrderReq.items = this._itemsInOrder;
      this._newOrderReq.total = 0; //Se calcula al agregar items
      this.updateOrderTotal();

      //Asigno flag para no cambiar el tipo de orden de nuevo
      this.orderTypeSelected.set(true);
      this.orderTypeForm.get('type')?.disable();
    }
    //Creo el item a agregar
    const item = this.prodToItem(this.selectedProduct!);

    //LLamo a la funcion que agrega o actualiza el item en la lista
    this.addOrUpdateItem(item!, this.selectedProduct!);
    
  }

  //Validaciones del formulario, retorna true si es valido
  private _validateForms(): boolean {
    
    //Valido que se haya seleccionado un producto
    if(this.selectedProduct === null){
      alert("Seleccione un producto para agregar a la orden.");
      return false;
    }
    
    //Valido la cantidad ingresada
    if(this.itemForm.get('quantity')?.hasError('min') || this.itemForm.get('quantity')?.hasError('max')){
      alert(`Cantidad inválida. Debe ser entre 1 y ${this.selectedProduct?.stock}`);
      return false;
    }
    
    //Valido que se haya seleccionado un tipo de orden
    if(this.orderTypeForm.get('type')?.value === null){
      alert("Seleccione un tipo de orden.");
      return false;
    }

    //Valido que los formularios sean validos
    if(this.orderTypeForm.invalid || this.itemForm.invalid){
      alert("Datos inválidos. Ingrese los campos correctamente.")
      return false;
    }

    return true;
  }

  //Genera un comprobante en PDF de la orden
  private _generateOrderPDF(order: Order): void {
    const doc = new jsPDF();

    //Titulo
    doc.setFontSize(18);
    doc.text('Comprobante de Pedido', 105, 20, { align: 'center' });
    
    //Detalles de la orden
    doc.setFontSize(12);
    doc.text(`ID de Orden: ${order.id}`, 20, 40);
    doc.text(`Tipo de Orden: ${order.type.type}`, 20, 50);
    doc.text(`Estado: ${order.status.status}`, 20, 60);
    doc.text(`Productos:`, 20, 70);
    let yPos = 70;
    order.items.forEach((item,index) => {
      doc.text(`${index + 1}. ${item.name} - Cantidad: ${item.quantity} - Precio Unitario: $${item.price} - Subtotal: $${(item.price * item.quantity).toFixed(2)}`, 20, yPos+=10);
    })
    doc.text(`______________________________________________________________`, 20, yPos+=10);
    doc.text(`Total: $${order.total.toFixed(2)}`, 140, yPos + 10, {align: 'right'});

    //Guardo el PDF
    doc.save(`Comprobante_Orden_${order.id}.pdf`);

  }

}
