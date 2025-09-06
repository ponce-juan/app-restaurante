import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import("./app").then(c => c.App)
    },
    {
        canMatch: [authGuard],
        path: 'home',
        loadComponent: () => import("./components/layout/home/home").then(c => c.Home),
    },
    {
        canMatch: [guestGuard],
        path: 'login',
        loadComponent: () => import('./components/layout/login/login').then(c => c.Login)
    },
    {
        canMatch: [authGuard],
        path: 'tables',
        loadComponent: () => import('./components/layout/tables-group-component/tables-group-component').then(c => c.TablesGroupComponent)
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];