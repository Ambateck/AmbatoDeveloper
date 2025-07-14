import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-content',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css'
})
export class MainContentComponent {
  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  sizeClass = computed(() => {
    const isCollapsed = this.isLeftSidebarCollapsed();
    return isCollapsed
      ? (this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen')
      : '';
  });
}

