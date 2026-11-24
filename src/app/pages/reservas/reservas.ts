import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { ContainerComponent } from '../../shared/components/container/container';
import { ReservaArmarioService } from '../../core/services/reserva-armario.service';
import { ReservaArmario } from '../../core/models';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [DatePipe, RouterLink, MatButtonModule, MatIconModule, ContainerComponent],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class ReservasComponent implements OnInit {

  private service = inject(ReservaArmarioService);
  private toastr = inject(ToastrService);

  reservas = signal<ReservaArmario[]>([]);

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.service.listar().subscribe({
      next: lista => this.reservas.set(lista),
      error: () => this.toastr.error('Não foi possível carregar as reservas. O backend está rodando?')
    });
  }

  liberar(reserva: ReservaArmario): void {
    this.service.liberar(reserva.id!).subscribe({
      next: () => {
        this.toastr.success(`Armário ${reserva.numeroArmario} liberado.`);
        this.carregar();
      },
      error: (e: HttpErrorResponse) => this.erro(e)
    });
  }

  excluir(reserva: ReservaArmario): void {
    if (!confirm(`Excluir a reserva do armário ${reserva.numeroArmario} (${reserva.nomeAluno})?`)) {
      return;
    }
    this.service.excluir(reserva.id!).subscribe({
      next: () => {
        this.toastr.success('Reserva excluída.');
        this.carregar();
      },
      error: (e: HttpErrorResponse) => this.erro(e)
    });
  }

  private erro(e: HttpErrorResponse): void {
    if (e.status === 0) {
      this.toastr.error('Sem conexão com o servidor. O backend está rodando?');
      return;
    }
    this.toastr.error(e.error?.mensagem ?? 'Erro inesperado.');
  }
}
