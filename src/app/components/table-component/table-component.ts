import { NgClass } from '@angular/common';
import { Component, Input, inject, WritableSignal } from '@angular/core';
import { Table } from '../../interfaces/table';
import { TableManagerService } from '../../core/services/table-manager-service';

@Component({
  selector: 'app-table-component',
  standalone: true,
  imports: [NgClass],
  templateUrl: './table-component.html',
  styleUrl: './table-component.css'
})
export class TableComponent {
  
  private _tableManagerService = inject(TableManagerService);

  @Input({required: true}) table!: Table;
  @Input({required: true}) selectedTable!: WritableSignal<Table | null>;
  @Input({required: true}) menuTableIsOpen!: WritableSignal<boolean>;
  @Input({required: true}) showProductsInManager!: WritableSignal<boolean>;
  @Input({required: true}) showOrderInManager!: WritableSignal<boolean>;

  
  private selectTableAndOpenMenu(){
    if(this.table && this.table.order){
      this.selectedTable.set({
        ...this.table,
        order: this.table.order,
        status: this.table.status
      });
      this.menuTableIsOpen.set(true);
    }
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
      this._tableManagerService.updateTableInLocalStorage(this.table);
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
      this._tableManagerService.updateTableInLocalStorage(this.table);
    }
  }

  freeTable(): void {
    if(this.table && this.table?.order?.items?.length! > 0){
      alert("No se puede liberar, tiene productos cargados.\nDebe generar el comprobante para poder liberarla.")
      return;
    }
    if(this.table.status !== 'available'){
      this.table.status = 'available';
      this.table.order = undefined;
      this._tableManagerService.updateTableInLocalStorage(this.table);
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
      this._tableManagerService.updateTableInLocalStorage(this.table);

    }
  }

  getOrder(): void {
    console.log(`Imprimiendo ticket de la mesa ${this.table.name}`);
    console.log("Detalles de la orden:", this.table.order);
  }

  

  
}
