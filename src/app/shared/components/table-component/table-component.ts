import { NgClass } from '@angular/common';
import { Component, Input, inject, WritableSignal } from '@angular/core';
import { Table } from '@models/table.model';
import { TableManagerService } from '@services/table-manager-service';
import { OrderType } from '@models/order.types.model';
import { TableStoreService } from '@core/services/table-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-component.html',
  styleUrl: './table-component.css'
})
export class TableComponent {
  
  private _tableManagerService = inject(TableManagerService);
  private _tableStore = inject(TableStoreService)
  private router = inject(Router);

  @Input({required: true}) table!: Table;
  // @Input({required: true}) selectedTable!: WritableSignal<Table | null>;
  // @Input({required: true}) menuTableIsOpen!: WritableSignal<boolean>;
  // @Input({required: true}) showProductsInManager!: WritableSignal<boolean>;
  // @Input({required: true}) showOrderInManager!: WritableSignal<boolean>;

  
  // private selectTableAndOpenMenu(){
  //   if(this.table && this.table.order){
  //     this.selectedTable.set({
  //       ...this.table,
  //       order: this.table.order,
  //       status: this.table.status
  //     });
  //     this.menuTableIsOpen.set(true);
  //   }
  // }
  // onAddProducts(){
  //   this.selectTableAndOpenMenu();
  //   this.showProductsInManager.set(true);
  //   this.showOrderInManager.set(false);
  // }
  // onSeeOrder(){
  //   this.selectTableAndOpenMenu();
  //   this.showOrderInManager.set(true);
  //   this.showProductsInManager.set(false);
  // }

  editTable(table: Table){
    // console.log("id from table-component", table)
    this.router.navigate(['/table-form', table.id]);
  }
  deleteTable(tableNumber: number){
    console.log("mesa n: " + tableNumber);
    this._tableStore.deleteTableInDb(tableNumber).subscribe(
      {
        next: () => {alert("Mesa eliminada satisfactoriamente")},
        error: (err) => {alert(err.error.message)}
      }
    );
  }

  reserveTable(): void {
    if(this.table.status === 'AVAILABLE'){
      this.table.status = 'RESERVED';
      this._tableManagerService.updateTableInLocalStorage(this.table);
    }
  }
  occupyTable(): void {
    if(this.table.status === 'AVAILABLE' || this.table.status === 'RESERVED'){
      this.table.status = 'OCCUPIED';
      this.table.order = {
        id: Date.now(),
        type: {} as OrderType,
        items: [],
        total: 0
      };
      this._tableManagerService.updateTableInLocalStorage(this.table);
    }
  }

  freeTable(): void {
    if(this.table && this.table?.order?.items?.length! > 0){
      alert("No se puede liberar, tiene productos cargados.\nDebe generar el comprobante para poder liberarla.")
      return;
    }
    if(this.table.status !== 'AVAILABLE'){
      this.table.status = 'AVAILABLE';
      this.table.order = undefined;
      this._tableManagerService.updateTableInLocalStorage(this.table);
    }
  }
  addOrder(): void {
    if(this.table.status === 'AVAILABLE' || this.table.status === 'RESERVED'){
      this.table.status = 'OCCUPIED';
      this.table.order = {
        id: Date.now(),
        type: {} as OrderType,
        items: [],
        total: 0
      };
      this._tableManagerService.updateTableInLocalStorage(this.table);

    }
  }

  getOrder(): void {
    console.log(`Imprimiendo ticket de la mesa ${this.table.number}`);
    console.log("Detalles de la orden:", this.table.order);
  }

  

  
}
