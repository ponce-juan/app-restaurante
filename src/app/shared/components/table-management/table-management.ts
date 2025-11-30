import { Component, computed, EventEmitter, inject, Input, NgModule, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { TableManagerService } from '@services/table-manager-service';
import jsPDF from 'jspdf';
import { Product } from '@models/products.model';
import { Table} from '@models/table.model';
import { FormsModule } from '@angular/forms';
import { ProductService } from '@services/product.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { Item, Order, OrderType } from '@core/models/order.model';


@Component({
  selector: 'app-table-management',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './table-management.html',
  styleUrl: './table-management.css'
})
export class TableManagement{

  @Input({required: true}) table!: WritableSignal<Table | null>;
  @Input({required: true}) isOpen!: WritableSignal<boolean>;
  @Input({required: true}) products!: WritableSignal<Product[]>;
  @Input({required: true}) showProducts!: WritableSignal<boolean>;
  @Input({required: true}) showOrder!: WritableSignal<boolean>;
  

  private _tableManagerService = inject(TableManagerService);
  private _productService = inject(ProductService);
  editItemMenu = signal<boolean>(false);
  itemToEdit = signal<Item>({} as Item);
  searchText =  signal("");  
  selectedProduct: Product | null = null;

  filteredProducts = computed(() => {
    const text = this.searchText().toLowerCase();
    return this.products().filter(
      p => p.name.toLowerCase().includes(text) ||
      p.category?.toLowerCase().includes(text) ||
      p.subCategory?.toLowerCase().includes(text)
    );
  })
 
  onCloseMenu(): void {
    this.isOpen.set(false);
    this.table.set(null);
  }

  printProducts(): void{
    console.table(this.products);
  }

  selectProduct(product: Product){
    this.selectedProduct = product;
  }

  addItemToOrder(quantity:number): void {
    const product = this.selectedProduct
    if(!this.table() || !product){
      alert("No selecciono ningún producto.\nSeleccione uno por favor.");
      return;
    }

    //Actualizo el stock
    this.updateProductStock(product.name, quantity);
    //Actualizo la informacion de la mesa
    this.table.update(t => {
      if(!t) return t; //Si no hay table, retorno

      const order = t.order //Si no hay order retorno
      if(!order){
        alert("La mesa no tiene una orden activa.\nPor favor, cree una nueva orden");
        return t; //Retorno la mesa como estaba
      }
      const existingItem = order.items.find(item => item.name === product.name);
      let newItems;
      //SI existe el item, lo modifico, sino cargo uno nuevo
      if(existingItem){
        newItems = order.items.map(item => 
                        item.name === product.name 
                        ? {...item, quantity: item.quantity+quantity} 
                        : item);
      }else{
        const newItem: Item = {
          name: product.name,
          price: product.price,
          quantity: quantity
        };

        //Cargo todos los items de la orden y le agrego el nuevo item
        newItems = [...order.items, newItem];
      }

      //Genero la nueva orden
      const newOrder: Order= {
        ...order,
        items: newItems,
        total: this.calculateTotalOrder({...order, items: newItems})
      }

      //Retorno la mesa con la nueva orden generada
      const newTable = {...t, order: newOrder};
      
      return newTable;
    })
    console.log("addItemToOrder: ", this.table());
    //Actualizo el estado de mesas en el localstorage
    this._tableManagerService.updateTableInLocalStorage(this.table()!);
    
  }

  private updateProductStock(productName: string, quantity:number, resetStock: boolean=false){
    //Verifico la cantidad ingresada
    if(quantity <= 0 ){
      alert("Debe ingresar una cantidad mayor a 0");
      return;
    }
    //Encuentro el producto con el nombre
    const prod = this.products().find(p => p.name === productName);
    if(!prod){
      alert("Producto no encontrado");
      return;
    }

    //Calculo el nuevo stock y verifico si es válido
    const newStock = resetStock ? prod.stock + quantity : prod.stock - quantity;
    if(newStock < 0){
      alert("Stock insuficiente.");
      return;
    }

    //Actualizo el producto en la BD
    const newProd: Product = {...prod, stock:newStock};
    this._productService.updateProduct(newProd.id!, newProd)
    .subscribe({
      // next: (resp) => {
      //   alert("Se modifico correctamente.\n")
      //   console.log(resp);
      // },
      error: (err) => {
        alert("Error al cargar producto a la orden.\n");
        console.error("Error al restaurar producto: ", err);
      }
    });

    //Actualizo la lista de productos
    this.products.update(prodList => {
      const copy = [...prodList];
      const index = copy.findIndex(p => p.name === productName);
      if(index !== -1){
        copy[index] = {...copy[index], stock: newStock}
      }     
      return copy;
    });
  }

  private calculateTotalOrder(order: Order): number {
    return order.items.reduce((total, actual) => total + (actual.price * actual.quantity), 0);
  }

  editItemFromOrder(item: Item): void {
    console.log("edit item");
    this.editItemMenu.update(v => !v);
    this.itemToEdit.set(item);
  }

  removeItemFromOrder(item: Item): void {
    console.log("remove item: ", item);
    
    this.table.update( t => {
      if(!t?.order) return t;

      let newTable: Table = {} as Table;
      const itemFromList = t.order.items.find(i => i.name === item.name);

      //TODO: Verificar si el cliente pago la compra para eliminar completamente la orden


      //Si queda un ultimo elemento a eliminar, no compruebo si existe
      if(t.order.items.length === 1){
        alert("Su orden quedo vacia");
        //Verificar información para dejar la orden correctamente
        // newTable = {...t, order: {
        //     id: t.order.id, 
        //     type: {name: ""} as OrderType,
        //     items:[], 
        //     total:0}
        // };
        newTable = {...t, order: undefined}
        console.log("newtAble: ",newTable);
        //Actualizo la informacion de stock y mesa
        this.updateProductStock(itemFromList?.name!, itemFromList?.quantity!, true);
        // this._tableManagerService.updateTableInLocalStorage(newTable);
      }else{
        
        //Cargo los items filtrados
        t.order.items = t.order.items.filter(i => i.name !== item.name);
        t.order.total = this.calculateTotalOrder(t.order);
        // const newItems = t.order.items.filter(i => i.name !== item.name);
        // const newTotal = this.calculateTotalOrder(t.order);
        
        //Actualizo items de la orden
        newTable = {...t, order: t.order}
        console.log("newtAble: ",newTable);
        // this._tableManagerService.updateOrder(t.id, t.order);
  
        //Reseteo el stock local y de db
        if(itemFromList){
          this.updateProductStock(itemFromList.name, itemFromList.quantity, true);
          console.log("itemFromList: updateStock");
          console.log("itemFromList: ", itemFromList);
        }
        //Actualizo la orden de la tabla en localstorage
        // this._tableManagerService.updateOrderFromTableInLocalStorage(newTable.id, newTable.order!);
      }
      this._tableManagerService.updateTableInLocalStorage(newTable);

      return newTable;
    })
    
  }

  freeTable():void {
    // this.updateTable(this.table);
    this.table.update(t => {
      if(!t) return t;

      const newTable: Table = {...t, order:undefined , status: 'AVAILABLE'}
      
      this._tableManagerService.updateTableInLocalStorage(newTable);
      // this.onCloseMenu();
      this.closeEditMenu();

      return newTable;
    });
    // this.table.order = {} as Order;
  }

  closeEditMenu():void{
    this.editItemMenu.set(false);
    this.table.update(t => {
      if(!t) return t;

      const newTable: Table = {...t}
      this._tableManagerService.updateTableInLocalStorage(newTable);
      return newTable;
    })
  }

  saveItemChanges(quantity: number): void{
    const item = this.itemToEdit();

    if(quantity <= 0){
      this.removeItemFromOrder(item);
      this.closeEditMenu();
      return;
    }

    this._tableManagerService.editItemInOrder(this.table()?.id!, item, quantity)
    this.closeEditMenu();
  }

  //Imprimir factura
  printCheck(): void {
    // this.printTicket();
    if(this.table()){
      const doc = new jsPDF();
      doc.setFontSize(16);
      //Si hay items en la orden, los imprimo. Sino imprimo mensaje
      if(this.table()!.order){
        doc.text(`Mesa: ${this.table()?.number} - Orden N°: ${this.table()?.order?.id}`, 10, 10);
  
        let yOffset = 15;
        this.table()?.order?.items.forEach(item => {
          doc.setFontSize(12);
          doc.text(`${item.name} - Cantidad: ${item.quantity} - Precio unitario: $${item.price} - Subtotal: $${item.price * item.quantity}`, 10, yOffset);
          yOffset += 10;
        });
  
        doc.setFontSize(14);
        doc.text(`Total: $${this.table()?.order?.total}`, 10, yOffset + 10);

      } else {
        doc.setFontSize(12);
        doc.text('No hay items en la orden.', 10, 20);
      }
  
      doc.save(`Comprobante_Mesa-${this.table()?.number}_${this.table()?.order?.id}.pdf`);
      console.log(`Cuenta de la mesa ${this.table()?.number} generada en PDF.`);
  
      this.freeTable();
    }

  }
}
