import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password-modal.component.html',
  styleUrl: './password-modal.component.css'
})
export class PasswordModalComponent {
  @Input() actionType: 'validate' | 'delete' | '' = '';
  @Output() passwordConfirmed = new EventEmitter<string>();
  @Output() canceled = new EventEmitter<void>();

  password = '';

  onConfirm(): void {
    this.passwordConfirmed.emit(this.password);
    this.password = ''; // Clear password after emit
  }

  onCancel(): void {
    this.canceled.emit();
    this.password = ''; // Clear password on cancel
  }
}
