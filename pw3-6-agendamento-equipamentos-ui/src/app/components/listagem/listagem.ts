import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservaArmario } from '../../models/reserva-armario.model';
import { ReservaArmarioService } from '../../services/reserva-armario.service';

@Component({
  imports: [DatePipe, RouterLink],
  selector: 'app-listagem',
  styleUrl: './listagem.css',
  templateUrl: './listagem.html',
})
export class Listagem implements OnInit {
  private service = inject(ReservaArmarioService);

  reservas = signal<ReservaArmario[]>([]);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe((dados) => this.reservas.set(dados));
  }

  // Regra de negócio: encerra a reserva e libera o armário
  liberar(reserva: ReservaArmario): void {
    this.service.liberar(reserva.id!).subscribe(() => this.carregar());
  }

  excluir(reserva: ReservaArmario): void {
    if (!confirm(`Excluir a reserva do armário ${reserva.numeroArmario}?`)) {
      return;
    }
    this.service.excluir(reserva.id!).subscribe(() => this.carregar());
  }
}
