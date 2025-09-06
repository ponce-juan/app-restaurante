import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { Item, Order, Table } from '../table-component/table-component';
import { TableManagerService } from '../../services/table-manager-service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-table-menu',
  imports: [],
  templateUrl: './table-menu.html',
  styleUrl: './table-menu.css'
})
export class TableMenu {

  @Input() table!: Table;
  @Input() isOpen: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();
  
  tableManager = inject(TableManagerService);
  editItemMenu = signal<boolean>(false);
  itemToEdit = signal<Item>({} as Item);

  changeStatus(newStatus: Table['status']): void{
    this.table.status = newStatus;
    this.tableManager.updateStatus(this.table);
  }

  onCloseMenu(): void {
    this.closeMenu.emit();
  }

  addItem(table: Table): void {
    const {id} = table;
    const randIndex = Math.floor(Math.random() * this.tableManager.items().length)
    const item = this.tableManager.items()[randIndex];

    this.tableManager.addItemToOrder(id, item);
    console.log(`Item ${item.name} agregado a la mesa ${table.name}`);
  }

  editItem(id: number, item: Item): void {

    this.editItemMenu.update(v => !v);
    this.itemToEdit.set(item);

    console.log("Edit item:", item, "in table id:", id);
  }

  removeItem(item: Item): void {
    this.tableManager.removeItemFromOrder(this.table.id, item);
  }


  printCheck(): void {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`${this.table.name} - Orden N°: ${this.table.order?.id}`, 10, 10);

    if(this.table.order){
      let yOffset = 15;
      this.table.order.items.forEach(item => {
        doc.setFontSize(12);
        doc.text(`${item.name} - Cantidad: ${item.quantity} - Precio unitario: $${item.price} - Subtotal: $${item.price * item.quantity}`, 10, yOffset);
        yOffset += 10;
      });

      doc.setFontSize(14);
      doc.text(`Total: $${this.table.order.total}`, 10, yOffset + 10);
    } else {
      doc.setFontSize(12);
      doc.text('No hay items en la orden.', 10, 20);
    }

    doc.save(`Comprobante_${this.table.name.replace(" ", "-")}_${this.table.order?.id}.pdf`);
    console.log(`Cuenta de la mesa ${this.table.name} generada en PDF.`);

    this.freeTable();

  }

  freeTable():void {
    this.changeStatus('available');
    this.table.order = {} as Order;
    this.onCloseMenu();
  }

  closeEditMenu():void{
    this.editItemMenu.set(false);
  }

  saveItemChanges(quantity: number): void{
    const item = this.itemToEdit();
    const {id} = this.table;

    if(quantity <= 0){
      this.removeItem(item);
      this.closeEditMenu();
      return;
    }

    this.tableManager.editItemInOrder(id, item, quantity)
    this.closeEditMenu();
  }

}
