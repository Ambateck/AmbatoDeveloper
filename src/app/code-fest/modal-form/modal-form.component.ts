import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FirestoreService } from '../../firestore.service';

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.css'
})
export class ModalFormComponent {
  @Output() close = new EventEmitter<void>();
  tipoInscripcion: string | null = null;
  categoria: string | null = null;
  @ViewChild('comprobanteInput') comprobanteInput!: ElementRef;
  showSuccessMessage = false;
  isSubmitting = false;
  selectedFileName: string | null = null;

  constructor(private firestoreService: FirestoreService) { }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
    } else {
      this.selectedFileName = null;
    }
  }

  onClose = () => {
    this.close.emit();
  }

  async onSubmit(form: NgForm) {
    if (form.invalid || this.isSubmitting) {
      if (form.invalid) {
        Object.keys(form.controls).forEach(field => {
          const control = form.control.get(field);
          if (control) {
            control.markAsTouched({ onlySelf: true });
          }
        });
        alert('Por favor, complete todos los campos requeridos.');
      }
      return;
    }

    if (this.comprobanteInput.nativeElement.files.length === 0) {
      alert('Por favor, seleccione el comprobante de pago.');
      return;
    }

    const file: File = this.comprobanteInput.nativeElement.files[0];
    const MAX_SIZE = 75 * 1024;

    if (file.size > MAX_SIZE) {
      alert('El tamaño del archivo excede el límite de 75KB. Por favor, suba un archivo más pequeño.');
      this.isSubmitting = false;
      return;
    }

    this.isSubmitting = true;

    try {
      const file: File = this.comprobanteInput.nativeElement.files[0];
      const filePath = `comprobantes/${Date.now()}_${file.name}`;
      const downloadURL = await this.firestoreService.uploadFile(file, filePath);

      const formData = { ...form.value };
      delete formData.comprobante;
      formData.comprobanteUrl = downloadURL;
      formData.estado = 'verificando'; // Add initial status

      await this.firestoreService.addRegistration(formData);

      this.showSuccessMessage = true;

    } catch (error) {
      console.error('Error en el proceso de inscripción:', error);
      alert('Hubo un error durante el envío. Por favor, inténtelo de nuevo.');
    } finally {
      this.isSubmitting = false;
    }
  }
}