import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  // ✅ Page d'accueil par défaut
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  // Pages publiques
  { path: 'accueil',  loadComponent: () => import('./pages/landing/landing').then(m => m.LandingComponent) },
  { path: 'login',    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },

  // Pages protégées — propriétaire
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard',  loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'proprietes', loadComponent: () => import('./pages/proprietes/proprietes').then(m => m.ProprietesComponent) },
      { path: 'locataires', loadComponent: () => import('./pages/locataires/locataires').then(m => m.LocatairesComponent) },
      { path: 'baux',       loadComponent: () => import('./pages/baux/baux').then(m => m.BauxComponent) },
      { path: 'paiements',  loadComponent: () => import('./pages/paiements/paiements').then(m => m.PaiementsComponent) },
      { path: 'alertes',    loadComponent: () => import('./pages/alertes/alertes').then(m => m.AlertesComponent) },
    ]
  },

  // Page admin — guard séparé
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent)
  },

  { path: '**', redirectTo: 'accueil' }
];
