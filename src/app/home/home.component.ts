import { Component, AfterViewInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  private words = ['Websites', 'Apps', 'Premios', 'Concursos', 'Eventos'];
  private wordIndex = signal(0);
  private charIndex = signal(0);
  private isDeleting = signal(false);
  private delay = 100;
  displayText = signal('');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.animate();
    }
  }

  private animate(): void {
    const currentWord = this.words[this.wordIndex()];
    const currentChar = this.charIndex();
    const isDeleting = this.isDeleting();

    if (!isDeleting && currentChar <= currentWord.length) {
      this.displayText.set(currentWord.substring(0, currentChar));
      this.charIndex.set(currentChar + 1);
    } else if (isDeleting && currentChar >= 0) {
      this.displayText.set(currentWord.substring(0, currentChar));
      this.charIndex.set(currentChar - 1);
    }
    if (!isDeleting && currentChar === currentWord.length + 1) {
      this.isDeleting.set(true);
      setTimeout(() => this.animate(), this.delay * 4);
      return;
    }
    if (isDeleting && currentChar === 0) {
      this.isDeleting.set(false);
      this.wordIndex.set((this.wordIndex() + 1) % this.words.length);
    }
    setTimeout(() => this.animate(), this.delay);
  }
}