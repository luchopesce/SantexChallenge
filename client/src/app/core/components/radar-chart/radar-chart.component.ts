import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class RadarChartComponent implements OnChanges {
  @Input() player?: { long_name: string; skills: { [key: string]: number } };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Asegúrate de tener esto en false para permitir que el gráfico se ajuste.
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  public radarChartLabels: string[] = [];
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [],
  };
  public radarChartType: ChartType = 'radar';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] && this.player) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (this.player && this.player.skills) {
      this.radarChartLabels = Object.keys(this.player.skills);
      const statsArray = Object.values(this.player.skills);

      this.radarChartData = {
        labels: this.radarChartLabels,
        datasets: [
          {
            data: statsArray,
            label: this.player.long_name,
          },
        ],
      };
    }
  }
}
