import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  items = [
    { key: 'home', label: 'Inicio', icon: 'fa-solid fa-house-laptop', routeLink: '/home' },
    { key: 'services', label: 'Servicios', icon: 'fa-solid fa-people-roof', routeLink: '/services' },
    { key: 'products', label: 'Productos', icon: 'fa-solid fa-person-chalkboard', routeLink: '/products' },
    { key: 'call', label: 'Llámanos', icon: 'fas fa-phone', routeLink: '/call' },
    { key: 'login', label: 'Ingresar', icon: 'fa-solid fa-id-card', routeLink: '/login' }
  ];

  showToolTip: Record<string, boolean> = {};

  toggleToolTip(key: string, show: boolean): void {
    this.showToolTip[key] = show;
  }
}
