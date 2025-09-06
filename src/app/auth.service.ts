import { Injectable, NgZone } from '@angular/core';
import { Auth, signInAnonymously, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private zone: NgZone) {
    this.zone.run(() => {
      onAuthStateChanged(this.auth, user => {
        this.userSubject.next(user);
      });
    });
  }

  signInAnonymously(): Promise<User | null> {
    return this.zone.run(() => signInAnonymously(this.auth).then(credential => credential.user));
  }

  signInWithGoogle(): Promise<User | null> {
    return this.zone.run(() => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(this.auth, provider).then(credential => credential.user);
    });
  }

  signInWithFacebook(): Promise<User | null> {
    return this.zone.run(() => {
      const provider = new FacebookAuthProvider();
      return signInWithPopup(this.auth, provider).then(credential => credential.user);
    });
  }

  signOut(): Promise<void> {
    return this.zone.run(() => signOut(this.auth));
  }
}
