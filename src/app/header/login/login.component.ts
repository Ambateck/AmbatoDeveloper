import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  currentUser$: Observable<User | null>;
  imageError = false;

  constructor(private authService: AuthService, private location: Location, private router: Router) {
    this.currentUser$ = this.authService.currentUser$.pipe(
      tap(() => this.imageError = false)
    );
  }

  getInitials(name: string | null | undefined): string {
    if (!name) {
      return 'A'; // Default for Anonymous or null name
    }
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    const firstInitial = firstName ? firstName[0].toUpperCase() : '';
    const lastInitial = lastName ? lastName[0].toUpperCase() : '';
    return firstInitial + lastInitial;
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle().catch(error => {
      console.error('Error signing in with Google:', error);
    });
  }

  signInWithFacebook(): void {
    this.authService.signInWithFacebook().catch(error => {
      console.error('Error signing in with Facebook:', error);
    });
  }

  signInAnonymously(): void {
    this.authService.signInAnonymously().catch(error => {
      console.error('Error signing in anonymously:', error);
    });
  }

  signOut(): void {
    this.authService.signOut();
  }

  closeLogin(): void {
    this.router.navigate(['/code-fest']);
  }

  onImageError(): void {
    this.imageError = true;
  }
}

