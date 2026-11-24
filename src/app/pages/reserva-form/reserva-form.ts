import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { ContainerComponent } from '../../shared/components/container/container';
import { ReservaArmarioService } from '../../core/services/reserva-armario.service';
import { ReservaArmario } from '../../core/models';

@Component({
  selector: 'app-reserva-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, ContainerComponent
  ],
  templateUrl: './reserva-form.html',
  styleUrl: './reserva-form.css'
})
export class ReservaFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(ReservaArmarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  id: number | null = null;

  form = this.fb.group({
    numeroArmario: ['', [Validators.required, Validators.maxLength(20)]],
    nomeAluno: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    dataInicio: ['', Validators.required],
    dataFim: ['', Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.id = Number(idParam);
      this.service.buscar(this.id).subscribe({
        next: r => this.form.patchValue({
          numeroArmario: r.numeroArmario,
          nomeAluno: r.nomeAluno,
          // o input datetime-local não aceita segundos/fração: corta em yyyy-MM-ddTHH:mm
          dataInicio: r.dataInicio.slice(0, 16),
          dataFim: r.dataFim.slice(0, 16)
        }),
        error: (e: HttpErrorResponse) => this.erro(e)
      });
      return;
    }

    // Vindo do mapa de armários: já chega com armário e período preenchidos
    const q = this.route.snapshot.queryParamMap;
    this.form.patchValue({
      numeroArmario: q.get('armario') ?? '',
      dataInicio: q.get('inicio') ?? '',
      dataFim: q.get('fim') ?? ''
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastr.warning('Corrija os campos destacados.');
      return;
    }

    const v = this.form.getRawValue();
    const reserva: ReservaArmario = {
      numeroArmario: v.numeroArmario!.trim(),
      nomeAluno: v.nomeAluno!.trim(),
      dataInicio: v.dataInicio!,
      dataFim: v.dataFim!
    };

    if (reserva.dataFim <= reserva.dataInicio) {
      this.toastr.warning('A data de fim deve ser posterior à data de início.');
      return;
    }

    const requisicao = this.id
      ? this.service.atualizar(this.id, reserva)
      : this.service.criar(reserva);

    requisicao.subscribe({
      next: () => {
        this.toastr.success(this.id ? 'Reserva atualizada.' : 'Reserva criada.');
        this.router.navigate(['/reservas']);
      },
      error: (e: HttpErrorResponse) => this.erro(e)
    });
  }

  // O backend devolve { mensagem } (409 quando a regra de conflito bloqueia)
  private erro(e: HttpErrorResponse): void {
    if (e.status === 0) {
      this.toastr.error('Sem conexão com o servidor. O backend está rodando?');
      return;
    }
    this.toastr.error(e.error?.mensagem ?? 'Erro inesperado.');
  }
}
