import { Routes } from '@angular/router';
import { Home } from './components/layout/home/home';
import { App } from './app';

export const routes: Routes = [
    {path: '', 
        component: App, 
        children: [
            {path: 'home', component: Home}

        ]},
];