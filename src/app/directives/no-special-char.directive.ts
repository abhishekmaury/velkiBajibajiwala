import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpecialChar]'
})
export class NoSpecialcharDirective {
  private specialCharRegex = /[^a-zA-Z0-9]/g;

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
    if (event.data && this.specialCharRegex.test(event.data)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (this.specialCharRegex.test(pasted)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(this.specialCharRegex, '');

    if (input.value !== cleaned) {
      input.value = cleaned;
      input.dispatchEvent(new Event('input'));
    }
  }
}
