import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpace]'
})
export class NoSpaceDirective {

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
    if (event.data === ' ') {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (pasted.includes(' ')) {
      event.preventDefault();
    }
  }

}
