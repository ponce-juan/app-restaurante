import { Component, EventEmitter, inject, Input, NgModule, Output, signal } from '@angular/core';
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
export class TableManagement {

  @Input() table!: Table;
  @Input() isOpen: boolean = false;
  @Input() products!: Product[];
  @Output() closeMenu = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  private _tableManagerService = inject(TableManagerService);
  editItemMenu = signal<boolean>(false);
  itemToEdit = signal<Item>({} as Item);
  selectedProduct: Product | null = null;
  searchText: String = "";
  
  
  onClose(): void {
    this.close.emit();
  }
  
  // updateTable(newTable: Table): void{
  //   this.table = newTable;
  //   this._tableManagerService.updateTable(this.table);
  // }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }

  printProducts(): void{
    console.table(this.products);
  }

  selectProduct(product: Product){
    this.selectedProduct = product;
  }

  addItem(quantity:number): void {
    const order = this.table.order;
    const product = this.selectedProduct
    
    if(order && product){
      //Actualizo el stock
      this.updateStock(product, quantity);

      const newItem :Item = {
        name: product.name,
        price: product.price,
        quantity: quantity
      }

      const existingItem = order.items.find(item => item.name === product.name)
      
      if(existingItem){
        existingItem.quantity += newItem.quantity;
        order.total = this.calculateTotalOrder(order);
        return;
      }
      
      //Actualizo la orden
      order.items.push(newItem);
      order.total = this.calculateTotalOrder(order);
      this._tableManagerService.updateTable(this.table);
    }else{
      alert("No seleccionó ningún producto.\nSeleccione uno por favor.");
    }
    
  }

  private updateStock(product: Product, quantity:number){
    const productIndex = this.products.findIndex(prod => prod.name === product.name)
    if(quantity <= 0 ){
      alert("Debe ingresar una cantidad mayor a 0");
      return;
    }
    if(productIndex == -1) {
      alert("No existe producto en nuestro menu"); 
      return;
    }
    if(this.products[productIndex].stock < quantity){
      alert("No hay stock suficiente.");
      return;
    }

    this.products[productIndex].stock -= quantity;
    
  }

  private calculateTotalOrder(order: Order): number {
    return order.items.reduce((total, actual) => total + (actual.price * actual.quantity), 0);
  }
  editItem(): void {
    console.log("edit item");
    
  }
  // editItem(id: number, item: Item): void {

  //   this.editItemMenu.update(v => !v);
  //   this.itemToEdit.set(item);

  //   console.log("Edit item:", item, "in table id:", id);
  // }

  removeItem(product: Product): void {
    console.log("remove item: ", product);
  }
  // removeItem(item: Item): void {
  //   this.tableManagerService.removeItemFromOrder(this.table.id, item);
  // }

  printTicket(): void {
    console.log(`Imprimiendo ticket de la mesa ${this.table.name}`);
    console.log("Detalles de la orden:", this.table.order);

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
    // const item = this.itemToEdit();
    // const {id} = this.table;

    // if(quantity <= 0){
    //   this.removeItem(item);
    //   this.closeEditMenu();
    //   return;
    // }

    // this.tableManagerService.editItemInOrder(id, item, quantity)
    // this.closeEditMenu();
  }

  filterProductList(): void{
    console.log()
  }

}
