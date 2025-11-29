import { Component, inject, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableService } from '@services/table.service';
import { Table } from '@models/table.model';
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
  private tableID: number = 0;

  errorMsg = signal<string>("");

  @Output() cancel = new EventEmitter<void>();

  //Al iniciar componente, obtengo ID de mesa y cargo el formulario con su informacion
  ngOnInit(): void {
    this.tableID = Number(this.route.snapshot.paramMap.get('id'));
    if(this.tableID){
      const table = this._tableStore.tables().find(t => t.id === this.tableID);
      if(table){
        this.tableForm.patchValue(table);
      }
    }
  }

  //Forma de formulario 
  tableForm = this._fb.group({
    number: [1, [Validators.required, Validators.min(1)]],
    seats: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    location: ['INDOOR', [Validators.required]],
    status: ['AVAILABLE', [Validators.required]]
  });

  //Mensaje de error para formulario
  getFormErrorMessage(controlName: string): string | null {
    const control = this.tableForm.get(controlName);
    //Si no hubo accion en el control  el form retorno null
    if(!control || !control.touched || !control.invalid)
      return null;

    if(control.errors?.['required'])
      return "Este campo es obligatorio.";

    if(control.errors?.['min'])
      return `El valor debe ser mayor o igual que ${control.errors['min'].min}.`

    if(control.errors?.['max'])
      return `El valor debe ser menor o igual que ${control.errors['max'].max}.`

    return null;
  }

  //Cargo información de la mesa en el formulario
  loadTable(id: number) {
    this._tableService.getTableByNumber(id)
    .subscribe(table => {
      this.tableForm.patchValue(table);
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
  if(this.tableID)
    data.id = this.tableID;

  // console.log("Mesa on save: ", data)
  // console.log("table ID: ", this.tableID);

  if (this.tableID) {
    // EDITAR
    this._tableStore.updateTableInDb(data).subscribe({
      next: (t) => alert(`Mesa n° ${t.number} actualizada!`),
      error: (err) => alert(err.error?.message || "Unexpected error")
    });
  }else{
    // CREAR
    this._tableStore.addTableInDb(data).subscribe({
      next: (t) => alert(`Mesa creada correctamente.`),
      error: (err) => alert(err.error?.message || "Unexpected error")
    });
  }

  //Redirecciono 
  this.location.back();
}

  

}
