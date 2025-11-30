import { Component, DestroyRef, effect, inject, OnInit,signal, WritableSignal } from '@angular/core';
import { TableComponent } from '@components/table-component/table-component';
import { TableManagerService } from '@services/table-manager-service';
import { TableManagement } from '@components/table-management/table-management';
import { Product } from '@models/products.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Order, Table } from '@models/table.model';
import { environment } from '@environment/environments';
import { OrderType } from '@models/order.types.model';
import { OrderTypeService } from '@services/order-type.service';
import { TableService } from '@services/table.service';
import { ProductService } from '@services/product.service';
import { TableForm } from '@components/table-form/table-form';
import { TableStoreService } from '@core/services/table-store.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tables-group-component',
  standalone: true,
  // imports: [TableComponent, TableManagement, TableForm],
  imports: [TableComponent, FormsModule],
  templateUrl: './tables-group-component.html',
  styleUrl: './tables-group-component.css'
})
// export class TablesGroupComponent implements OnInit{
export class TablesGroupComponent implements OnInit{

  tableStore = inject(TableStoreService);
  private route = inject(Router);

  loading = signal(true)
  error = signal<string |null>(null);
  tableNumberToDelete: number | null = null;

  ngOnInit(): void {
    this.loadTables();
  }

  //Carga de mesas
  loadTables(){
    this.loading.set(true);

    this.tableStore.loadTables().subscribe({
      next: () => {
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false);
      }
    })
  }

  addTable(){
    this.route.navigate(['/table-form'])
  }
  confirmDelete(){
    //Si no ingreso un numero
    if(!this.tableNumberToDelete){
      alert("Debe ingresar un ID.");
      return;
    }
    //Si el numero es menor que 1
    if(this.tableNumberToDelete < 1){
      alert("Número ID de mesa erróneo. Debe ser mayor que 0.")
      return;
    }

    //Si ingreso un numero válido
    this.tableStore.deleteTableInDb(this.tableNumberToDelete).subscribe({
      next: () => alert("Mesa eliminada correctamente."),
      error: (err) => {
        alert(err.error?.message);
      }      
    })


  }




  // //Codigo anterior
  // private _destroyRef : DestroyRef = inject(DestroyRef);
  // private _tableManagerService = inject(TableManagerService);
  // private _tableService = inject(TableService)
  // private _productService = inject(ProductService)

  // public tables = signal<Table[]>([]);
  
  // //Refactorizar o implementar un servicio para la obtencion de productos.
  // public products = signal<Product[]>([]);
  
  // // Flags
  // selectedTable = signal<Table | null>(null);
  // menuTableIsOpen = signal<boolean>(false);
  // showProductsInManager = signal<boolean>(false);
  // showOrderInManager = signal<boolean>(false);

  // showTableForm = signal<boolean>(false);
  
  // private tablesKey = environment.tableKeyLocalStorage;
  // errorMessage = false;
  
  // // ngOnInit(): void {
  // //   this.loadTables();
  // //   this.loadProducts();
  // // }
 
  // //Para crear una nueva mesa
  // newTable: Table = {} as Table;

  // constructor() {
  //   this.loadTables();  
  //   this.loadProducts();
  // }
 

  // //Carga de mesas local o desde db
  // private loadTables(): void{
  //   const tables = this._tableManagerService.getLocalTables();
  //   if(tables && tables.length > 0){
  //     this.tables.set(tables);
  //     this._tableManagerService.setLocalTables(this.tables());
  //     return;
  //   }

  //   this._tableService.getTables()
  //   .pipe(takeUntilDestroyed(this._destroyRef))
  //   .subscribe({
  //     next: (mesas) => {
  //       // console.log("mesas: " + mesas); //Mostrar mesas en consola
  //       this.tables.set(mesas);
  //       this._tableManagerService.setLocalTables(this.tables());
  //     },
  //     error: (err) => {
  //       console.error("Error al obtener las mesas: ", err)
  //       this.errorMessage = true;
  //       this.tables.set([]);
  //     }
  //   })
  // }

  // //Carga de productos desde db
  // private loadProducts(): void {
  //   this._productService.getProducts()
  //   .pipe(takeUntilDestroyed(this._destroyRef))
  //   .subscribe({
  //     next: (products) => {
  //       this.products.set(products);
  //       console.log("Se cargaron productos");
  //     },
  //     error: (err) => {
  //       console.error("Error al cargar los productos: ", err);
  //       this.errorMessage = true;
  //       this.products.set([]);
  //     }
  //   })

  // }

  // private resetFlags(){
  //   this.selectedTable.set(null);
  //   this.menuTableIsOpen.set(false);
  //   this.showOrderInManager.set(false);
  //   this.showProductsInManager.set(false);
  // }

  // onAddProducts(table: Table) {
  //   this.showProductsInManager.set(true);
  //   this.menuTableIsOpen.set(true);
  //   this.selectedTable.set(table);
  // }
  
  // onSeeOrder(){
  //   this.menuTableIsOpen.set(true);
  //   this.showOrderInManager.set(true);
  // }

  // //Metodo para cerrar el manejo de la mesa
  // closeManager() {
  //   this.resetFlags();
  // }

  // openTableForm(): void{
  //   console.log("open table form")
  //   this.showTableForm.update(v => !v)
  // }
  // closeTableForm(): void {
  //   console.log("close table form")
  //   this.showTableForm.update(v => !v);
  // }

  // //No utlizada
  // // public showTables(){
  // //   this._tableManagerService.getTables()
  // //   .pipe(takeUntilDestroyed(this._destroyRef))
  // //   .subscribe({
  // //     next: (tables) => {
  // //       console.log(tables)
  // //     },
  // //     error: (err) => {
  // //       console.error("Error al cargar las mesas: ", err);
  // //       this.errorMessage = true;
  // //     }
  // //   })
    
  // // }

}
