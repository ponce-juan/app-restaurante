import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';

export interface Table {
  id: number;
  name: string;
  capacity?: number;
  status: 'available' | 'occupied' | 'reserved';
  order?: Order;
}

export interface Order {
  id: number;
  items: Item[];
  total: number;
}
export interface Item {
  name: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-component.html',
  styleUrl: './table-component.css'
})
export class TableComponent {
  // protected table: Table = {};
  protected menuIsOpen: boolean = false;
  
  @Input()  setTable!: Table ;
  @Output() selectedTable = new EventEmitter<Table>();


  //Evento que se va a emitir cuando mueva la posición de la mesa
  // @Output() tableMoved = new EventEmitter<CdkDragEnd>();

  //Evento que se va a emitir cuando cambie el estado de la mesa
  // @Output() tableStatusChanged = new EventEmitter<Table>();


  openMenu(): void {
    // this.menuIsOpen = !this.menuIsOpen;
    this.selectedTable.emit(this.setTable);
  }
  closeMenu(): void {
    this.menuIsOpen = false;
  }

  
}
