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
import { Player, Field } from '../../../core/models/player.model';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss'],
})
export class PlayerEditComponent implements OnInit, OnChanges {
  @Input() player: Player | null = null;
  @Input() error: any | null = null;
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
    { key: 'pace', label: 'Pace', placeholder: 'Enter pace' },
    {
      key: 'shooting',
      label: 'Shooting',
      placeholder: 'Enter shooting',
    },
    {
      key: 'passing',
      label: 'Passing',
      placeholder: 'Enter passing',
    },
    {
      key: 'dribbling',
      label: 'Dribbling',
      placeholder: 'Enter dribbling',
    },
    {
      key: 'defending',
      label: 'Defending',
      placeholder: 'Enter defending',
    },
    {
      key: 'physic',
      label: 'Physic',
      placeholder: 'Enter physic',
    },
  ];

  ngOnInit() {
    this.initializePlayerData();
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
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
      if (field.key) {
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
      }
      return acc;
    }, {} as { [key: string]: any });

    this.playerForm = this.fb.group(controlsConfig);
    this.playerForm.valueChanges.subscribe(() => this.checkFormChanges());
  }

  getFieldErrors(key: string): string[] {
    const errors = this.playerForm.get(key)?.errors;
    if (!errors) return [];

    const errorMessages: string[] = [];
    if (errors['required']) errorMessages.push('Ingrese un valor');
    if (errors['integer'])
      errorMessages.push('El valor debe ser un número entero');
    if (errors['min']) errorMessages.push('Valor debe ser mayor a 0');
    if (errors['max']) errorMessages.push('Valor debe ser menor a 100');
    if (errors['minlength']) errorMessages.push('Mínimo 3 caracteres');

    return errorMessages;
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
