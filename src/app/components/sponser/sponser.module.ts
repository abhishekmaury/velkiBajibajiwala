
import { SponserComponent } from './sponser.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/directives/shared.module';
import { Sponser1Component } from './sponser1/sponser1.component';
import { Sponser2Component } from './sponser2/sponser2.component';
import { Sponser3Component } from './sponser3/sponser3.component';
import { Sponser4Component } from './sponser4/sponser4.component';
import { Sponser5Component } from './sponser5/sponser5.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

const routes: Routes = [
  {
    path: '', component: SponserComponent, children: [
            { path: 'sponser-1', loadChildren: () => import('./sponser1/sponser1.component').then(m => m.Sponser1Component) },
            { path: 'sponser-2', loadChildren: () => import('./sponser2/sponser2.component').then(m => m.Sponser2Component) },
            { path: 'sponser-3', loadChildren: () => import('./sponser3/sponser3.component').then(m => m.Sponser3Component) },
            { path: 'sponser-4', loadChildren: () => import('./sponser4/sponser4.component').then(m => m.Sponser4Component) },
            { path: 'sponser-5', loadChildren: () => import('./sponser5/sponser5.component').then(m => m.Sponser5Component) },
        ]
  }]

@NgModule({
  declarations: [
    SponserComponent,
    Sponser1Component,
    Sponser2Component,
    Sponser3Component,
    Sponser4Component,
    Sponser5Component
  ],
  imports: [
    CommonModule,
    SharedModule,
    CarouselModule,
    RouterModule.forChild(routes),

],

})
export class SponserModule { }
