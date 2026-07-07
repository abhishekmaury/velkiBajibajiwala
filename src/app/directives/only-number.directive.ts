import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {

  private nonNumberRegex = /[^0-9]/g;

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
    if (event.data && this.nonNumberRegex.test(event.data)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (this.nonNumberRegex.test(pasted)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(this.nonNumberRegex, '');

    if (input.value !== cleaned) {
      input.value = cleaned;
      input.dispatchEvent(new Event('input'));
    }
  }
}
