import { Routes } from '@angular/router';

// Each page is lazy-loaded, so its code is only downloaded when the route is visited.
// "applications/new" must come before "applications/:id" or "new" would be read as an id.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'applications' },
  {
    path: 'applications',
    title: 'Applications | Job Tracker',
    loadComponent: () =>
      import('./components/application-list/application-list.component').then((m) => m.ApplicationListComponent),
  },
  {
    path: 'applications/new',
    title: 'Add application | Job Tracker',
    loadComponent: () =>
      import('./components/application-form/application-form.component').then((m) => m.ApplicationFormComponent),
  },
  {
    path: 'applications/:id',
    title: 'Application | Job Tracker',
    loadComponent: () =>
      import('./components/application-detail/application-detail.component').then(
        (m) => m.ApplicationDetailComponent,
      ),
  },
  {
    path: 'applications/:id/edit',
    title: 'Edit application | Job Tracker',
    loadComponent: () =>
      import('./components/application-form/application-form.component').then((m) => m.ApplicationFormComponent),
  },
  { path: '**', redirectTo: 'applications' },
];
