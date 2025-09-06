import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth'; // Import provideAuth and getAuth

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

const firebaseConfig = {
  apiKey: "AIzaSyBimKPQWjw68gQFpoPsG5elBlJFvxywEjA",
  authDomain: "code-fest-d56fa.firebaseapp.com",
  projectId: "code-fest-d56fa",
  storageBucket: "code-fest-d56fa.firebasestorage.app",
  messagingSenderId: "155894377493",
  appId: "1:155894377493:web:aa17dd0c8a030ea179721c",
  measurementId: "G-QD6C3Y9B0X"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()), // Add provideAuth here
  ],
};