import { Component, inject } from "@angular/core";
import { DataHandlerService } from "src/app/services/datahandler.service";

@Component({
selector:'app-home',
template:`
  <app-home-classic *ngIf="isClassicTheme"></app-home-classic>
  <app-home-original *ngIf="!isClassicTheme"></app-home-original>
`,
})
export class HomeWrapperComponent {
  isClassicTheme = false;
  dataServe = inject(DataHandlerService);

  ngOnInit() {
    this.dataServe.changeTheme$.subscribe({
      next:(isClassic) => {
        this.isClassicTheme = isClassic;
      }
    })

  }
}
