import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { Category, Product, Subcategory } from '../../../interfaces/products';
import { ProductsService } from '../../../core/services/products.service';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { SubcategoryService } from '../../../core/services/subcategory.service';
import { AuthService } from '../../../core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-management',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  templateUrl: './products-management.html',
  styleUrl: './products-management.css'
})
export class ProductsManagement implements OnInit{
  

  public products!: Observable<Product[]>;
  public categories!: Observable<Category[]>;
  public subcategories!: Observable<Subcategory[]>;

  public errorMsg: string = "";
  private productsService: ProductsService = inject(ProductsService);
  private categoriesService: CategoryService = inject(CategoryService);
  private subcategoryService: SubcategoryService = inject(SubcategoryService);
  private authService = inject(AuthService);
  
  showForm: boolean = false;
  newProduct: Product = {} as Product;
  subcategoriesList!: Subcategory[];
  categoriesList!: Category[];
  productList!: Product[];

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadSubcategories();
    // this.newProduct = this.createEmptyProduct();
  }

  //Load categories from DB
  loadCategories(): void {
    this.categories = this.categoriesService.getCategories()
    .pipe(
      tap( cat => {
        if(cat && cat.length > 0){
          this.newProduct.subCategory = cat[0];
        }
      }),
      catchError ((error:string) => {
        this.errorMsg = error;
        return EMPTY;
      })
    );
    this.categories
    .subscribe( cat => {
      this.categoriesList = cat;
    })
  }
  //Load subcategories from DB
  loadSubcategories(): void {
    this.subcategories = this.subcategoryService.getSubcategories()
    .pipe(
      tap( subcategories => {
        if(subcategories && subcategories.length > 0){
          this.newProduct.subCategory = subcategories[0];
        }
      }),
      catchError ((error:string) => {
        this.errorMsg = error;
        return EMPTY;
      })
    );
    this.subcategories
    .subscribe( subc => {
      this.subcategoriesList = subc;
    })
  }
  //Loas products from DB
  loadProducts(): void {
    this.products = this.productsService.getProducts().pipe(
      catchError ((error:string) => {
        this.errorMsg = error;
        return EMPTY;
      })
    );
    this.products
    .subscribe( prod => {
      this.productList = prod;
    })
  }

  toggleForm(): void {
    this.newProduct = this.createEmptyProduct();
    this.showForm = !this.showForm;
  }

  submitForm() {
    this.newProduct.company = {id: this.authService.getCompanyId()};
    
    console.log(this.newProduct);

    this.productsService.addProduct(this.newProduct).subscribe({
      next: (product) => {
        // console.log('Producto agregado:', product);
        this.loadProducts(); // Recargar la lista de productos
        this.showForm = false; // Ocultar el formulario
        this.newProduct = this.createEmptyProduct(); // Resetear el formulario
        alert("Producto agregado correctamente.");
      },
      error: (error) => {
        alert("No se pudo agregar el producto.\nIntente nuevamente.")
        console.error('Error al agregar el producto:', error);
      }
    });
  }

  createEmptyProduct(): Product {
    return {
      name: "",
      category: this.categoriesList[0],
      subCategory: this.subcategoriesList[0],
      price: 0,
      stock: 0,
      description: "",
      company: null
    }
  }

  updateProduct(prod: Product){
    this.newProduct = {...prod};
    
    //Asigno la categoria que ya pertenece al producto
    if(this.categoriesList && prod.category){
      const match = this.categoriesList.find(cat => cat.id === prod.category?.id)
      if(match) this.newProduct.category = match;
    }
    
    //Asigno la subcategoria que ya pertenece al producto
    if(this.subcategoriesList && prod.subCategory){
      const match = this.subcategoriesList.find(sub => sub.id === prod.subCategory?.id);
      if(match) this.newProduct.subCategory = match;
    }
    
    console.log(this.newProduct);
    this.showForm = true;
    // this.toggleForm();
  }

  deleteProduct(id: number){
    const resp = confirm("Desea eliminar el producto?");
    if(resp){
      this.productsService.deleteProduct(id)
      .subscribe({
        next: () => {
          alert("Producto eliminado correctamente.");
          this.loadProducts();
        },
        error: (err) => {
          console.error("Error eliminando producto: ", err);
          alert("No se pudo eliminar el producto. Intente nuevamente.");
        }
      })
    }
  }

  
}
