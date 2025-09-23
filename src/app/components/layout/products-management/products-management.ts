import { Component, inject, OnInit } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Category, Product, Subcategory } from '../../../interfaces/products';
import { ProductsService } from '../../../core/services/products.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './products-management.html',
  styleUrl: './products-management.css'
})
export class ProductsManagement implements OnInit{

  public productList!: Observable<Product[]>;
  public categories!: Observable<Category[]>;
  public subcategories!: Observable<Subcategory[]>;

  public errorMsg: string = "";
  public loading: boolean = false;
  private productsService: ProductsService = inject(ProductsService);
  private categoriesService: CategoryService = inject(CategoryService);
  private subcategoryService: SubcategoryService = inject(SubcategoryService);
  private authService = inject(AuthService);

  showForm: boolean = false;
  newProduct: Product = {} as Product;

  ngOnInit(): void {
    this.showForm = false;
    this.loadProducts();
    this.loadCategories();
    this.loadSubcategories();

  }

  loadCategories(): void {
    this.categories = this.categoriesService.getCategories().pipe(
      catchError ((error:string) => {
        this.errorMsg = error;
        return EMPTY;
      })
    );
  }
  loadSubcategories(): void {
    this.subcategories = this.subcategoryService.getSubcategories().pipe(
      catchError ((error:string) => {
        this.errorMsg = error;
        return EMPTY;
      })
    );
  }

  loadProducts(): void {
    this.loading = true;
    this.productList = this.productsService.getProducts().pipe(
      catchError ((error:string) => {
        this.errorMsg = error;
        return EMPTY;
      })
    );
    this.productList.forEach(
      p => console.log(p)
    )
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  submitForm() {
    console.log(this.newProduct);
    this.newProduct.company = {id: this.authService.getCompanyId()};
    this.productsService.addProdcut(this.newProduct).subscribe({
      next: (product) => {
        console.log('Producto agregado:', product);
        this.loadProducts(); // Recargar la lista de productos
        this.showForm = false; // Ocultar el formulario
        this.newProduct = {} as Product; // Resetear el formulario
      },
      error: (error) => {
        console.error('Error al agregar el producto:', error);
      }
    });
  }
  
}
