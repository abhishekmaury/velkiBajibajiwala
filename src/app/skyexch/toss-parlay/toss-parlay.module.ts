import { NgModule } from "@angular/core";
import { TossParlayComponent } from "./toss-parlay.component";
import { ParlayBetPlaceComponent } from "../parlay-bet-place/parlay-bet-place.component";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/directives/shared.module";

const routes: Routes = [
  {
    path: '', component: TossParlayComponent,
  }]

@NgModule({
    declarations : [
        TossParlayComponent,
        ParlayBetPlaceComponent
    ],
    imports : [
        CommonModule,
        SharedModule,
        RouterModule.forChild(routes)
    ]

})

export class TossParlayModule{
    
}