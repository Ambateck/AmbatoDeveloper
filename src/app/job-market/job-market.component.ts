import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../firestore.service';
import { Observable } from 'rxjs';
import { PasswordModalComponent } from '../header/services/password-modal/password-modal.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';
import { LoginRequiredModalComponent } from '../shared/login-required-modal/login-required-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-market',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordModalComponent, HttpClientModule, LoginRequiredModalComponent],
  templateUrl: './job-market.component.html',
  styleUrls: ['./job-market.component.css']
})
export class JobMarketComponent implements OnInit {
  selectedFile: File | null = null;
  isDragOver = false;
  userName = '';
  isLoading = false;

  cvUploads$!: Observable<any[]>;
  isPasswordModalVisible = false;
  currentActionId: string | null = null;
  currentActionPayload: any = null;
  currentActionType: 'delete' | null = null;

  currentUser: User | null = null;
  isAuthenticated = false;
  showLoginRequiredModal = false;

  constructor(
    private firestoreService: FirestoreService,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.cvUploads$ = this.firestoreService.getCvUploads();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.validateFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.validateFile(event.dataTransfer.files[0]);
    }
  }

  private validateFile(file: File): void {
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecciona solo archivos PDF.');
      return;
    }

    if (file.size > 178 * 1024) {
      alert('El tamaño del archivo no debe exceder los 178 KB.');
      return;
    }

    this.selectedFile = file;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  async uploadCv(): Promise<void> {
    if (!this.isAuthenticated) {
      this.showLoginRequiredModal = true;
      return;
    }

    if (this.selectedFile && this.userName && this.currentUser) {
      this.isLoading = true;
      try {
        await this.firestoreService.uploadCv(this.selectedFile, this.userName, this.currentUser.uid);
        alert(`Gracias ${this.userName}, tu CV "${this.selectedFile.name}" ha sido enviado.`);
        this.selectedFile = null;
        this.userName = '';
      } catch (error: any) {
        console.error('Error uploading CV:', error);
        alert('Hubo un error al subir tu CV. Por favor, inténtalo de nuevo.');
      } finally {
        this.isLoading = false;
      }
    } else {
      alert('Por favor, completa todos los campos y selecciona un archivo.');
    }
  }

  deleteCv(cv: any): void {
    if (!this.isAuthenticated) {
      this.showLoginRequiredModal = true;
      return;
    }
    this.currentActionId = cv.id;
    this.currentActionPayload = cv.filePath;
    this.currentActionType = 'delete';
    this.isPasswordModalVisible = true;
  }

  onPasswordConfirmed(password: string): void {
    this.http.post<{ success: boolean }>('http://localhost:3000/api/validate-password', { password })
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (this.currentActionId && this.currentActionType === 'delete') {
              this.firestoreService.deleteCvUpload(this.currentActionId, this.currentActionPayload)
                .then(() => {
                  alert('CV eliminado exitosamente.');
                })
                .catch((err: any) => {
                  console.error('Error al eliminar el CV:', err);
                  alert('Hubo un error al eliminar el CV.');
                });
            }
          } else {
            alert('Contraseña incorrecta.');
          }
          this.resetModalState();
        },
        error: (err: any) => {
          console.error('Error de validación de contraseña:', err);
          alert('Contraseña incorrecta o error del servidor.');
          this.resetModalState();
        }
      });
  }

  onPasswordModalCanceled(): void {
    this.resetModalState();
  }

  private resetModalState(): void {
    this.isPasswordModalVisible = false;
    this.currentActionId = null;
    this.currentActionPayload = null;
    this.currentActionType = null;
  }

  onCloseLoginRequiredModal(): void {
    this.showLoginRequiredModal = false;
  }

  goToLogin(): void {
    this.showLoginRequiredModal = false;
    this.router.navigate(['/login']);
  }
}

