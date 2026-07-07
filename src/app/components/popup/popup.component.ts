import { Component, Input } from '@angular/core';
import { HandlerService } from 'src/app/services/handler.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input() errMsg: string = '';
  @Input() showErrPopup: boolean = false;
  closePopup() {
    this.showErrPopup = false;
  }
}
