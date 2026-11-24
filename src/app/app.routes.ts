import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { ReservasComponent } from './pages/reservas/reservas';
import { ReservaFormComponent } from './pages/reserva-form/reserva-form';
import { NotFoundComponent } from './shared/components/not-found/not-found';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reservas', component: ReservasComponent },
  { path: 'reservas/nova', component: ReservaFormComponent },
  { path: 'reservas/:id/editar', component: ReservaFormComponent },
  { path: '**', component: NotFoundComponent }
];
