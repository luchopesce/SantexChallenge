import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RadarChartComponent } from '../../../core/components/radar-chart/radar-chart.component';
import { LineChartComponent } from '../../../core/components/line-chart/line-chart.component';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RadarChartComponent, LineChartComponent],
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
})
export class PlayerDetailComponent {
  @Input() player: any;
  @Input() historyPlayer: any[] = [];
  @Input() error: any;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
