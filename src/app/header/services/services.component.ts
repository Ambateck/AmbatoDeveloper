import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firestore.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordModalComponent } from './password-modal/password-modal.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, PasswordModalComponent, HttpClientModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {

  private registrations$: Observable<any[]>;
  filteredAndPaginatedServices$: Observable<any[]>;

  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  itemsPerPage = 5;
  totalItems = 0;

  isPasswordModalVisible = false;
  currentActionId: string | null = null;
  currentActionType: 'validate' | 'delete' | null = null;

  isAuthenticated = false;
  user: User | null = null;

  constructor(private firestoreService: FirestoreService, private http: HttpClient, private authService: AuthService) {
    this.registrations$ = this.firestoreService.getRegistrations();

    this.filteredAndPaginatedServices$ = combineLatest([
      this.registrations$,
      this.searchTerm$.pipe(startWith('')),
      this.currentPage$.pipe(startWith(1))
    ]).pipe(
      map(([registrations, searchTerm, currentPage]) => {
        const filteredData = registrations.filter(reg =>
          (reg.nombreCompleto && reg.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reg.nombreGrupo && reg.nombreGrupo.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reg.categoria && reg.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reg.estado && reg.estado.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.totalItems = filteredData.length;

        const startIndex = (currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
      })
    );
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.user = user;
    });
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm$.next(term);
    this.currentPage$.next(1);
  }

  nextPage(): void {
    if (this.currentPage$.value < this.totalPages) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  editRegistration(id: string): void {
    if (!this.isAuthenticated) {
      alert('Debe iniciar sesión para editar un registro');
      return;
    }
    this.currentActionId = id;
    this.currentActionType = 'validate';
    this.isPasswordModalVisible = true;
  }

  deleteRegistration(id: string): void {
    if (!this.isAuthenticated) {
      alert('Debe iniciar sesión para eliminar un registro');
      return;
    }
    this.currentActionId = id;
    this.currentActionType = 'delete';
    this.isPasswordModalVisible = true;
  }

  onPasswordConfirmed(password: string): void {
    this.http.post<{ success: boolean }>('http://localhost:3000/api/validate-password', { password })
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (this.currentActionId && this.currentActionType) {
              if (this.currentActionType === 'validate') {
                this.firestoreService.updateRegistrationStatus(this.currentActionId, 'Aceptado')
                  .then(() => {
                    console.log('Estado de registro actualizado a Aceptado:', this.currentActionId);
                    alert('Estado actualizado a Aceptado.');
                  })
                  .catch((err: any) => {
                    console.error('Error al actualizar el estado:', err);
                    alert('Hubo un error al actualizar el estado.');
                  });
              } else if (this.currentActionType === 'delete') {
                this.firestoreService.deleteRegistration(this.currentActionId)
                  .then(() => {
                    console.log('Registro eliminado exitosamente');
                    alert('Registro eliminado exitosamente.');
                  })
                  .catch((err: any) => {
                    console.error('Error al eliminar el registro:', err);
                    alert('Hubo un error al eliminar el registro.');
                  });
              }
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
    this.currentActionType = null;
  }
}
