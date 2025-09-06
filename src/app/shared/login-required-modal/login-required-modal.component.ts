import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-required-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-required-modal.component.html',
  styleUrls: ['./login-required-modal.component.css']
})
export class LoginRequiredModalComponent {
  @Input() isVisible: boolean = false;
  @Input() message: string = 'Debes iniciar sesión para realizar esta acción.';
  @Output() close = new EventEmitter<void>();
  @Output() goToLogin = new EventEmitter<void>();

  onClose(): void {
    this.isVisible = false;
    this.close.emit();
  }

  onGoToLogin(): void {
    this.goToLogin.emit();
  }
}
