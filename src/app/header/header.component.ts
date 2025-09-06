import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  items = [
    { key: 'Home', label: 'Inicio', icon: 'fas fa-home', routeLink: '/' },
    { key: 'CodeFest', label: 'Code Fest', icon: 'fas fa-laptop-code', routeLink: '/code-fest' },
    { key: 'Call', label: 'Llamada', icon: 'fas fa-phone', routeLink: '/call' },
    { key: 'Products', label: 'Productos', icon: 'fas fa-box', routeLink: '/products' },
    { key: 'Services', label: 'Servicios', icon: 'fas fa-cogs', routeLink: '/services' },
    { key: 'ShareIdea', label: 'Comparte tu Idea', icon: 'fas fa-lightbulb', routeLink: '/share-idea' },
    { key: 'JobMarket', label: 'Bolsa de Empleo', icon: 'fas fa-briefcase', routeLink: '/job-market' },
    { key: 'FreeDesign', label: 'Diseño Libre', icon: 'fas fa-paint-brush', routeLink: '/free-design' },
    { key: 'Donations', label: 'Donaciones', icon: 'fas fa-hand-holding-heart', routeLink: '/donations' },
    { key: 'Dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', routeLink: '/dashboard' },
    { key: 'Login', label: 'Login', icon: 'fas fa-user', routeLink: '/login' }
  ];

  showToolTip: { [key: string]: boolean } = {};
  isMobileMenuOpen: boolean = false; // New property for mobile menu

  toggleToolTip(key: string, show: boolean) {
    this.showToolTip[key] = show;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}

