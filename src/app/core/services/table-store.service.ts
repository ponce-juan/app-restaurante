import { computed, inject, Injectable, signal } from '@angular/core';
import { TableService } from './table.service';
import { Table } from '@core/models/table.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableStoreService {

  private tableService = inject(TableService);

  private _tables = signal<Table[]>([]); //Estado global de mesas
  public tables = computed(() => this._tables());

  //Carga de mesas desde BD
  loadTables(): Observable<Table[]>{
    return this.tableService.getTables().pipe(
        tap(tables => this._tables.set([...tables].sort((a,b) => a.number - b.number)))
      )
  }

  //Actualizar una mesa de DB y del estado
  updateTableInDb(table: Table): Observable<Table>{
    
    return this.tableService.updateTable(table, table.id!!).pipe(
      tap(updated => {
        this._tables.update(prev => prev
                                    .map(t => t.id === updated.id ? updated : t)
                                    .sort((a,b) => a.number - b.number));
      })
    );
    
  }

  //Agrego una mesa en DB y en el estado
  addTableInDb(table: Table): Observable<Table>{
    return this.tableService.addTable(table).pipe(
      tap(created => {
        this._tables.update(prev => [...prev, created].sort((a,b) => a.number - b.number));
      })
    )
  }
  
  deleteTableInDb(tableNumber: number){
    return this.tableService.deleteTable(tableNumber).pipe(
      tap(() => {
        this._tables.update(prev => prev
                                    .filter(t => t.number !== tableNumber)
                                    .sort((a,b) => a.number - b.number))
      })
    )
  }


}
