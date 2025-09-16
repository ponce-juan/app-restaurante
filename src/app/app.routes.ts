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
        loadComponent: () => import('./components/layout/login/login').then(c => c.Login)
    },
    {
        canMatch: [authGuard],
        path: 'home',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR' ,'MOZO']
        },
        loadComponent: () => import("./components/layout/home/home").then(c => c.Home)

    },
    {
        canMatch: [authGuard],
        path: 'tables',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR' ,'MOZO']
        },
        loadComponent: () => import('./components/layout/tables-group-component/tables-group-component').then(c => c.TablesGroupComponent),
    },
    {
        canMatch: [authGuard],
        path: 'menu',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN', 'SUPERVISOR']
        },
        loadComponent: () => import('./components/layout/products.menu/products.menu').then(c => c.ProductsMenu),
    },
    {
        canMatch: [authGuard],
        path: 'admin',
        canActivate: [hasRoleGuard],
        data: {
            roles: ['ADMIN']
        }
        , loadChildren: () => import('./components/layout/admin/admin').then(m => m.Admin)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];