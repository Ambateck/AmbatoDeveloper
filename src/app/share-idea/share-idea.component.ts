import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';
import { PasswordModalComponent } from '../header/services/password-modal/password-modal.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-share-idea',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordModalComponent, HttpClientModule, RouterLink],
  templateUrl: './share-idea.component.html',
  styleUrls: ['./share-idea.component.css']
})
export class ShareIdeaComponent implements OnInit {
  ideaText: string = '';
  isSubmitting = false;
  showSuccessMessage = false;
  isAuthenticated = false;
  user: User | null = null;

  ideas$!: Observable<any[]>;

  isPasswordModalVisible = false;
  currentActionId: string | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.ideas$ = this.firestoreService.getIdeas();
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.user = user;
    });
  }

  get remainingChars(): number {
    return 150 - this.ideaText.length;
  }

  async submitIdea(): Promise<void> {
    if (this.ideaText.trim().length === 0 || this.ideaText.length > 150) {
      return;
    }

    this.isSubmitting = true;
    try {
      await this.firestoreService.addIdea({ text: this.ideaText });
      this.showSuccessMessage = true;
      this.ideaText = '';
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting idea:', error);
      // Optionally, show an error message to the user
    } finally {
      this.isSubmitting = false;
    }
  }

  deleteIdea(id: string): void {
    this.currentActionId = id;
    this.isPasswordModalVisible = true;
  }

  onPasswordConfirmed(password: string) {
    this.http.post<{ success: boolean }>('http://localhost:3000/api/validate-password', { password })
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (this.currentActionId) {
              this.firestoreService.deleteIdea(this.currentActionId)
                .catch((err: any) => {
                  console.error('Error deleting idea:', err);
                  alert('Hubo un error al eliminar la idea.');
                });
            }
          } else {
            alert('Contraseña incorrecta.');
          }
          this.resetModalState();
        },
        error: (err: any) => {
          console.error('Error validating password:', err);
          alert('Contraseña incorrecta o error del servidor.');
          this.resetModalState();
        }
      });
  }

  onPasswordModalCanceled() {
    this.resetModalState();
  }

  private resetModalState() {
    this.isPasswordModalVisible = false;
    this.currentActionId = null;
  }
}
