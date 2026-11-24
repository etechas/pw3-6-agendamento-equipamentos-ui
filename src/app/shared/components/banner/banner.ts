import { Component, Input } from '@angular/core';
import { ContainerComponent } from '../container/container';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [ContainerComponent],
  templateUrl: './banner.html',
  styleUrl: './banner.css'
})
export class BannerComponent {
  @Input() titulo = '';
  @Input() subtitulo = '';
}
