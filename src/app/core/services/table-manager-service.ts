import { Injectable, signal } from '@angular/core';
import { Item, Order, Table } from '../../components/table-component/table-component';


@Injectable({
  providedIn: 'root'
})
export class TableManagerService {
  
  items = signal<Item[]>([
    { name: 'Hamburguesa clásica', quantity: 1, price: 8.50 },
    { name: 'Pizza Margherita', quantity: 1, price: 12.00 },
    { name: 'Ensalada César', quantity: 1, price: 7.00 },
    { name: 'Papas fritas', quantity: 1, price: 3.50 },
    { name: 'Spaghetti Boloñesa', quantity: 1, price: 11.00 },
    { name: 'Pollo a la parrilla', quantity: 1, price: 13.50 },
    { name: 'Sopa de verduras', quantity: 1, price: 5.00 },
    { name: 'Sandwich de jamón y queso', quantity: 1, price: 6.50 },
    { name: 'Tacos de carne', quantity: 1, price: 9.00 },
    { name: 'Ceviche', quantity: 1, price: 10.50 },
    { name: 'Coca-Cola 500ml', quantity: 1, price: 2.50 },
    { name: 'Agua mineral', quantity: 1, price: 1.50 },
    { name: 'Jugo de naranja', quantity: 1, price: 3.00 },
    { name: 'Café americano', quantity: 1, price: 2.00 },
    { name: 'Té helado', quantity: 1, price: 2.50 },
    { name: 'Helado de vainilla', quantity: 1, price: 4.00 },
    { name: 'Brownie con chocolate', quantity: 1, price: 4.50 },
    { name: 'Cheesecake', quantity: 1, price: 5.00 },
    { name: 'Fruta fresca', quantity: 1, price: 3.50 },
    { name: 'Panqueques con miel', quantity: 1, price: 6.00 }
  ]);
  private _tables = signal<Table[]>([]);
  public tables = this._tables.asReadonly();
    
  //Agrego una mesa al layout
  addTable(table: Table): void {
    this._tables.update(tables => [... tables, table]);
  }

  loadTables(tables: Table[]):void{
    this._tables.set(tables);
  }

  private calculateTotalOrder(order: Order): number {
    return order.items.reduce((total, actual) => total + (actual.price * actual.quantity), 0);
  }

  //Actualizo el estado de una mesa
  updateStatus(updatedTable: Table): void {
    const table = this._tables().find(t => t.id === updatedTable.id);
    if(table){
      table.status = updatedTable.status;

      if(table.order?.items.length === 0 && updatedTable.status === 'available'){
        table.order = undefined;
      }

    } 


    this._tables.update(tables => [... tables]);
    console.log(`Estado de la mesa ${updatedTable.name} actualizado a ${updatedTable.status}`);

  }

  //Agrego un item a la orden de una mesa
  addItemToOrder(id: number, item: Item): void{
    const table = this._tables().find(t => t.id === id);
    if(!table) return;
    //Si no existe orden en la mesa, la creo
    if(!table.order){
      table.order = {
        id: Date.now(),
        items: [],
        total: 0
      }
    }

    //Si ya existe el item en la orden, actualizo la cantidad
    const existingItem = table.order.items.find(i => i.name === item.name);
    if(!existingItem){
      table.order.items.push(item); 
    }else{
      existingItem.quantity += item.quantity;
    }

    //Actualizo el total de la orden
    table.order.total = this.calculateTotalOrder(table.order)

    //Cambio el estado de la mesa a ocupada
    table.status = 'occupied';

    //Actualizo la lista de mesas
    this._tables.update(tables => [... tables] );

  }

  //Elimino el item de la orden de una mesa
  removeItemFromOrder(id: number, item: Item): void {
    const table = this._tables().find(t => t.id === id);
    if(!table || !table.order) return; //No existe mesa o no tiene orden
    
    //Elimino el item de la orden
    table.order.items = table.order.items.filter(i => i.name !== item.name);
    table.order.total = this.calculateTotalOrder(table.order)
    this._tables.update(tables => [... tables] );
  }

  //Edito el item de la orden de una mesa
  editItemInOrder(id: number, item: Item, quantity: number): void {
    const table = this._tables().find(t => t.id === id);
    console.log("table:", table);
    if(!table || !table.order) return; //Si no existe mesa o no tiene orden, retorno

    const itemIndex = table.order.items.findIndex(i => i.name === item.name);
    console.log("item index:", itemIndex);
    if(itemIndex === -1) return; //Si no existe el item en la orden
    console.log("Pase table e itemIndex");
    table.order.items[itemIndex].quantity = quantity;
    table.order.total = this.calculateTotalOrder(table.order)
    console.log(`Cantidad del item ${item.name} actualizada a ${quantity} en la mesa ${table.name}`);
    
    this._tables.update(tables => [... tables] );

  }

}


