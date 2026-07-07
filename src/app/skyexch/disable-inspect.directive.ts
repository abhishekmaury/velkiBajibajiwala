import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableInspect]'
})
export class DisableInspectDirective {

  constructor() { }
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent): void {
    event.preventDefault();
  }
}
