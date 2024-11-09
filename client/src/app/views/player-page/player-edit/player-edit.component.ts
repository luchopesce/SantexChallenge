import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    { key: 'long_name', label: 'Name', placeholder: 'Enter name' },
    { key: 'club_name', label: 'Club', placeholder: 'Enter club' },
    {
      key: 'player_positions',
      label: 'Position',
      placeholder: 'Enter position',
    },
    { key: 'overall', label: 'Overall', placeholder: 'Enter overall' },
    { key: 'potential', label: 'Potential', placeholder: 'Enter potential' },
    {
      key: 'nationality_name',
      label: 'Nationality',
      placeholder: 'Enter nationality',
    },
  ];

  originalPlayer: any = null;
  editedPlayer: any = null;
  isFormChanged: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializePlayerData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['player'] && this.player) {
      this.initializePlayerData();
    }

    if (changes['error'] && !this.loading && this.error) {
      this.resetEditedPlayer();
    }

    if (changes['error']) {
      this.cdr.detectChanges();
    }
  }

  private initializePlayerData(): void {
    if (this.player && Object.keys(this.player).length) {
      this.originalPlayer = { ...this.player };
      this.editedPlayer = { ...this.player };
      this.isFormChanged = false;
    }
  }

  private resetEditedPlayer(): void {
    this.editedPlayer = { ...this.originalPlayer };
    this.isFormChanged = false;
  }

  onSave() {
    this.save.emit(this.editedPlayer);
  }

  onClose() {
    this.close.emit();
    this.resetEditedPlayer();
    this.isFormChanged = false;
    this.error = null;
  }

  onFieldChange() {
    this.isFormChanged =
      JSON.stringify(this.editedPlayer) !== JSON.stringify(this.originalPlayer);
  }
}
