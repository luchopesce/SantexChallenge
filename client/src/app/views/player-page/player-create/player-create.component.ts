import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
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
  selector: 'app-player-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './player-create.component.html',
  styleUrls: ['./player-create.component.scss'],
})
export class PlayerCreateComponent implements OnInit {
  @Input() error: any;
  @Input() loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  fieldsForm = [
    {
      key: 'player_id',
      label: 'Player ID',
      placeholder: 'Enter player ID',
      required: true,
    },
    {
      key: 'fifa_version',
      label: 'FIFA Version',
      placeholder: 'Enter FIFA version',
      required: true,
    },
    {
      key: 'fifa_update',
      label: 'FIFA Update',
      placeholder: 'Enter FIFA update',
      required: true,
    },
    {
      key: 'long_name',
      label: 'Long Name',
      placeholder: 'Enter long name',
      required: true,
    },
    {
      key: 'player_positions',
      label: 'Player Positions',
      placeholder: 'Enter player positions',
      required: true,
    },
    {
      key: 'overall',
      label: 'Overall',
      placeholder: 'Enter overall rating',
      required: true,
    },
    {
      key: 'potential',
      label: 'Potential',
      placeholder: 'Enter potential rating',
      required: true,
    },
    { key: 'value_eur', label: 'Value EUR', placeholder: 'Enter value in EUR' },
    { key: 'age', label: 'Age', placeholder: 'Enter age', required: true },
    {
      key: 'height_cm',
      label: 'Height (cm)',
      placeholder: 'Enter height in cm',
    },
    {
      key: 'weight_kg',
      label: 'Weight (kg)',
      placeholder: 'Enter weight in kg',
    },
    {
      key: 'league_name',
      label: 'League Name',
      placeholder: 'Enter league name',
    },
    { key: 'club_name', label: 'Club Name', placeholder: 'Enter club name' },
    {
      key: 'club_position',
      label: 'Club Position',
      placeholder: 'Enter club position',
    },

    {
      key: 'nationality_name',
      label: 'Nationality Name',
      placeholder: 'Enter nationality name',
    },
    { key: 'pace', label: 'Pace', placeholder: 'Enter pace' },
    { key: 'shooting', label: 'Shooting', placeholder: 'Enter shooting' },
    { key: 'passing', label: 'Passing', placeholder: 'Enter passing' },
    { key: 'dribbling', label: 'Dribbling', placeholder: 'Enter dribbling' },
    { key: 'defending', label: 'Defending', placeholder: 'Enter defending' },
    { key: 'physic', label: 'Physic', placeholder: 'Enter physic' },
    {
      key: 'attacking_crossing',
      label: 'Attacking Crossing',
      placeholder: 'Enter attacking crossing',
    },
    {
      key: 'attacking_finishing',
      label: 'Attacking Finishing',
      placeholder: 'Enter attacking finishing',
    },
    {
      key: 'attacking_heading_accuracy',
      label: 'Attacking Heading Accuracy',
      placeholder: 'Enter heading accuracy',
    },
    {
      key: 'attacking_short_passing',
      label: 'Attacking Short Passing',
      placeholder: 'Enter short passing',
    },
    {
      key: 'attacking_volleys',
      label: 'Attacking Volleys',
      placeholder: 'Enter attacking volleys',
    },
    {
      key: 'skill_dribbling',
      label: 'Skill Dribbling',
      placeholder: 'Enter skill dribbling',
    },
    {
      key: 'skill_curve',
      label: 'Skill Curve',
      placeholder: 'Enter skill curve',
    },
    {
      key: 'skill_fk_accuracy',
      label: 'Skill FK Accuracy',
      placeholder: 'Enter free kick accuracy',
    },
    {
      key: 'skill_long_passing',
      label: 'Skill Long Passing',
      placeholder: 'Enter long passing',
    },
    {
      key: 'skill_ball_control',
      label: 'Skill Ball Control',
      placeholder: 'Enter ball control',
    },
    {
      key: 'movement_acceleration',
      label: 'Movement Acceleration',
      placeholder: 'Enter acceleration',
    },
    {
      key: 'movement_sprint_speed',
      label: 'Movement Sprint Speed',
      placeholder: 'Enter sprint speed',
    },
    {
      key: 'movement_agility',
      label: 'Movement Agility',
      placeholder: 'Enter agility',
    },
    {
      key: 'movement_reactions',
      label: 'Movement Reactions',
      placeholder: 'Enter reactions',
    },
    {
      key: 'movement_balance',
      label: 'Movement Balance',
      placeholder: 'Enter balance',
    },
    {
      key: 'power_shot_power',
      label: 'Power Shot Power',
      placeholder: 'Enter shot power',
    },
    {
      key: 'power_jumping',
      label: 'Power Jumping',
      placeholder: 'Enter jumping',
    },
    {
      key: 'power_stamina',
      label: 'Power Stamina',
      placeholder: 'Enter stamina',
    },
    {
      key: 'power_strength',
      label: 'Power Strength',
      placeholder: 'Enter strength',
    },
    {
      key: 'power_long_shots',
      label: 'Power Long Shots',
      placeholder: 'Enter long shots',
    },
    {
      key: 'mentality_aggression',
      label: 'Mentality Aggression',
      placeholder: 'Enter aggression',
    },
    {
      key: 'mentality_interceptions',
      label: 'Mentality Interceptions',
      placeholder: 'Enter interceptions',
    },
    {
      key: 'mentality_positioning',
      label: 'Mentality Positioning',
      placeholder: 'Enter positioning',
    },
    {
      key: 'mentality_vision',
      label: 'Mentality Vision',
      placeholder: 'Enter vision',
    },
    {
      key: 'mentality_penalties',
      label: 'Mentality Penalties',
      placeholder: 'Enter penalties',
    },
    {
      key: 'mentality_composure',
      label: 'Mentality Composure',
      placeholder: 'Enter composure',
    },
    {
      key: 'defending_marking',
      label: 'Defending Marking',
      placeholder: 'Enter marking',
    },
    {
      key: 'defending_standing_tackle',
      label: 'Defending Standing Tackle',
      placeholder: 'Enter standing tackle',
    },
    {
      key: 'defending_sliding_tackle',
      label: 'Defending Sliding Tackle',
      placeholder: 'Enter sliding tackle',
    },
    {
      key: 'goalkeeping_diving',
      label: 'Goalkeeping Diving',
      placeholder: 'Enter diving',
    },
    {
      key: 'goalkeeping_handling',
      label: 'Goalkeeping Handling',
      placeholder: 'Enter handling',
    },
    {
      key: 'goalkeeping_kicking',
      label: 'Goalkeeping Kicking',
      placeholder: 'Enter kicking',
    },
    {
      key: 'goalkeeping_positioning',
      label: 'Goalkeeping Positioning',
      placeholder: 'Enter positioning',
    },
    {
      key: 'goalkeeping_reflexes',
      label: 'Goalkeeping Reflexes',
      placeholder: 'Enter reflexes',
    },
    {
      key: 'goalkeeping_speed',
      label: 'Goalkeeping Speed',
      placeholder: 'Enter speed',
    },
    {
      key: 'player_face_url',
      label: 'Player Face URL',
      placeholder: 'Enter player face URL',
    },
  ];

  positions = [
    'CM',
    'CDM',
    'ST',
    'CF',
    'CM, CMD',
    'CDM, RB',
    'GK',
    'CDM, CM, CB',
    'CF, ST',
    'LB',
  ];

  league = [
    'Serie A',
    'La Liga',
    'Premier League',
    'Super Lig',
    'Serie B',
    'Major League Soccer',
    'League Two',
    'Championship',
    'Bundesliga',
    'Eredivisie',
  ];

  nationalities = [
    'Argentina',
    'Brazil',
    'France',
    'Germany',
    'Italy',
    'Spain',
    'Portugal',
    'England',
    'Netherlands',
    'Belgium',
    'Chile',
    'Colombia',
    'Mexico',
    'Uruguay',
    'Croatia',
    'Poland',
    'Sweden',
    'Russia',
    'Greece',
    'Turkey',
  ];

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({});
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
        case 'attacking_crossing':
        case 'attacking_finishing':
        case 'attacking_heading_accuracy':
        case 'attacking_short_passing':
        case 'attacking_volleys':
        case 'skill_dribbling':
        case 'skill_curve':
        case 'skill_fk_accuracy':
        case 'skill_long_passing':
        case 'skill_ball_control':
        case 'movement_acceleration':
        case 'movement_sprint_speed':
        case 'movement_agility':
        case 'movement_reactions':
        case 'movement_balance':
        case 'power_shot_power':
        case 'power_jumping':
        case 'power_stamina':
        case 'power_strength':
        case 'power_long_shots':
        case 'mentality_aggression':
        case 'mentality_interceptions':
        case 'mentality_positioning':
        case 'mentality_vision':
        case 'mentality_penalties':
        case 'mentality_composure':
        case 'defending_marking':
        case 'defending_standing_tackle':
        case 'defending_sliding_tackle':
        case 'goalkeeping_diving':
        case 'goalkeeping_handling':
        case 'goalkeeping_kicking':
        case 'goalkeeping_positioning':
        case 'goalkeeping_reflexes':
        case 'goalkeeping_speed':
          validators.push(this.integerValidator());
          break;

        default:
          break;
      }

      this.form.addControl(field.key, this.fb.control('', validators));
    });
  }

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

  matchRandom() {
    this.fieldsForm.forEach((field) => {
      const randomValue = this.getRandomValue(field.key);
      this.form.get(field.key)?.setValue(randomValue);
    });
  }

  getRandomValue(fieldKey: string): any {
    switch (fieldKey) {
      case 'player_id':
        return Math.floor(Math.random() * 10000);
      case 'fifa_version':
        return Math.floor(Math.random() * (24 - 15 + 1)) + 15;
      case 'fifa_update':
        return Math.floor(Math.random() * 100) + 1;
      case 'long_name':
        return 'Player ' + Math.floor(Math.random() * 100);
      case 'player_positions':
        return this.positions[
          Math.floor(Math.random() * this.positions.length)
        ];
      case 'value_eur':
        return Math.floor(Math.random() * 10000000);
      case 'age':
        return Math.floor(Math.random() * (40 - 15 + 1)) + 15;
      case 'height_cm':
        return Math.floor(Math.random() * (199 - 120 + 1)) + 120;
      case 'weight_kg':
        return Math.floor(Math.random() * (90 - 50 + 1)) + 50;
      case 'league_name':
        return this.league[Math.floor(Math.random() * this.league.length)];
      case 'club_name':
        return 'Club ' + Math.floor(Math.random() * 100);
      case 'club_position':
        return this.positions[
          Math.floor(Math.random() * this.positions.length)
        ];
      case 'nationality_name':
        return this.nationalities[
          Math.floor(Math.random() * this.nationalities.length)
        ];
      case 'overall':
      case 'potential':
      case 'pace':
      case 'shooting':
      case 'passing':
      case 'dribbling':
      case 'defending':
      case 'physic':
      case 'attacking_crossing':
      case 'attacking_finishing':
      case 'attacking_heading_accuracy':
      case 'attacking_short_passing':
      case 'attacking_volleys':
      case 'skill_dribbling':
      case 'skill_curve':
      case 'skill_fk_accuracy':
      case 'skill_long_passing':
      case 'skill_ball_control':
      case 'movement_acceleration':
      case 'movement_sprint_speed':
      case 'movement_agility':
      case 'movement_reactions':
      case 'movement_balance':
      case 'power_shot_power':
      case 'power_jumping':
      case 'power_stamina':
      case 'power_strength':
      case 'power_long_shots':
      case 'mentality_aggression':
      case 'mentality_interceptions':
      case 'mentality_positioning':
      case 'mentality_vision':
      case 'mentality_penalties':
      case 'mentality_composure':
      case 'defending_marking':
      case 'defending_standing_tackle':
      case 'defending_sliding_tackle':
      case 'goalkeeping_diving':
      case 'goalkeeping_handling':
      case 'goalkeeping_kicking':
      case 'goalkeeping_positioning':
      case 'goalkeeping_reflexes':
      case 'goalkeeping_speed':
        return Math.floor(Math.random() * 99) + 1;
      case 'player_face_url':
        const randomIndex = Math.floor(Math.random() * 100);
        return `https://randomuser.me/api/portraits/men/${randomIndex}.jpg`;

      default:
        return '';
    }
  }

  resetForm() {
    this.form.reset();
    this.error = null;
    this.loading = false;
  }

  onSave() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
    this.resetForm();
  }

  onClose() {
    this.close.emit();
    this.resetForm();
  }
}
