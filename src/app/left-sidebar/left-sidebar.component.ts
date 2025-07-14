import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-left-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.css'
})
export class LeftSidebarComponent {

  isLeftSidebarCollapsed = input.required<boolean>();
  changeIsLeftSidebarCollapsed = output<boolean>();

  items = [
    {
      routeLink: 'code-fest',
      icon: 'fa-solid fa-code',
      label: 'Code Fest',
    },
    {
      routeLink: 'dashboard',
      icon: 'fa-solid fa-chart-column',
      label: 'Compañia'
    },
    {
      routeLink: 'donations',
      icon: 'fa-solid fa-hand-holding-dollar',
      label: 'Donaciones',
    },
    {
      routeLink: 'free-design',
      icon: 'fa-solid fa-wind',
      label: 'Diseño Gratis'
    },
    {
      routeLink: 'job-market',
      icon: 'fa-solid fa-user-gear',
      label: 'Ingresa tu CV'
    },
    {
      routeLink: 'share-idea',
      icon: 'fa-solid fa-lightbulb',
      label: 'Banco de Ideas'
    }
  ];
  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed());
  }
  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }
}
