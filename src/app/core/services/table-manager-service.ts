import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environments';
import { AuthService } from '@services/auth.service';
import { Product } from '@models/products.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { Table} from '@models/table.model';
import { ProductService } from '@services/product.service';
import { TableService } from '@services/table.service';
import { Item, Order } from '@core/models/order.model';


@Injectable({
  providedIn: 'root'
})
export class TableManagerService {
  
  // private http = inject(HttpClient);
  private authService = inject(AuthService);
  private productService = inject(ProductService);
  private tableService = inject(TableService);
  private tablesKey = environment.tableKeyLocalStorage;

  private calculateTotalOrder(order: Order): number {
    return order.items.reduce((total, actual) => total + (actual.price * actual.quantity), 0);
  }

  setLocalTables(tables: Table[]){
    localStorage.setItem(this.tablesKey, JSON.stringify(tables));
  }
  getLocalTables(): Table[]{
    return JSON.parse(localStorage.getItem(this.tablesKey) || '[]') as Table[];
  }

  //Actualizo el estado de las mesas
  updateTableInLocalStorage(newTable: Table): void {
    const tablesString = localStorage.getItem(this.tablesKey);
    if(tablesString){
      const tables = JSON.parse(tablesString) as Table[];
      const tableIndex = tables.findIndex(t => t.id === newTable.id);

      if(tableIndex != -1){
        tables[tableIndex] = newTable;
        this.setLocalTables(tables);
        // console.log("se actualizo localstorage de tables");
        return;
      }
    }

    throw new Error("Tables in localStorage not found");
  }

  //Agrego un item a la orden de una mesa
  addItemToOrder(id: number, item: Item): void{
    // const table = this._tables().find(t => t.id === id);
    // if(!table) return;
    // //Si no existe orden en la mesa, la creo
    // if(!table.order){
    //   table.order = {
    //     id: Date.now(),
    //     items: [],
    //     total: 0
    //   }
    // }

    // //Si ya existe el item en la orden, actualizo la cantidad
    // const existingItem = table.order.items.find(i => i.name === item.name);
    // if(!existingItem){
    //   table.order.items.push(item); 
    // }else{
    //   existingItem.quantity += item.quantity;
    // }

    // //Actualizo el total de la orden
    // table.order.total = this.calculateTotalOrder(table.order)

    // //Cambio el estado de la mesa a ocupada
    // table.status = 'occupied';

    // //Actualizo la lista de mesas
    // this._tables.update(tables => [... tables] );

  }

  //Elimino el item de la orden de una mesa
  // updateOrderFromTableInLocalStorage(tableId: number, newOrder: Order): void {
  //   // const table = this._tables().find(t => t.id === id);
  //   // if(!table || !table.order) return; //No existe mesa o no tiene orden
    
  //   // //Elimino el item de la orden
  //   // table.order.items = table.order.items.filter(i => i.name !== item.name);
  //   // table.order.total = this.calculateTotalOrder(table.order)
  //   // this._tables.update(tables => [... tables] );

  //   //Elimino item de la orden en localstorage
  //   const tables = this.getLocalTables();
  //   const updatedTables = tables.map(table => {
  //     if(table.id === tableId){
  //       return {...table, order: newOrder};
  //     }
  //     return table;
  //   })

  //   //Actualizo  el localstorage
  //   localStorage.setItem(this.tablesKey, JSON.stringify(updatedTables));
  // }

  // updateProduct(product: Product){
  //   if(product && product.id){
  //     this.productService.updateProduct(product.id, product)
  //     .pipe(
  //       tap ( () => {
  //           alert("Se actualizó correctamente el producto.")
  //         }
  //       ),
  //       catchError ((err) => {
  //           alert("Error al actualizar el producto.\n Intente nuevamente.")
  //           console.log(err)
  //           return EMPTY;
  //       })
  //     );
  //   }
  // }

  //Edito el item de la orden de una mesa
  editItemInOrder(id: number, item: Item, quantity: number): void {
    // const table = this._tables().find(t => t.id === id);
    // console.log("table:", table);
    // if(!table || !table.order) return; //Si no existe mesa o no tiene orden, retorno

    // const itemIndex = table.order.items.findIndex(i => i.name === item.name);
    // console.log("item index:", itemIndex);
    // if(itemIndex === -1) return; //Si no existe el item en la orden
    // console.log("Pase table e itemIndex");
    // table.order.items[itemIndex].quantity = quantity;
    // table.order.total = this.calculateTotalOrder(table.order)
    // console.log(`Cantidad del item ${item.name} actualizada a ${quantity} en la mesa ${table.name}`);
    
    // this._tables.update(tables => [... tables] );

  }

}


