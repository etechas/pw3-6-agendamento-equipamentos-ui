import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservaArmario } from '../../models/reserva-armario.model';
import { ReservaArmarioService } from '../../services/reserva-armario.service';

interface Mensagem {
  tipo: 'sucesso' | 'erro';
  texto: string;
}

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-formulario',
  styleUrl: './formulario.css',
  templateUrl: './formulario.html',
})
export class Formulario implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(ReservaArmarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Se a rota tiver :id, a tela funciona como edição; senão, como inclusão
  id: number | null = null;

  mensagem = signal<Mensagem | null>(null);
  salvando = signal(false);

  form = this.fb.group({
    numeroArmario: [null as number | null, [Validators.required, Validators.min(1)]],
    nomeAluno: ['', [Validators.required, Validators.maxLength(100)]],
    dataInicio: ['', Validators.required],
    dataFim: ['', Validators.required],
  });

  get numeroArmario() { return this.form.controls.numeroArmario; }
  get nomeAluno() { return this.form.controls.nomeAluno; }
  get dataInicio() { return this.form.controls.dataInicio; }
  get dataFim() { return this.form.controls.dataFim; }

  ngOnInit(): void {
    const idRota = this.route.snapshot.paramMap.get('id');
    if (idRota) {
      this.id = Number(idRota);
      this.service.buscarPorId(this.id).subscribe({
        next: (reserva) => this.form.patchValue(reserva),
        error: (err: Error) => this.mensagem.set({ tipo: 'erro', texto: err.message }),
      });
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    const reserva: ReservaArmario = {
      numeroArmario: v.numeroArmario!,
      nomeAluno: v.nomeAluno!,
      dataInicio: v.dataInicio!,
      dataFim: v.dataFim!,
    };

    this.salvando.set(true);
    this.mensagem.set(null);

    const requisicao = this.id
      ? this.service.atualizar(this.id, reserva)
      : this.service.cadastrar(reserva);

    requisicao.subscribe({
      next: () => {
        this.mensagem.set({ tipo: 'sucesso', texto: 'Reserva salva com sucesso!' });
        setTimeout(() => this.router.navigate(['/']), 1200);
      },
      error: (err: Error) => {
        this.salvando.set(false);
        this.mensagem.set({ tipo: 'erro', texto: err.message });
      },
    });
  }
}
