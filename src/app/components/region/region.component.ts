import { Component } from '@angular/core';
import { HandlerService } from 'src/app/services/handler.service';

import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css'],
   animations: [
        trigger('slideInOut', [
          transition(':enter', [
            style({ transform: 'translateY(100%)', opacity: 0 }),
            animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
          ]),
          transition(':leave', [
            animate('500ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
          ])
        ])
      ]
})
export class RegionComponent {
isOpen = false;
  constructor(private popupService:HandlerService){

}
  ngOnInit(): void {
    this.popupService.openRegionState$.subscribe(state => {
      this.isOpen = state;
    });
  }
  closePopup() {
    this.popupService.closereg();
  }
}
