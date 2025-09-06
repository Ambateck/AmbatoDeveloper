import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalFormComponent } from '../../code-fest/modal-form/modal-form.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ModalFormComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  isModalOpen = false;

  products = [
    {
      name: 'Código Plata',
      description: 'Una aplicación médica para la gestión de pacientes y citas.',
      category: 'App Móvil',
      icon: 'fas fa-heartbeat'
    },
    {
      name: 'Coches de Madera',
      description: 'Concurso anual de carreras de coches de madera artesanales.',
      category: 'Concurso',
      icon: 'fas fa-trophy'
    },
    {
      name: 'Golazo',
      description: 'Aplicación para registrar y premiar a los mejores deportistas locales.',
      category: 'App Móvil',
      icon: 'fa-solid fa-futbol'
    },
    {
      name: 'Leccionario Digital',
      description: 'App para el sistema escolar ecuatoriano, facilitando el seguimiento académico.',
      category: 'App Educativa',
      icon: 'fas fa-book-open'
    },
    {
      name: 'Mr. Ambato',
      description: 'Sistema de votación para el popular concurso de fisicoculturismo.',
      category: 'Concurso',
      icon: 'fas fa-dumbbell'
    },
    {
      name: 'Plan Antidrogas',
      description: 'Aplicación de concienciación y ayuda sobre el consumo de drogas.',
      category: 'App Social',
      icon: 'fas fa-shield-alt'
    },
    {
      name: 'Festival del Código 2026',
      description: 'El evento de programación más grande de la ciudad.',
      category: 'Evento',
      icon: 'fas fa-laptop-code'
    },
    {
      name: 'Seguridad Privada Ecuador',
      description: 'Plataforma web para la contratación y gestión de guardias de seguridad.',
      category: 'Web',
      icon: 'fas fa-user-shield'
    }
  ];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
