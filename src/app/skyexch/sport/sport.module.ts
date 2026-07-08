import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/directives/shared.module';
import { SportComponent } from 'src/app/skyexch/sport/sport.component';

const routes: Routes = [
  {
    path: '', component: SportComponent,
  }]

@NgModule({
  declarations: [
    SportComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),

],

})
export class SportModule { }
