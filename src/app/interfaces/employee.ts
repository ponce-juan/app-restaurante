export interface Employee {
    id?: number;
    role: string;
    person: Person;
}

export interface User {
    id?: number;
    username: string;
    password: string;
    employee: Employee;
    company: Company;
}

export interface Company {
    id?: number;
    name: string;
    tables: number;
}

export interface Person {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    dni: string;
    address: Address;
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
    employeeId: number;
}

export interface UserResponseDTO{
    id: number;
    username: string;
    role: 'SUPERVISOR' | 'MOZO';
    employeeId: number;
    companyId: number;
}