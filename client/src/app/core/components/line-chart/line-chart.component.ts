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
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: true,
  imports: [BaseChartDirective],
})
export class LineChartComponent implements OnChanges {
  @Input() playerHistory?: {
    version: string;
    skills: { [key: string]: number };
  }[];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Versiones',
        },
        ticks: {
          autoSkip: true,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Habilidades',
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

      // Configura las etiquetas (eje X)
      this.lineChartLabels = this.playerHistory.map((player) => player.version);

      // Para cada habilidad, crea un dataset
      const datasets = skillNames.map((skill) => {
        const data = this.playerHistory!.map((player) => player.skills[skill]); // Aquí estamos forzando que no sea undefined usando '!'
        return {
          label: skill,
          data,
          fill: false,
          borderColor: this.getRandomColor(), // Puedes asignar colores aleatorios o estáticos
          tension: 0.1,
        };
      });

      // Actualiza los datos del gráfico
      this.lineChartData = {
        labels: this.lineChartLabels,
        datasets,
      };
    }
  }

  // Función para generar colores aleatorios
  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
