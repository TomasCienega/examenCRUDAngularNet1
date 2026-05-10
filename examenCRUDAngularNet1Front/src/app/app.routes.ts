import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';  
import { Inicio } from './components/inicio/inicio';// Importamos tu nuevo componente

export const routes: Routes = [
  { path: '', component: LoginComponent },      // Cuando la ruta sea vacía (al inicio)
  { path: 'login', component: LoginComponent }, 
  { path: 'inicio', component: Inicio },// Cuando escribas /login
  { path: '**', redirectTo: 'login', pathMatch: 'full' } // Si escriben cualquier cosa mal, mándalos al login
];