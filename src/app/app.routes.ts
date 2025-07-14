import { Routes } from '@angular/router';
import { CodeFestComponent } from './code-fest/code-fest.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DonationsComponent } from './donations/donations.component';
import { FreeDesignComponent } from './free-design/free-design.component';
import { JobMarketComponent } from './job-market/job-market.component';
import { ShareIdeaComponent } from './share-idea/share-idea.component';
import { CallComponent } from './header/call/call.component';
import { LoginComponent } from './header/login/login.component';
import { ProductsComponent } from './header/products/products.component';
import { ServicesComponent } from './header/services/services.component';

export const routes: Routes = [
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
    { path: 'call', component: CallComponent },
    { path: 'code-fest', component: CodeFestComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'donations', component: DonationsComponent },
    { path: 'free-design', component: FreeDesignComponent },
    { path: 'job-market', component: JobMarketComponent },
    { path: 'login', component: LoginComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'share-idea', component: ShareIdeaComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
