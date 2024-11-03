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
export class PlayerDetailComponent implements OnInit {
  @Input() player: any;
  @Output() close = new EventEmitter<void>();
  loading: boolean = false;

  ngOnInit(): void {}

  onClose() {
    this.close.emit();
  }
}
