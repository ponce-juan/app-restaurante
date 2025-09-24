import { NgClass } from '@angular/common';
import { Component, Input, inject, WritableSignal } from '@angular/core';
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
  
  // protected menuIsOpen: boolean = false;
  private _tableManagerService = inject(TableManagerService);

  @Input({required: true}) table!: Table;
  // @Input({required: true}) table!: WritableSignal<Table | null>;
  @Input({required: true}) selectedTable!: WritableSignal<Table | null>;
  @Input({required: true}) menuTableIsOpen!: WritableSignal<boolean>;
  @Input({required: true}) showProductsInManager!: WritableSignal<boolean>;
  @Input({required: true}) showOrderInManager!: WritableSignal<boolean>;

  // @Output() selectedTable = new EventEmitter<Table>();

  // @Output() addProducts = new EventEmitter<Table>();
  // @Output() seeOrder = new EventEmitter<Order>();
  
  // onAddProducts(){
  //   this.addProducts.emit(this.setTable);
  //   this.openMenu();
  //   console.log("Add products to table id:", this.setTable.id);
  // }

  // onSeeOrder(){
  //   this.seeOrder.emit(this.setTable.order);
  //   this.openMenu();
  //   console.log("see order: ", this.setTable.order);
  // }
  // openMenu(): void {
  //   this.selectedTable.emit(this.setTable);
  // }
  // closeMenu(): void {
  //   this.menuIsOpen = false;
  // }
  private selectTableAndOpenMenu(){
    this.selectedTable.set(this.table);
    // this.selectedTable.set(this.table());
    this.menuTableIsOpen.set(true);
  }
  onAddProducts(){
    this.selectTableAndOpenMenu();
    this.showProductsInManager.set(true);
    this.showOrderInManager.set(false);
  }
  onSeeOrder(){
    this.selectTableAndOpenMenu();
    this.showOrderInManager.set(true);
    this.showProductsInManager.set(false);
  }

  reserveTable(): void {
    if(this.table.status === 'available'){
      this.table.status = 'reserved';
      this._tableManagerService.updateTable(this.table);
    } 
  }
  occupyTable(): void {
    if(this.table.status === 'available' || this.table.status === 'reserved'){
      this.table.status = 'occupied';
      this.table.order = {
        id: Date.now(),
        items: [],
        total: 0
      };
      this._tableManagerService.updateTable(this.table);

    }
  }
  freeTable(): void {
    if(this.table.status !== 'available'){
      this.table.status = 'available';
      this.table.order = undefined;
      this._tableManagerService.updateTable(this.table);

    }
  }
  addOrder(): void {
    if(this.table.status === 'available' || this.table.status === 'reserved'){
      this.table.status = 'occupied';
      this.table.order = {
        id: Date.now(),
        items: [],
        total: 0
      };
      this._tableManagerService.updateTable(this.table);

    }
  }

  getOrder(): void {
    console.log(`Imprimiendo ticket de la mesa ${this.table.name}`);
    console.log("Detalles de la orden:", this.table.order);

  }
  
//   occupyTable(): void {
//   this.table.update(t => {
//     if (!t) return t; // Si es null, retorno
//     if (t.status === 'available' || t.status === 'reserved') {
//       const newTable: Table = {
//         ...t,
//         status: 'occupied',
//         order: {
//           id: Date.now(),
//           items: [],
//           total: 0
//         }
//       };
//       // Actualizamos en el servicio
//       this._tableManagerService.updateTable(newTable);
//       return newTable;
//     }
//     return t;
//     });
//   }

// freeTable(): void {
//   this.table.update(t => {
//     if (!t) return t;
//     if (t.status !== 'available') {
//       const newTable: Table = {
//         ...t,
//         status: 'available',
//         order: undefined
//       };
//       this._tableManagerService.updateTable(newTable);
//       return newTable;
//     }
//     return t;
//   });
// }

// addOrder(): void {
//   this.table.update(t => {
//     if (!t) return t;
//     if (t.status === 'available' || t.status === 'reserved') {
//       const newTable: Table = {
//         ...t,
//         status: 'occupied',
//         order: {
//           id: Date.now(),
//           items: [],
//           total: 0
//         }
//       };
//       this._tableManagerService.updateTable(newTable);
//       return newTable;
//     }
//     return t;
//   });
// }

// getOrder(): void {
//   const t = this.table();
//   if (!t) {
//     console.log("No hay mesa seleccionada.");
//     return;
//   }
//   console.log(`Imprimiendo ticket de la mesa ${t.name}`);
//   console.log("Detalles de la orden:", t.order);
// }



}
