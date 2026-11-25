import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservaArmario } from '../../models/reserva-armario.model';
import { ReservaArmarioService } from '../../services/reserva-armario.service';

interface Mensagem {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-listagem',
  styleUrl: './listagem.css',
  templateUrl: './listagem.html',
})
export class Listagem implements OnInit {
  private service = inject(ReservaArmarioService);

  reservas = signal<ReservaArmario[]>([]);
  mensagem = signal<Mensagem | null>(null);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe({
      next: (dados) => this.reservas.set(dados),
      error: (err: Error) => this.mostrarErro(err),
    });
  }

  // Regra de negócio: encerra a reserva e libera o armário
  liberar(reserva: ReservaArmario): void {
    this.service.liberar(reserva.id!).subscribe({
      next: () => {
        this.mensagem.set({ tipo: 'sucesso', texto: 'Reserva liberada com sucesso!' });
        this.carregar();
      },
      error: (err: Error) => this.mostrarErro(err),
    });
  }

  excluir(reserva: ReservaArmario): void {
    if (!confirm(`Excluir a reserva do armário ${reserva.numeroArmario}?`)) {
      return;
    }
    this.service.excluir(reserva.id!).subscribe({
      next: () => {
        this.mensagem.set({ tipo: 'sucesso', texto: 'Reserva excluída com sucesso!' });
        this.carregar();
      },
      error: (err: Error) => this.mostrarErro(err),
    });
  }

  // A mensagem já vem tratada pelo service (inclui o texto do backend em 400/409)
  private mostrarErro(err: Error): void {
    this.mensagem.set({ tipo: 'erro', texto: err.message });
  }
}
