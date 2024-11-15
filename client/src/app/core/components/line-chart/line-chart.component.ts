import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, Colors } from 'chart.js';
import { PlayerHistory } from '../../models/player.model';

Chart.register(Colors);

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class LineChartComponent implements OnChanges {
  @Input() playerHistory: PlayerHistory[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Version',
          color: '#911',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        },
        ticks: {
          autoSkip: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor de habilidad',
          color: '#911',
          font: {
            family: 'Comic Sans MS',
            size: 20,
            weight: 'bold',
            lineHeight: 1.2,
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  public lineChartLabels: string[] = [];
  public lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [],
  };
  public lineChartType: ChartType = 'line';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['playerHistory'] && this.playerHistory) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (this.playerHistory && this.playerHistory.length > 0) {
      const firstVersion = this.playerHistory[0].skills;
      const skillNames = Object.keys(firstVersion);

      this.lineChartLabels = this.playerHistory.map((player) => player.version);

      const datasets = skillNames.map((skill, index) => {
        const data = this.playerHistory!.map((player) => player.skills[skill]);
        return {
          label: skill,
          data,
          fill: false,

          borderColor: undefined,
          tension: 0.1,
        };
      });

      this.lineChartData = {
        labels: this.lineChartLabels,
        datasets,
      };
    }
  }
}
