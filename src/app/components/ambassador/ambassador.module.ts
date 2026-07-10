import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AmbassadorComponent } from './ambassador.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoRootModule } from '../../transloco-root.module';


const routes: Routes = [
  {
    path: '', component: AmbassadorComponent, children: [
      {
        path: 'ambassador-1',
        loadComponent: () => import('./ambassador1/ambassador1.component').then(m => m.Ambassador1Component),
      },
      {
        path: 'ambassador-2',
        loadComponent: () => import('./ambassador2/ambassador2.component').then(m => m.Ambassador2Component),
      },
      {
        path: 'ambassador-3',
        loadComponent: () => import('./ambassador3/ambassador3.component').then(m => m.Ambassador3Component),
      },
      {
        path: 'ambassador-4',
        loadComponent: () => import('./ambassador4/ambassador4.component').then(m => m.Ambassador4Component),
      },
      {
        path: 'ambassador-5',
        loadComponent: () => import('./ambassador5/ambassador5.component').then(m => m.Ambassador5Component),
      },
    ]
  }
]

@NgModule({
  declarations: [
    AmbassadorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    TranslocoRootModule,
    RouterModule.forChild(routes)
  ]
})
export class AmbassadorModule { }
