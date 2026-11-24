import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaArmario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReservaArmarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/armarios';

  listar(): Observable<ReservaArmario[]> {
    return this.http.get<ReservaArmario[]>(this.apiUrl);
  }

  buscar(id: number): Observable<ReservaArmario> {
    return this.http.get<ReservaArmario>(`${this.apiUrl}/${id}`);
  }

  criar(reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http.post<ReservaArmario>(this.apiUrl, reserva);
  }

  atualizar(id: number, reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http.put<ReservaArmario>(`${this.apiUrl}/${id}`, reserva);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  liberar(id: number): Observable<ReservaArmario> {
    return this.http.patch<ReservaArmario>(`${this.apiUrl}/${id}/liberar`, {});
  }
}
