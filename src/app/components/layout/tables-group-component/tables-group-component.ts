import { Component, DestroyRef, inject, OnInit,signal } from '@angular/core';
import { TableComponent } from '../../table-component/table-component';
import { TableManagerService } from '../../../core/services/table-manager-service';
import { TableManagement } from '../../table-management/table-management';
import { Product } from '../../../interfaces/products';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Order, Table } from '../../../interfaces/table';
import { environment } from '../../../../environment/environments';


@Component({
  selector: 'app-tables-group-component',
  standalone: true,
  imports: [TableComponent, TableManagement],
  templateUrl: './tables-group-component.html',
  styleUrl: './tables-group-component.css'
})
export class TablesGroupComponent implements OnInit{

  private _destroyRef : DestroyRef = inject(DestroyRef);

  private _tableManagerService = inject(TableManagerService);
  private _tables = signal<Table[]>([]);
  public tables = this._tables.asReadonly();
  private _products = signal<Product[]>([]);
  public products = this._products.asReadonly();
  private tablesKey = environment.tableKeyLocalStorage;


  selectedTable: Table | null = null;
  order:  Order | null = null;
  menuIsOpen: boolean = false;
  
  ngOnInit(): void {
    this.loadTables();
    this.loadProducts();
  }


  private loadTables(): void{
    const tables = this._tableManagerService.getLocalTables();
    if(tables){
      this._tables.set(tables);
      this._tableManagerService.setLocalTables(this.tables());
      return;
    }

    this._tableManagerService.loadTables()
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (mesas) => {
        const newTables: Table[] = [];
        for(let i=1; i<=mesas; i++){
          newTables.push({
              id: i,
              name: `Mesa ${i}`,
              status: 'available'
          });
        }
        this._tables.set(newTables)
        this._tableManagerService.setLocalTables(this.tables());
      },
      error: (err) => {
        console.error("Error al obtener las mesas: ", err)
        this._tables.set([]);
      }
    })
  }

  private loadProducts(): void {
    this._tableManagerService.loadProducts()
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (products) => this._products.set(products),
      error: (err) => {
        console.error("Error al cargar los productos: ", err);
        this._products.set([]);
      }
    })

  }

  onAddProducts(table: Table) {
    this.selectedTable = table;
  }

  onSeeOrder(order: Order){
    this.order = order;
  }

  closeManager() {
    this.selectedTable = null;
  }


  selectAndOpenMenu(table: Table): void {
    this.selectedTable = table;
  }

  openMenu(table: Table): void {
    this.selectedTable = table;
    this.menuIsOpen = true;
  }

  closeMenu(): void {
    this.menuIsOpen = false;
    this.selectedTable = null;
  }

  addTable(): void{

    // const newTable: Table = {
    //   id: this._tableManagerService.tables().length + 1,
    //   name: `Mesa ${this._tableManagerService.tables().length + 1}`,
    //   status: 'available'
    // }
    // this.tables.push(newTable)

    // this._tableManagerService.addTable(newTable)
  }


}
