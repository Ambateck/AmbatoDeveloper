import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalFormComponent } from './modal-form/modal-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-code-fest',
  standalone: true,
  imports: [CommonModule, ModalFormComponent],
  templateUrl: './code-fest.component.html',
  styleUrls: ['./code-fest.component.css'],
})
export class CodeFestComponent {
  isModalVisible = false;

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.router.navigate(['/services']);
  }

  cards = [
    {
      image: 'Categoria1.png',
      title: 'Categoría Fuerza Libre',
      subtitle: 'Tu código, tus reglas, crea sin límites.',
      characteristics: [
        'Los participantes pueden escoger libremente el lenguaje de programación',
        'Los participantes pueden libremente elegir el stack de tecnologías a usar',
        'Los participantes pueden escoger libremente el tema puede presentar Aplicaciones, Páginas Web, Programas',
        'El participante debe demostrar ser el autor del Software.',
        'Se admite la inscripción individual, equipos de dos o más personas.',
        'Se admite videojuegos'
      ]
    },
    {
      image: 'Categoria2.webp',
      title: 'Categoría AppSoluciones',
      subtitle: 'Tecnología en tus manos, impacto en tu ciudad.',
      characteristics: [
        'Los participantes pueden escoger libremente el lenguaje de programación',
        'Los participantes pueden escoger libremente el stack de tecnologías a usar',
        'Los participantes pueden presentar La Aplicación, Web de respaldo es obligatoria',
        'Los temas se escogerán en el nivel de inscripción.',
        'El participante debe demostrar ser el autor del Software.',
        'Se admite la inscripción individual, equipos de dos o más personas.'
      ]
    },
    {
      image: 'Categoria3.png',
      title: 'Categoría EcuaKotlin',
      subtitle: 'Premiamos tú código que transforma el futuro',
      characteristics: [
        'Los participantes trabajaran con Kotlin',
        'Los participantes pueden escoger libremente el stack de tecnologías a usar',
        'Los participantes pueden presentar La Aplicación, Web de respaldo es opcional',
        'Tema único, algoritmo y la arquitectura consta en el formulario de inscripción',
        'El participante debe demostrar ser el autor del Software.',
        'Se admite la inscripción individual, equipos de dos o más personas.'
      ]
    }
    ,
    {
      image: 'PremiosyRequistos.jpg',
      title: 'PREMIOS',
      subtitle: 'Dinero en efectivo para los tres primeros lugares de cada categoria y certificados de participación',
      characteristics: [
        'Cédula de identidad o pasaporte',
        'Autorización de representantes para menores de edad',
        'Pago voluntario de inscripción (10 USD por persona)',
        'Aceptar las bases del concurso',
        'Inscripción en la categoría correspondiente',
        'Aceptar los derechos de uso y distribución del software presentado',
      ]
    }
  ];

  constructor(
    private router: Router
  ) { }
}
