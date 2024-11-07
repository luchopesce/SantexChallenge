import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RadarChartComponent } from '../../../core/components/radar-chart/radar-chart.component';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RadarChartComponent],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
})
export class PlayerDetailComponent {
  @Input() player: any;
  @Output() close = new EventEmitter<void>();
  loading: boolean = false;

  onClose() {
    this.close.emit();
  }
}
