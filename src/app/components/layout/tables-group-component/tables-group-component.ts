import { Component, ElementRef, EventEmitter, inject, OnInit, Output, signal, ViewChild } from '@angular/core';
import { TableComponent } from '../../table-component/table-component';
import { Table, Order, Item } from '../../table-component/table-component';
import { TableMenu } from '../../table-menu/table-menu';
import { TableManagerService } from '../../../core/services/table-manager-service';


@Component({
  selector: 'app-tables-group-component',
  standalone: true,
  imports: [TableComponent, TableMenu],
  templateUrl: './tables-group-component.html',
  styleUrl: './tables-group-component.css'
})
export class TablesGroupComponent implements OnInit{

  @ViewChild('layout', {static: true}) layoutRef!: ElementRef;
  @ViewChild(TableComponent) tableChild!: TableComponent;
  tableManager = inject(TableManagerService);

  // draggingTable: Table | null = null;
  // selectedTable = signal<Table | null>(null);
  selectedTable: Table | null = null;
  menuIsOpen: boolean = false;

  // Lista de mesas incluidas en el layout de mesas
  // tables: Table[] = [];

  ngOnInit(): void {}


  openMenu(table: Table): void {
    this.selectedTable = table;
    this.menuIsOpen = true;
  }

  closeMenu(): void {
    this.menuIsOpen = false;
    this.selectedTable = null;
  }

    saveLayoutInSession(){
    const layout = sessionStorage.getItem('tables');
    let res;
    if(layout){
      res = confirm("Ya existe un layout guardado en sessionStorage. Desea sobreescribirlo?");
    }
    if(layout && !res) return;

    sessionStorage.setItem('tables', JSON.stringify(this.tableManager.tables));
    console.log("Layout guardado en sessionStorage");
  }

  loadLayoutFromSession(){
    const layout = sessionStorage.getItem('tables');
    if(layout){
      this.tableManager.loadTables(JSON.parse(layout));

      //Reseteo offsets de mesas del CDK
      setTimeout(() => {
        const drag = document.querySelectorAll<HTMLElement>('[cdkDrag]');
        drag.forEach((el: HTMLElement) => {
          el.style.transform = 'none';
        });
      });

      console.log("Layout cargado desde sessionStorage:", this.tableManager.tables);
    }
  }


  addTable(): void{

    const newTable: Table = {
      id: this.tableManager.tables().length + 1,
      name: `Mesa ${this.tableManager.tables().length + 1}`,
      status: 'available'
    }
    // this.tables.push(newTable)

    this.tableManager.addTable(newTable)
  }


}
