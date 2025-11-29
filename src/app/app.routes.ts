import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { hasRoleGuard } from './core/guards/has-role-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import("./app").then(c => c.App)
    },
    {
        canMatch: [guestGuard],
        path: 'login',
        loadComponent: () => import('@layout/login/login').then(c => c.Login)
    },
    {
        canMatch: [authGuard],
        path: 'home',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR' ,'MOZO']
        },
        loadComponent: () => import("./core/layout/home/home").then(c => c.Home)

    },
    {
        canMatch: [authGuard],
        path: 'orders',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR' ,'MOZO']
        },
        loadComponent: () => import('./core/layout/orders-management/orders-management').then(c => c.OrdersManagement),
    },
    {
        canMatch: [authGuard],
        path: 'tables',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR' ,'MOZO']
        },
        loadComponent: () => import('./core/layout/tables-group-component/tables-group-component').then(c => c.TablesGroupComponent),
    },
    {
        canMatch: [authGuard],
        path: 'stock',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR']
        },
        loadComponent: () => import('./core/layout/products-management/products-management').then(c => c.ProductsManagement),
    },
    {
        canMatch: [authGuard],
        path: 'admin',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN']
        }, 
        loadComponent: () => import('./core/layout/admin/admin').then(m => m.Admin)
    },
    {
        canMatch: [authGuard],
        path: 'table-form/:id',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR']
        },
        loadComponent: () => import('@components/table-form/table-form').then(c => c.TableForm)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];