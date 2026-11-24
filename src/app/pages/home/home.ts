import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { BannerComponent } from '../../shared/components/banner/banner';
import { ContainerComponent } from '../../shared/components/container/container';
import { ArmarioComponent } from '../../shared/components/armario/armario';
import { ReservaArmarioService } from '../../core/services/reserva-armario.service';
import { ReservaArmario } from '../../core/models';
import { TOTAL_ARMARIOS } from '../../core/config';
import { dataHoraIso, paraMs } from '../../core/utils/datas';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, ContainerComponent, ArmarioComponent, MatFormFieldModule, MatInputModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {

  private service = inject(ReservaArmarioService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  readonly armarios = Array.from({ length: TOTAL_ARMARIOS }, (_, i) => String(i + 1));

  reservas = signal<ReservaArmario[]>([]);
  inicio = signal(dataHoraIso(0, '00:00'));
  fim = signal(dataHoraIso(30, '23:59'));

  periodoValido = computed(() => paraMs(this.fim()) > paraMs(this.inicio()));
  livres = computed(() => this.armarios.filter(n => this.livre(n)).length);

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: lista => this.reservas.set(lista),
      error: () => this.toastr.error('Não foi possível carregar as reservas. O backend está rodando?')
    });
  }

  /** Mesma regra do backend: inicio < fimExistente E fim > inicioExistente. */
  livre(numero: string): boolean {
    const inicio = paraMs(this.inicio());
    const fim = paraMs(this.fim());
    return !this.reservas().some(r =>
      r.ativo &&
      r.numeroArmario === numero &&
      inicio < paraMs(r.dataFim) &&
      fim > paraMs(r.dataInicio)
    );
  }

  alterarInicio(evento: Event): void {
    this.inicio.set((evento.target as HTMLInputElement).value);
  }

  alterarFim(evento: Event): void {
    this.fim.set((evento.target as HTMLInputElement).value);
  }

  reservar(numero: string): void {
    this.router.navigate(['/reservas/nova'], {
      queryParams: { armario: numero, inicio: this.inicio(), fim: this.fim() }
    });
  }
}
