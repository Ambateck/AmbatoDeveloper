import { Component, HostListener, signal, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainContentComponent } from './main-content/main-content.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import AOS from 'aos';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    FooterComponent,
    MainContentComponent,
    LeftSidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'AmbatoDeveloper';

  ngOnInit(): void {
    AOS.init({
      duration: 800,
      delay: 100,
      once: true,
      easing: 'ease-in-out',
    });
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      this.screenWidth.set(window.innerWidth);
    }
  }
  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}
