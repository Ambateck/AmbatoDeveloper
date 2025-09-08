import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '@angular/fire/auth';

class MockAuthService {
  currentUser$ = new BehaviorSubject<User | null>(null);
  signInAnonymously() { return Promise.resolve(null); }
  signInWithGoogle() { return Promise.resolve(null); }
  signInWithFacebook() { return Promise.resolve(null); }
  signOut() { return Promise.resolve(); }
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'AmbatoDeveloper' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('AmbatoDeveloper');
  });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, AmbatoDeveloper');
  // });
});
