import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, signal, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private words = ['Websites', 'Apps', 'Premios', 'Concursos', 'Eventos'];
  private wordIndex = signal(0);
  private charIndex = signal(0);
  private isDeleting = signal(false);
  displayText = signal('');

  private delayTyping = 300;
  private delayDeleting = 275;
  private pauseAfterWord = 1200;
  private timeoutId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        this.timeoutId = setTimeout(() => this.typeWriter(), this.delayTyping);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private typeWriter(): void {
    const currentWord = this.words[this.wordIndex()];
    const currentCharIndex = this.charIndex();
    const deleting = this.isDeleting();

    let updatedText = '';

    if (deleting) {
      updatedText = currentWord.substring(0, currentCharIndex - 1);
      this.charIndex.set(currentCharIndex - 1);
    } else {
      updatedText = currentWord.substring(0, currentCharIndex + 1);
      this.charIndex.set(currentCharIndex + 1);
    }

    this.zone.run(() => {
      this.displayText.set(updatedText);
    });

    let timeout = deleting ? this.delayDeleting : this.delayTyping;

    if (!deleting && updatedText === currentWord) {
      timeout = this.pauseAfterWord;
      this.isDeleting.set(true);
    } else if (deleting && updatedText === '') {
      this.isDeleting.set(false);
      this.wordIndex.set((this.wordIndex() + 1) % this.words.length);
    }

    this.timeoutId = setTimeout(() => this.typeWriter(), timeout);
  }
}
