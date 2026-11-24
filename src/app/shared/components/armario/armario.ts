import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Ícone reutilizável de armário.
 *
 * A cor muda conforme o estado:
 * - **disponivel**: pode ser reservado.
 * - **ocupado**: já tem reserva ativa no período; clique ignorado.
 * - **escolhido**: selecionado pelo usuário.
 *
 * Emite `armarioClick` ao clicar em um armário disponível ou escolhido.
 */
@Component({
  selector: 'app-armario',
  standalone: true,
  templateUrl: './armario.html',
  styleUrl: './armario.css'
})
export class ArmarioComponent {

  @Input() disponivel = true;
  @Input() escolhido = false;
  @Input() interativo = true;
  @Input() numero!: string;

  @Output() armarioClick = new EventEmitter<void>();

  get classe(): string {
    const base = this.interativo ? 'armario' : 'armario readonly';
    if (!this.disponivel) return base + ' ocupado';
    if (this.escolhido) return base + ' escolhido';
    return base + ' disponivel';
  }

  onClick(): void {
    if (!this.disponivel) return;
    this.armarioClick.emit();
  }
}
