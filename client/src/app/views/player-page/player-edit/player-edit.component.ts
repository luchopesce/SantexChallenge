import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

interface Player {
  player_id: number;
  long_name: string;
  club_name: string;
  fifa_version: string;
  player_positions: string;
  overall: number;
  potential: number;
  nationality_name: string;
  pace?: number;
  shooting?: number;
  passing?: number;
  dribbling?: number;
  defending?: number;
  physic?: number;
}

type Field = {
  key: keyof Player;
  label: string;
  placeholder: string;
  required?: boolean;
};

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss'],
})
export class PlayerEditComponent implements OnInit, OnChanges {
  @Input() player: Player | null = null;
  @Input() error: any;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Player>();
  playerForm!: FormGroup;
  originalPlayer: Player | null = null;
  isFormChanged: boolean = false;

  constructor(private fb: FormBuilder) {}

  fieldsForm: Field[] = [
    {
      key: 'long_name',
      label: 'Name',
      placeholder: 'Enter name',
      required: true,
    },
    {
      key: 'club_name',
      label: 'Club',
      placeholder: 'Enter club',
      required: true,
    },
    {
      key: 'player_positions',
      label: 'Position',
      placeholder: 'Enter position',
      required: true,
    },
    {
      key: 'overall',
      label: 'Overall',
      placeholder: 'Enter overall',
      required: true,
    },
    {
      key: 'potential',
      label: 'Potential',
      placeholder: 'Enter potential',
      required: true,
    },
    {
      key: 'nationality_name',
      label: 'Nationality',
      placeholder: 'Enter nationality',
      required: true,
    },
    { key: 'pace', label: 'Pace', placeholder: 'Enter pace', required: true },
    {
      key: 'shooting',
      label: 'Shooting',
      placeholder: 'Enter shooting',
      required: true,
    },
    {
      key: 'passing',
      label: 'Passing',
      placeholder: 'Enter passing',
      required: true,
    },
    {
      key: 'dribbling',
      label: 'Dribbling',
      placeholder: 'Enter dribbling',
      required: true,
    },
    {
      key: 'defending',
      label: 'Defending',
      placeholder: 'Enter defending',
      required: true,
    },
    {
      key: 'physic',
      label: 'Physic',
      placeholder: 'Enter physic',
      required: true,
    },
  ];

  ngOnInit(): void {
    this.initializePlayerData();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] && this.player) {
      this.initializePlayerData();
      this.initializeForm();
    }
  }

  private initializePlayerData() {
    this.originalPlayer = this.player ? { ...this.player } : null;
  }

  private initializeForm() {
    const controlsConfig = this.fieldsForm.reduce((acc, field) => {
      const validators = field.required ? [Validators.required] : [];
      if (
        [
          'overall',
          'potential',
          'pace',
          'shooting',
          'passing',
          'dribbling',
          'defending',
          'physic',
        ].includes(field.key)
      ) {
        validators.push(this.integerValidator());
      }
      acc[field.key] = [
        this.originalPlayer ? this.originalPlayer[field.key] : '',
        validators,
      ];
      return acc;
    }, {} as { [key: string]: any });

    this.playerForm = this.fb.group(controlsConfig);
    this.playerForm.valueChanges.subscribe(() => this.checkFormChanges());
  }

  checkFormChanges() {
    const formValues = this.playerForm.getRawValue();
    const hasChanges = Object.keys(formValues).some((key) => {
      const originalValue = this.originalPlayer
        ? this.originalPlayer[key as keyof Player]
        : null;
      const currentValue = formValues[key];

      return currentValue !== originalValue;
    });

    this.isFormChanged = hasChanges && this.playerForm.valid;
  }

  integerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value !== null &&
        value !== '' &&
        (!Number.isInteger(+value) || Number.isNaN(+value))
        ? { integer: 'El valor debe ser un número entero' }
        : null;
    };
  }

  resetForm() {
    this.playerForm.reset(this.originalPlayer);
    this.playerForm.markAsPristine();
    this.error = null;
    this.loading = false;
  }

  onSave() {
    if (this.playerForm.valid) {
      this.save.emit({ ...this.originalPlayer, ...this.playerForm.value });
      this.resetForm();
    }
  }

  onClose() {
    this.close.emit();
    this.resetForm();
    this.isFormChanged = false;
  }
}
