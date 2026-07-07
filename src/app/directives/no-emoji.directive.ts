import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoEmoji]'
})
export class NoEmojiDirective {

  private emojiRegex =
    /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
    if (event.data && this.emojiRegex.test(event.data)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pasted = event.clipboardData?.getData('text') || '';
    if (this.emojiRegex.test(pasted)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(this.emojiRegex, '');
    if (input.value !== cleaned) {
      input.value = cleaned;
      input.dispatchEvent(new Event('input'));
    }
  }

}
