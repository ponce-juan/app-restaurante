export interface Product {
    id?: number,
    name: string,
    description: string,
    price: number,
    stock: number,
    category: string,
    subCategory: string,
    // company: Company | null
}
// export interface Product {
//     id?: number,
//     name: string,
//     description: string,
//     price: number,
//     stock: number,
//     category: Category | null,
//     subCategory: Subcategory | null,
//     // company: Company | null
// }

export interface Category {
    id: number,
    name: string
}

export interface Subcategory {
    id: number,
    name: string
}

export interface Company {
    id: number
}