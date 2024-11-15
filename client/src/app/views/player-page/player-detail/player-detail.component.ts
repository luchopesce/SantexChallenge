import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RadarChartComponent } from '../../../core/components/radar-chart/radar-chart.component';
import { LineChartComponent } from '../../../core/components/line-chart/line-chart.component';
import { Player, PlayerHistory } from '../../../core/models/player.model';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RadarChartComponent, LineChartComponent],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
})
export class PlayerDetailComponent {
  @Input() player: Player | null = null;
  @Input() historyPlayer: PlayerHistory[] = [];
  @Input() error: any | null = null;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
