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
} from '@angular/forms';
import {
  FormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './player-edit.component.html',
  styleUrls: ['./player-edit.component.scss'],
})
export class PlayerEditComponent implements OnInit, OnChanges {
  @Input() player: any;
  @Input() error: any;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  fieldsForm = [
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
    { key: 'shooting', label: 'Shooting', placeholder: 'Enter shooting' },
    { key: 'passing', label: 'Passing', placeholder: 'Enter passing' },
    { key: 'dribbling', label: 'Dribbling', placeholder: 'Enter dribbling' },
    { key: 'defending', label: 'Defending', placeholder: 'Enter defending' },
    { key: 'physic', label: 'Physic', placeholder: 'Enter physic' },
  ];
  playerForm: FormGroup;
  originalPlayer: any = null;
  isFormChanged: boolean = false;

  constructor(private fb: FormBuilder) {}
  form: FormGroup;

  integerValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (
        value !== null &&
        value !== undefined &&
        !Number.isNaN(Number(value))
      ) {
        if (!Number.isInteger(Number(value))) {
          return { integer: 'El valor debe ser un número entero' };
        }
      } else if (value !== null && value !== undefined && value !== '') {
        return { integer: 'El valor debe ser un número entero' };
      }

      return null;
    };
  }

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

  private initializePlayerData(): void {
    if (this.player && Object.keys(this.player).length) {
      this.originalPlayer = { ...this.player };
    }
  }
  private initializeForm(): void {
    this.playerForm = this.fb.group({});
    this.fieldsForm.forEach((field) => {
      let validators = field.required ? [Validators.required] : [];

      switch (field.key) {
        case 'player_id':
        case 'fifa_version':
        case 'fifa_update':
        case 'overall':
        case 'potential':
        case 'value_eur':
        case 'age':
        case 'height_cm':
        case 'weight_kg':
        case 'pace':
        case 'shooting':
        case 'passing':
        case 'dribbling':
        case 'defending':
        case 'physic':
          validators.push(this.integerValidator());
          break;
      }

      const initialValue = this.originalPlayer
        ? this.originalPlayer[field.key]
        : '';
      this.playerForm.addControl(
        field.key,
        this.fb.control(initialValue, validators)
      );
    });

    this.playerForm.valueChanges.subscribe(() => {
      this.checkFormChanges();
    });
  }

  checkFormChanges(): void {
    const formValues = this.playerForm.value;
    const hasChanges = Object.keys(formValues).some(
      (key) => formValues[key] !== this.originalPlayer[key]
    );
    this.isFormChanged = hasChanges && this.playerForm.valid;
  }

  onSave(): void {
    if (this.playerForm.valid) {
      const updatedPlayer = {
        ...this.originalPlayer,
        ...this.playerForm.value,
      };

      this.save.emit(updatedPlayer);
      this.playerForm.reset(this.originalPlayer);
    }
  }

  onClose(): void {
    this.close.emit();
    this.playerForm.reset(this.originalPlayer);
    this.isFormChanged = false;
  }
}
