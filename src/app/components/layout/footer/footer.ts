import { Component } from '@angular/core';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly author = "Juan Ponce";

}
