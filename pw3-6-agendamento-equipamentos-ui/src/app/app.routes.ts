import { Routes } from '@angular/router';
import { Listagem } from './components/listagem/listagem';
import { Formulario } from './components/formulario/formulario';

export const routes: Routes = [
  { path: '', component: Listagem },
  { path: 'novo', component: Formulario },
  { path: 'editar/:id', component: Formulario },
];
