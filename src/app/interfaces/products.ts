export interface Product {
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number,
    category: Category;
    subCategory: Subcategory;
}

export interface Category {
    id: number,
    name: string
}

export interface Subcategory {
    id: number,
    name: string
}