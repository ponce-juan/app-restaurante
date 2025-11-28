import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environments';
import { Observable } from 'rxjs';
import { Table } from '@models/table.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  
  private http = inject(HttpClient);
  private apiTablesUrl = environment.baseUrl+environment.endpoints.tables;
  
  //Obtengo todas las mesas de la compania
  getTables(): Observable<Table[]>{
    return this.http.get<Table[]>(`${this.apiTablesUrl}`);
  }

  //Obtengo mesa por numero
  getTableByNumber(tableNumber: number): Observable<Table>{
    return this.http.get<Table>(`${this.apiTablesUrl}/${tableNumber}`);
  }

  //Actualizo una mesa de la compania
  updateTable(newTable: Table, tableNumber: number): Observable<Table>{
    return this.http.put<Table>(`${this.apiTablesUrl}/${tableNumber}`, newTable);
  }

  //Agrego una mesa a la compania
  addTable(newTable: Table): Observable<Table> {
    return this.http.post<Table>(`${this.apiTablesUrl}`, newTable);
  }

  deleteTable(tableNumber: number): Observable<void>{
    return this.http.delete<void>(`${this.apiTablesUrl}/${tableNumber}`);
  }

}
