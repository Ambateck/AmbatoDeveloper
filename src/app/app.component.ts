import { Component, HostListener, OnInit, signal, Renderer2, NgZone, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainContentComponent } from './main-content/main-content.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { AuthService } from './auth.service';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MainContentComponent,
    LeftSidebarComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'AmbatoDeveloper';

  private unlistenFuncs: (() => void)[] = [];

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
  }

  private syncPointer = (event: PointerEvent): void => {
    const x = event.clientX.toFixed(2);
    const y = event.clientY.toFixed(2);
    const xp = (event.clientX / window.innerWidth).toFixed(2);
    const yp = (event.clientY / window.innerHeight).toFixed(2);

    const style = this.document.documentElement.style;
    style.setProperty('--x', x);
    style.setProperty('--xp', xp);
    style.setProperty('--y', y);
    style.setProperty('--yp', yp);
  };

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const pointerMoveListener = this.renderer.listen('window', 'pointermove', this.syncPointer);
      this.unlistenFuncs.push(pointerMoveListener);
    });
  }

  ngOnDestroy(): void {
    const style = this.document.documentElement.style;
    style.removeProperty('--x');
    style.removeProperty('--xp');
    style.removeProperty('--y');
    style.removeProperty('--yp');

    this.unlistenFuncs.forEach(unlisten => unlisten());
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

