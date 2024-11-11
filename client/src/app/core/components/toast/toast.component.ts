import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  @Input() showToast: boolean = false;
  @Input() toastMessage: string = '';
  @Input() toastSize: string = '';
  @Output() onClose = new EventEmitter<void>();

  closeToast() {
    this.onClose.emit();
  }
}
