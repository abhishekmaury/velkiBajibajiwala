import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Output() closeEmiter = new EventEmitter()

  constructor(private router: Router, private location: Location) {

  }
  closeSearch() {
    this.closeEmiter.emit(false)
    this.location.back()

  }

  // 🔹 Typing emoji remove
onInput(event: Event) {
  const input = event.target as HTMLInputElement;

  // split by characters
  const chars = Array.from(input.value);

  // keep only single-length chars (non-emoji)
  input.value = chars.filter(c => c.length === 1).join('');
}

// 🔹 Paste emoji block
onPaste(event: ClipboardEvent) {
  const text = event.clipboardData?.getData('text') || '';

  // if any emoji-like char found, stop paste
  const hasEmoji = Array.from(text).some(c => c.length > 1);

  if (hasEmoji) {
    event.preventDefault();
  }
}

}
