import { Injectable, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, signInAnonymously, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.run(() => {
        onAuthStateChanged(this.auth, user => {
          this.userSubject.next(user);
        });
      });
    }
  }

  signInAnonymously(): Promise<User | null> {
    if (isPlatformBrowser(this.platformId)) {
      return this.zone.run(() => signInAnonymously(this.auth).then(credential => credential.user));
    } else {
      return Promise.resolve(null);
    }
  }

  signInWithGoogle(): Promise<User | null> {
    if (isPlatformBrowser(this.platformId)) {
      return this.zone.run(() => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider).then(credential => credential.user);
      });
    } else {
      return Promise.resolve(null);
    }
  }

  signInWithFacebook(): Promise<User | null> {
    if (isPlatformBrowser(this.platformId)) {
      return this.zone.run(() => {
        const provider = new FacebookAuthProvider();
        return signInWithPopup(this.auth, provider).then(credential => credential.user);
      });
    } else {
      return Promise.resolve(null);
    }
  }

  signOut(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      return this.zone.run(() => signOut(this.auth));
    } else {
      return Promise.resolve();
    }
  }
}
