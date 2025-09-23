export const environment = {
    production: false,
    tokenKeyLocalStorage: 'user',
    tableKeyLocalStorage: 'tables',
    baseUrl: 'http://localhost:8080/api/v1',
    endpoints: {
        login: '/auth/login',
        register: '/auth/register',
        users: '/users',
        categories: '/categories',
        subcategories: '/subcategories',
        products: '/products',
        employees: '/employees',
        orders: '/orders',
        orderStatus: '/order-status',
        orderDetails: '/order-details',
        companies: '/companies'
        
    }
}