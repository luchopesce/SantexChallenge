import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importa FormsModule

@Component({
  selector: 'app-player-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-edit.component.html',
  styleUrl: './player-edit.component.scss',
})
export class PlayerEditComponent {
  @Input() player: any;
  loading: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  fieldsForm = [
    { key: 'fifa_version', label: 'Version', placeholder: 'Enter version' },
    { key: 'long_name', label: 'Name', placeholder: 'Enter name' },
    { key: 'club_name', label: 'Club', placeholder: 'Enter club' },
    {
      key: 'player_positions',
      label: 'Position',
      placeholder: 'Enter position',
    },
  ];

  onSave() {
    this.save.emit();
  }

  onClose() {
    this.close.emit();
  }
}
