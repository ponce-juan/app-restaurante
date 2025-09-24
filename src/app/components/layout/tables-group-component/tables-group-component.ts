import { Component, DestroyRef, effect, inject, OnInit,signal, WritableSignal } from '@angular/core';
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

  public tables = signal<Table[]>([]);
  public products = signal<Product[]>([]);
  
  // Flags
  selectedTable = signal<Table | null>(null);
  menuTableIsOpen = signal<boolean>(false);
  showProductsInManager = signal<boolean>(false);
  showOrderInManager = signal<boolean>(false);
  
  private tablesKey = environment.tableKeyLocalStorage;
  errorMessage = false;
  
  ngOnInit(): void {
    this.loadTables();
    this.loadProducts();
  }

  //Carga de mesas local o desde db
  private loadTables(): void{
    const tables = this._tableManagerService.getLocalTables();
    if(tables && tables.length > 0){
      this.tables.set(tables);
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
        this.tables.set(newTables)
        this._tableManagerService.setLocalTables(this.tables());
      },
      error: (err) => {
        console.error("Error al obtener las mesas: ", err)
        this.errorMessage = true;
        this.tables.set([]);
      }
    })
  }

  //Carga de productos desde db
  private loadProducts(): void {
    this._tableManagerService.loadProducts()
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (products) => {
        this.products.set(products);
        console.log("Se cargaron productos");
      },
      error: (err) => {
        console.error("Error al cargar los productos: ", err);
        this.errorMessage = true;
        this.products.set([]);
      }
    })

  }

  private resetFlags(){
    this.selectedTable.set(null);
    this.menuTableIsOpen.set(false);
    this.showOrderInManager.set(false);
    this.showProductsInManager.set(false);
  }

  onAddProducts(table: Table) {
    this.showProductsInManager.set(true);
    this.menuTableIsOpen.set(true);
    this.selectedTable.set(table);
  }
  
  onSeeOrder(){
    this.menuTableIsOpen.set(true);
    this.showOrderInManager.set(true);
  }

  //Metodo para cerrar el manejo de la mesa
  closeManager() {
    this.resetFlags();
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
