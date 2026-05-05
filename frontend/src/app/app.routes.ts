import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';
import { authGuard } from './shared/guards/auth-guard';
import { loginpageGuard } from './shared/guards/loginpage-guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'projects', loadComponent: () => import('./features/projects/projects').then(m => m.ProjectsComponent) },
      { path: 'projects/:id', loadComponent: () => import('./features/project-details/project-details').then(m => m.ProjectDetailsComponent) },
      { path: 'loginToAyaDashBoard',canActivate:[loginpageGuard], loadComponent: () => import('./features/login/login').then(m => m.LoginComponent) },
      { path: 'forget-password',canActivate:[loginpageGuard], loadComponent: () => import('./features/login/login').then(m => m.LoginComponent) },
      { path: 'reset-password',canActivate:[loginpageGuard], loadComponent: () => import('./features/login/login').then(m => m.LoginComponent) },
      { path: '',pathMatch: 'full', loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },
    ]
  },
  {
    path: 'ayaDashboard',
    loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', loadComponent: () => import('./dashboard-sections/profile/profile').then(m => m.ProfileComponent) },
      { path: 'manage-projects', loadComponent: () => import('./dashboard-sections/manage-projects/manage-projects').then(m => m.ManageProjectsComponent) },
      { path: 'manage-education', loadComponent: () => import('./dashboard-sections/manage-education/manage-education').then(m => m.ManageEducationComponent) },
      { path: 'manage-experience', loadComponent: () => import('./dashboard-sections/manage-experience/manage-experience').then(m => m.ManageExperienceComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
