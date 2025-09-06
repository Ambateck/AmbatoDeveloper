import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { routeAnimations } from '../animations';

@Component({
  selector: 'app-main-content',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main-content.component.html',
  styleUrl: './main-content.component.css',
  animations: [routeAnimations],
})
export class MainContentComponent {
  private contexts = inject(ChildrenOutletContexts);

  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  sizeClass = computed(() => {
    const isCollapsed = this.isLeftSidebarCollapsed();
    return isCollapsed
      ? (this.screenWidth() > 768 ? 'body-trimmed' : 'body-md-screen')
      : '';
  });

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
