import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoEmojiDirective } from './no-emoji.directive';
import { NoSpaceDirective } from './no-space.directive';
import { OnlyNumberDirective } from './only-number.directive';
import { NoSpecialcharDirective } from './no-special-char.directive';


@NgModule({
  declarations: [
    NoSpaceDirective,
    NoSpecialcharDirective, 
    NoEmojiDirective,
    OnlyNumberDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NoSpaceDirective,
    NoSpecialcharDirective, 
    NoEmojiDirective,
    OnlyNumberDirective
  ]
})
export class SharedModule { }
