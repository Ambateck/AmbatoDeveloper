import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirestoreService } from '../firestore.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PasswordModalComponent } from '../header/services/password-modal/password-modal.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-free-design',
  standalone: true,
  imports: [FormsModule, CommonModule, PasswordModalComponent, HttpClientModule],
  templateUrl: './free-design.component.html',
  styleUrl: './free-design.component.css'
})
export class FreeDesignComponent implements OnInit {
  nombre = '';
  telefono = '';
  correoElectronico = '';
  direccion = '';
  descripcionDiseno = '';
  mensajeEnviado = false;
  isLoading = false;
  formVisible = true;

  private designRequests$: Observable<any[]>;
  filteredAndPaginatedRequests$: Observable<any[]>;

  searchTerm$ = new BehaviorSubject<string>('');
  currentPage$ = new BehaviorSubject<number>(1);
  itemsPerPage = 5;
  totalItems = 0;


  @ViewChild('requestsTable') requestsTable!: ElementRef;

  isPasswordModalVisible = false;
  currentActionId: string | null = null;
  currentActionType: 'validate' | 'delete' | null = null;

  isAuthenticated = false;
  user: User | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private zone: NgZone,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.designRequests$ = this.firestoreService.getDesignRequests();

    this.filteredAndPaginatedRequests$ = combineLatest([
      this.designRequests$,
      this.searchTerm$.pipe(startWith('')),
      this.currentPage$.pipe(startWith(1))
    ]).pipe(
      map(([requests, searchTerm, currentPage]) => {
        const filteredRequests = requests.filter(request =>
          (request.descripcion && request.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (request.nombre && request.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.totalItems = filteredRequests.length;

        const startIndex = (currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;

        return filteredRequests.slice(startIndex, endIndex);
      })
    );
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.user = user;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
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

  prevPage(): void {
    if (this.currentPage$.value > 1) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }

  async enviarSolicitud() {
    if (!this.isAuthenticated) {
      alert('You must be logged in to send a design request.');
      return;
    }

    this.isLoading = true;

    try {
      await this.firestoreService.agregarSolicitudDiseno({
        nombre: this.nombre,
        telefono: this.telefono,
        correoElectronico: this.correoElectronico,
        direccion: this.direccion,
        descripcion: this.descripcionDiseno,
        fecha: new Date(),
        estado: 'En revisión'
      });

      this.zone.run(() => {
        this.mensajeEnviado = true;
        this.formVisible = false;
        this.nombre = '';
        this.telefono = '';
        this.correoElectronico = '';
        this.direccion = '';
        this.descripcionDiseno = '';
        setTimeout(() => this.mensajeEnviado = false, 5000);

        setTimeout(() => {
          this.isLoading = false;
          if (this.requestsTable) {
            this.requestsTable.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 500);
      });
    } catch (error) {
      this.zone.run(() => {
        this.isLoading = false;
        alert('Hubo un error al enviar tu solicitud. Por favor, inténtalo de nuevo.');
      });
    }
  }

  updateStatus(id: string, currentStatus: string) {
    if (!this.isAuthenticated) {
      alert('You must be logged in to update a design request status.');
      return;
    }
    if (currentStatus === 'En revisión') {
      this.currentActionId = id;
      this.currentActionType = 'validate';
      this.isPasswordModalVisible = true;
    }
  }

  deleteRequest(id: string) {
    if (!this.isAuthenticated) {
      alert('You must be logged in to delete a design request.');
      return;
    }
    this.currentActionId = id;
    this.currentActionType = 'delete';
    this.isPasswordModalVisible = true;
  }

  onPasswordConfirmed(password: string) {
    this.http.post<{ success: boolean }>('http://localhost:3000/api/validate-password', { password })
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (this.currentActionId && this.currentActionType) {
              if (this.currentActionType === 'validate') {
                this.firestoreService.updateDesignRequestStatus(this.currentActionId, 'Elaborando')
                  .catch((err: any) => {
                    console.error('Error al actualizar el estado:', err);
                    alert('Hubo un error al actualizar el estado.');
                  });
              } else if (this.currentActionType === 'delete') {
                this.firestoreService.deleteDesignRequest(this.currentActionId)
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

  onPasswordModalCanceled() {
    this.resetModalState();
  }

  private resetModalState() {
    this.isPasswordModalVisible = false;
    this.currentActionId = null;
    this.currentActionType = null;
  }
}
