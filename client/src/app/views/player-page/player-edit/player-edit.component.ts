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
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onClose() {
    this.close.emit();
  }
}
