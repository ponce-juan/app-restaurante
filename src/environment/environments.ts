export const environment = {
    production: false,
    tokenKeyLocalStorage: 'user',
    tableKeyLocalStorage: 'tables',
    baseUrl: 'http://localhost:8080/api/v1', //Desarrollo local
    // baseUrl: 'http://192.168.100.110:8080/api/v1', //Desarrollo usando pc como servidor
    endpoints: {
        login: '/auth/login',
        register: '/auth/register',
        users: '/users',
        categories: '/categories',
        subcategories: '/subcategories',
        products: '/products',
        employees: '/employees',
        ordersItems: '/order-items',
        orderTypes: '/order-types',
        orderStatus: '/order-status',
        orderCustomers: '/order-customers',
        companies: '/companies',
        tables: '/tables'
    }
}