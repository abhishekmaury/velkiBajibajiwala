import { NgModule } from "@angular/core";
import { SettingComponent } from "./setting.component";
import { CommonModule } from "@angular/common";
import { Routes } from "@angular/router";

const routes : Routes = [
    {path : '', component : SettingComponent}
]

@NgModule({
    declarations : [
        SettingComponent
    ],
    imports : [
        CommonModule,

    ],
    exports : [
        SettingComponent
    ]
})
export class SettingModule{}