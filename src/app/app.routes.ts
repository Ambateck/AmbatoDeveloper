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
    { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), data: { animation: 'HomePage' } },
    { path: 'call', component: CallComponent, data: { animation: 'CallPage' } },
    { path: 'code-fest', component: CodeFestComponent, data: { animation: 'CodeFestPage' } },
    { path: 'dashboard', component: DashboardComponent, data: { animation: 'DashboardPage' } },
    { path: 'donations', component: DonationsComponent, data: { animation: 'DonationsPage' } },
    { path: 'free-design', component: FreeDesignComponent, data: { animation: 'FreeDesignPage' } },
    { path: 'job-market', component: JobMarketComponent, data: { animation: 'JobMarketPage' } },
    { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
    { path: 'products', component: ProductsComponent, data: { animation: 'ProductsPage' } },
    { path: 'services', component: ServicesComponent, data: { animation: 'ServicesPage' } },
    { path: 'share-idea', component: ShareIdeaComponent, data: { animation: 'ShareIdeaPage' } },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
