import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableService } from '@services/table.service';
import { Table } from '@models/table.model';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TableStoreService } from '@core/services/table-store.service';
import {Location} from '@angular/common'

@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './table-form.html',
  styleUrl: './table-form.css'
})
export class TableForm implements OnInit{

  private _fb = inject(FormBuilder);
  private _tableService = inject(TableService);
  private route = inject(ActivatedRoute);
  private _tableStore = inject(TableStoreService);
  private location = inject(Location);

  @Output() cancel = new EventEmitter<void>();

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(id){
      const table = this._tableStore.tables().find(t => t.id === id);
      if(table){
        this.tableForm.patchValue(table);
      }
    }
  }

  //Forma de formulario 
  tableId?: number;
  tableForm = this._fb.group({
    number: [1, [Validators.required, Validators.min(1)]],
    seats: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    location: ['INDOOR', [Validators.required]],
    status: ['AVAILABLE', [Validators.required]]
  });


  loadTable(id: number) {
    this._tableService.getTableByNumber(id)
    .subscribe(table => {
      this.tableForm.patchValue(table);
    });
  }

  listenToTableNumberChanges() {
  this.tableForm.get('number')?.valueChanges
    .pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(num => {

      if (typeof num === 'number' && num > 0) {

        this._tableService.getTableByNumber(num).subscribe({
          next: (table) => {
            this.tableId = table.id;
            this.tableForm.patchValue(table);
          },
          error: () => {
            // Si no existe la mesa, volvemos a modo "crear"
            this.tableId = undefined;
          }
        });

      } else {
        this.tableId = undefined;
      }

    });
}

  //Cancelar formulario
  onCancel() {
    // this.cancel.emit();
    this.location.back();
  } 
  
  
  //Guardar cambios del formulario
  save() {
  const data: Table = this.tableForm.value as Table;

  if (this.tableId) {
    // EDITAR
    this._tableService.updateTable(data, data.number).subscribe({
      next: (t) => alert(`Mesa n° ${t.number} actualizada!`),
      error: (err) => alert(err.error?.message || "Unexpected error")
    });

  } else {
    // CREAR
    this._tableService.addTable(data).subscribe({
      next: (t) => alert(`Mesa creada correctamente.`),
      error: (err) => alert(err.error?.message || "Unexpected error")
    });
  }
}

  

}
