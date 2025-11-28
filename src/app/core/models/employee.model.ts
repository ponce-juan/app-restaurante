export interface Employee {
    id?: number;
    role: string;
    name: string;
    lastName: string;
    phone: string;
    email: string;
    dni: string;
    address: Address;
    user: UserDTO;
}

export interface User {
    id?: number;
    username: string;
    password: string;
    // employee: Employee;
    company: Company;
}

export interface Company {
    id?: number;
    name: string;
    tables: number;
}


export interface Address {
    street: string;
    number: number;
    city: string;
    country: string;
    state: string;
}

export interface UserDTO{
    username: string;
    password: string;
    companyId: number;
    // employeeId?: number;
}

export interface UserResponseDTO{
    id: number;
    username: string;
    role: 'SUPERVISOR' | 'MOZO' | 'COCINERO';
    employeeId: number;
    companyId: number;
}