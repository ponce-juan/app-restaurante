import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { Product } from '@models/products.model';
import { Table } from '@models/table.model';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { Item, Order, OrderType } from '@core/models/order.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderTypeService } from '@services/order-type.service';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class Orders implements OnInit{
  
  private _destroyRef: DestroyRef = inject(DestroyRef);
  private _orderTypesService = inject(OrderTypeService);
  private _fb = inject(FormBuilder);
  private itemsInOrder: Item[] = [];

  public productService = inject(ProductService);
  public orderTypes = signal<OrderType[]>([]);
  loading = signal<boolean>(true);
  errormsg = signal<string | null>(null);


  orderForm = this._fb.group({  })

  itemForm = this._fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]]
  });

  @Input() table!: Table;
  
  selectedProduct: Product | null = null;
  newOrder: Order = {} as Order;

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
        console.log(types)
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

  addItem(product: Product, qty: number){
    const itemForm = this._fb.group({
      name: [product.name, [Validators.required]],
      quantity: [qty, [Validators.required, Validators.min(1), Validators.max(product.stock)]],
      price: [product.price, [Validators.required, Validators.min(1)]]
    });

    //Valido la cantidad ingresada
    if(itemForm.get('quantity')?.hasError('min') || itemForm.get('quantity')?.hasError('max')){
      alert(`Cantidad inválida. Debe ser entre 1 y ${product.stock}`);
      return;
    }
    
    // const item: Item = {
    //   name: itemForm.get('name')?.value!!,
    //   quantity: itemForm.get('quantity')?.value!!,
    //   price: itemForm.get('price')?.value!!
    // }
    const item: Item = itemForm.value as Item;
    console.log(item);
    //Lo agrego a la lista
    //Verifico si existe

    // this.itemsInOrder.push(item)
  }

  addOrUpdateItem(item: Item, product: Product){
    //Verifico si existe el item en la lista
    const index = this.itemsInOrder.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase())

    //Si existe, actualizo la cantidad
    if(index !== -1){
      const currentQty = this.itemsInOrder.at(index)?.quantity!!;
      const newQty = currentQty + item.quantity;

      if(newQty > product.stock){
        alert(`No podes agregar mas de ${product.stock} unidades de este producto.`)
        return;
      }
      this.itemsInOrder[index].quantity = newQty;

      console.log("Se incremento la cantidad del item: ", this.itemsInOrder[index]);
      return;
    }
    //Si no existe, lo agrego
    this.itemsInOrder.push(item);
    console.log("Se agrego un nuevo item: ", item);

  }

  submitFormNewOrder(): void {

  }

  saveOrder(){

  }

  cancelOrder(): void {
    
  }

  confirmAddProductToOrder(){
    this.addItem(this.selectedProduct!, this.itemForm.get('quantity')?.value!!);
  }

}
