import { Component } from '@angular/core';
import { SidebarService } from '../../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {

  constructor(public sidebarService:SidebarService) { 
    console.log("Nav component loaded");
  }

  openLoginSidebar() {
    console.log("Opening login sidebar");
    this.sidebarService.toggle();
  }

}
