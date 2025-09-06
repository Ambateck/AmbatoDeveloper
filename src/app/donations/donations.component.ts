import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for ngFor

@Component({
  selector: 'app-donations',
  standalone: true, // Add standalone: true
  imports: [CommonModule], // Add CommonModule
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.css'
})
export class DonationsComponent {
  bankAccounts = [
    {
      fullName: 'Carlos Fernando Arroba López',
      idNumber: '1803293800',
      accountNumber: '1000150995',
      accountType: 'Ahorros',
      bankName: 'Cooperativa de Ahorro y Crédito el Sagrario'
    },
    {
      fullName: 'Teresa de Jesús Escobar Arcos',
      idNumber: '1802675296',
      accountNumber: '3769400400',
      accountType: 'Ahorros',
      bankName: 'Banco Pichincha'
    }
  ];
}
