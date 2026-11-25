import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ReservaArmario } from '../models/reserva-armario.model';

@Injectable({ providedIn: 'root' })
export class ReservaArmarioService {
  private http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/api/armarios';

  listar(): Observable<ReservaArmario[]> {
    return this.http.get<ReservaArmario[]>(this.api).pipe(catchError(this.tratarErro));
  }

  listarAtivas(): Observable<ReservaArmario[]> {
    return this.http
      .get<ReservaArmario[]>(`${this.api}/ativas`)
      .pipe(catchError(this.tratarErro));
  }

  buscarPorId(id: number): Observable<ReservaArmario> {
    return this.http.get<ReservaArmario>(`${this.api}/${id}`).pipe(catchError(this.tratarErro));
  }

  cadastrar(reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http.post<ReservaArmario>(this.api, reserva).pipe(catchError(this.tratarErro));
  }

  atualizar(id: number, reserva: ReservaArmario): Observable<ReservaArmario> {
    return this.http
      .put<ReservaArmario>(`${this.api}/${id}`, reserva)
      .pipe(catchError(this.tratarErro));
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(catchError(this.tratarErro));
  }

  /** Regra de negócio: encerra a reserva (ativo = false). */
  liberar(id: number): Observable<ReservaArmario> {
    return this.http
      .patch<ReservaArmario>(`${this.api}/${id}/liberar`, {})
      .pipe(catchError(this.tratarErro));
  }

  /**
   * Captura o erro HTTP e devolve um Error com mensagem amigável.
   * Para 400/409 usa a mensagem enviada pelo backend (ex.: conflito de período).
   */
  private tratarErro(erro: HttpErrorResponse): Observable<never> {
    let mensagem: string;

    if (erro.status === 0) {
      mensagem = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
    } else if (erro.error?.message) {
      mensagem = erro.error.message;
    } else if (erro.status === 404) {
      mensagem = 'Registro não encontrado.';
    } else {
      mensagem = 'Ocorreu um erro inesperado. Tente novamente.';
    }

    return throwError(() => new Error(mensagem));
  }
}
