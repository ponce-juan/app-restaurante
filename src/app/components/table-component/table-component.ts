import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Order, Table } from '../../interfaces/table';
import { TableManagerService } from '../../core/services/table-manager-service';

@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-component.html',
  styleUrl: './table-component.css'
})
export class TableComponent {
  
  protected menuIsOpen: boolean = false;
  private _tableManagerService = inject(TableManagerService);

  @Input()  setTable!: Table ;
  @Output() selectedTable = new EventEmitter<Table>();

  @Output() addProducts = new EventEmitter<Table>();
  @Output() seeOrder = new EventEmitter<Order>();
  

  onAddProducts(){
    this.addProducts.emit(this.setTable);
    this.openMenu();
    console.log("Add products to table id:", this.setTable.id);
  }

  onSeeOrder(){
    this.seeOrder.emit(this.setTable.order);
    this.openMenu();
  }


  openMenu(): void {
    this.selectedTable.emit(this.setTable);
  }
  closeMenu(): void {
    this.menuIsOpen = false;
  }

  reserveTable(): void {
    if(this.setTable.status === 'available'){
      this.setTable.status = 'reserved';
      this._tableManagerService.updateTable(this.setTable);
    } 
    
  }
  occupyTable(): void {
    if(this.setTable.status === 'available' || this.setTable.status === 'reserved'){
      this.setTable.status = 'occupied';
      this.setTable.order = {
        id: Date.now(),
        items: [],
        total: 0
      };
      this._tableManagerService.updateTable(this.setTable);

    }
  }
  freeTable(): void {
    if(this.setTable.status !== 'available'){
      this.setTable.status = 'available';
      this.setTable.order = undefined;
      this._tableManagerService.updateTable(this.setTable);

    }
  }
  addOrder(): void {
    if(this.setTable.status === 'available' || this.setTable.status === 'reserved'){
      this.setTable.status = 'occupied';
      this.setTable.order = {
        id: Date.now(),
        items: [],
        total: 0
      };
      this._tableManagerService.updateTable(this.setTable);

    }
  }

  getOrder(): void {
    console.log(`Imprimiendo ticket de la mesa ${this.setTable.name}`);
    console.log("Detalles de la orden:", this.setTable.order);

  }

  addProductTable(): void {
    
  }
  
}
