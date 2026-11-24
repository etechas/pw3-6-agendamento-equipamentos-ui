import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservaArmario } from '../models/reserva-armario.model';

@Injectable({ providedIn: 'root' })
export class ReservaArmarioService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/api/armarios';

  listar(): Observable<ReservaArmario[]> {
    return this.http.get<ReservaArmario[]>(this.api);
  }

  listarAtivas(): Observable<ReservaArmario[]> {
    return this.http.get<ReservaArmario[]>(`${this.api}/ativas`);
  }

  buscarPorId(id: number): Observable<ReservaArmario> {
    return this.http.get<ReservaArmario>(`${this.api}/${id}`);
  }

  cadastrar(reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http.post<ReservaArmario>(this.api, reserva);
  }

  atualizar(id: number, reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http.put<ReservaArmario>(`${this.api}/${id}`, reserva);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  /** Regra de negócio: encerra a reserva (ativo = false). */
  liberar(id: number): Observable<ReservaArmario> {
    return this.http.patch<ReservaArmario>(`${this.api}/${id}/liberar`, {});
  }
}
