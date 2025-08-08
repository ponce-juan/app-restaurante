import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  isOpen = signal(false);

  toggle(): void {
    console.log("Toggling sidebar");
    console.log("isOpen before: ", this.isOpen());
    this.isOpen.update(value => !value)
    console.log("isOpen  after: ", this.isOpen());
  }

  open(): void {
    this.isOpen.set(true);
  }
  close(): void {
    this.isOpen.set(false);
  }

}
