import { Component, EventEmitter, inject, Input, NgModule, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { TableManagerService } from '../../core/services/table-manager-service';
import jsPDF from 'jspdf';
import { Product } from '../../interfaces/products';
import { Table, Item, Order } from '../../interfaces/table';
import { FormsModule } from '@angular/forms';


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
  editItemMenu = signal<boolean>(false);
  itemToEdit = signal<Item>({} as Item);
  selectedProduct: Product | null = null;
  searchText: String = "";  
 
 
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

  addItem(quantity:number): void {
    const product = this.selectedProduct
    if(!this.table() || !product){
      alert("No selecciono ningún producto.\nSeleccione uno por favor.");
      return;
    }

    //Actualizo el stock
    if(!this.updateStock(product.name, quantity)){
      //Si no hay stock disponible o cantidad valida, interrumpo la ejecución
      return;
    }

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
      return {...t, order: newOrder};
    })
    console.log(this.table());
    //Actualizo el estado global de la mesa
    this._tableManagerService.updateTable(this.table()!);


    // if(this.table()){
    //   const order = this.table()?.order;
      
    //   console.log("order: ", order)
    //   console.log("product: ", product)
    //   if(order && product != null){
    //     //Actualizo el stock
    //     if(this.updateStock(product.name, quantity)){
    //       const newItem :Item = {
    //         name: product.name,
    //         price: product.price,
    //         quantity: quantity
    //       }
    
    //       const existingItem = order.items.find(item => item.name === product.name)
    //       if(existingItem){
    //         existingItem.quantity += newItem.quantity;
    //         order.total = this.calculateTotalOrder(order);
    //         return;
    //       }
          
    //       //Actualizo la orden
    //       order.items.push(newItem);
    //       order.total = this.calculateTotalOrder(order);
    //       this._tableManagerService.updateTable(this.table()!);
    //     }
  
    //   }else{
    //     alert("No seleccionó ningún producto.\nSeleccione uno por favor.");
    //   }
    // }
    
  }

  private updateStock(productName: string, quantity:number, resetStock: boolean=false): boolean{
    // const productIndex = this.products().findIndex(prod => prod.name === productName)
    // if(quantity <= 0 ){
    //   alert("Debe ingresar una cantidad mayor a 0");
    //   return;
    // }
    // if(productIndex == -1) {
    //   alert("No existe producto en nuestro menu"); 
    //   return;
    // }
    // if(this.products()[productIndex].stock < quantity){
    //   alert("No hay stock suficiente.");
    //   return;
    // }

    // if(resetStock){
    //   this.products()[productIndex].stock += quantity;
    //   return;
    // }
    //Si no quiero resetear el stock, descuento la cantidad del producto
    // this.products()[productIndex].stock -= quantity;

    if(quantity <= 0 ){
      alert("Debe ingresar una cantidad mayor a 0");
      return false;
    }

    const prod = this.products().find(p => p.name === productName);
    if(!prod){
      alert("Producto no encontrado");
      return false;
    }

    const newStock = resetStock ? prod.stock + quantity : prod.stock - quantity;
    if(newStock < 0){
      alert("Stock insuficiente.");
      return false;
    }

    this.products.update(prodList => {
      const copy = [...prodList];
      const index = copy.findIndex(p => p.name === productName);
      if(index !== -1){
        copy[index] = {...copy[index], stock: newStock}
      }
      return copy;
      // return prodList.map( p => p.name ===productName ? {...p, stock: newStock} : p)
    });

    return true;
    
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
    //Elimino el item de la tabla localmente
    this.table.update( t => {
      if(!t?.order) return t;

      t.order.items = t.order.items.filter(i => i.name !== item.name);
      t.order.total = this.calculateTotalOrder(t.order);
            
      this._tableManagerService.updateOrder(t.id, t.order);

      console.log(t.order.items)
      //Reseteo el stock local y de db
      const itemIndex = t.order.items.findIndex(i => i.name === item.name);
      console.log(itemIndex);
      if(itemIndex !== -1){
        this.updateStock(t.order.items[itemIndex].name, t.order.items[itemIndex].quantity, true);
        console.log("itemFromItems: updateStock");
      }

      return {...t};
    })
    
  }

  printTicket(): void {
    console.log(`Imprimiendo ticket de la mesa ${this.table()?.name}`);
    console.log("Detalles de la orden:", this.table()?.order);

  }

  printCheck(): void {
    this.printTicket();
    // const doc = new jsPDF();
    
    // doc.setFontSize(16);
    // doc.text(`${this.table.name} - Orden N°: ${this.table.order?.id}`, 10, 10);

    // if(this.table.order){
    //   let yOffset = 15;
    //   this.table.order.items.forEach(item => {
    //     doc.setFontSize(12);
    //     doc.text(`${item.name} - Cantidad: ${item.quantity} - Precio unitario: $${item.price} - Subtotal: $${item.price * item.quantity}`, 10, yOffset);
    //     yOffset += 10;
    //   });

    //   doc.setFontSize(14);
    //   doc.text(`Total: $${this.table.order.total}`, 10, yOffset + 10);
    // } else {
    //   doc.setFontSize(12);
    //   doc.text('No hay items en la orden.', 10, 20);
    // }

    // doc.save(`Comprobante_${this.table.name.replace(" ", "-")}_${this.table.order?.id}.pdf`);
    // console.log(`Cuenta de la mesa ${this.table.name} generada en PDF.`);

    // this.freeTable();

  }

  // freeTable():void {
  //   this.updateTable(this.table);
  //   this.table.order = {} as Order;
  //   this.onCloseMenu();
  // }

  closeEditMenu():void{
    this.editItemMenu.set(false);
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

  filterProductList(): void{
    console.log()
  }

}
