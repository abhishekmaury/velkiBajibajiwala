import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sponser-1',
    loadComponent: () =>
      import('./sponser1/sponser1.component').then((m) => m.Sponser1Component),
  },
  {
    path: 'sponser-2',
    loadComponent: () =>
      import('./sponser2/sponser2.component').then((m) => m.Sponser2Component),
  },
  {
    path: 'sponser-3',
    loadComponent: () =>
      import('./sponser3/sponser3.component').then((m) => m.Sponser3Component),
  },
  {
    path: 'sponser-4',
    loadComponent: () =>
      import('./sponser4/sponser4.component').then((m) => m.Sponser4Component),
  },
  {
    path: 'sponser-5',
    loadComponent: () =>
      import('./sponser5/sponser5.component').then((m) => m.Sponser5Component),
  },
];
