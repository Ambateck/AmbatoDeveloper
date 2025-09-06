import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-call',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.css']
})
export class CallComponent {
  companyNumbers = [
    {
      department: 'Ventas',
      number: '+593 99 258 3239',
      icon: 'fab fa-whatsapp',
      hours: 'Lunes a Viernes, 9am - 6pm',
      type: 'whatsapp'
    },
    {
      department: 'Soporte Técnico',
      number: '+593 96 373 1616',
      icon: 'fas fa-headset',
      hours: 'Lunes a Viernes, 8am - 5pm',
      type: 'call'
    }
  ];

  getWhatsAppUrl(number: string): string {
    // Remove spaces, plus signs, and other non-digit characters
    const cleanedNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanedNumber}`;
  }

  getTelUrl(number: string): string {
    const cleanedNumber = number.replace(/[^0-9+]/g, '');
    return `tel:${cleanedNumber}`;
  }
}