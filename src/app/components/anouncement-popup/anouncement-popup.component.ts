import { Component } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-anouncement-popup',
  templateUrl: './anouncement-popup.component.html',
  styleUrls: ['./anouncement-popup.component.css']
})
export class AnouncementPopupComponent {
  dontshowagn = false;
  step = false;
  constructor(private dataServe: DataHandlerService) { }
  logout() {
    this.dataServe.logout();
    setTimeout(() => {
      window.location.reload()
    }, 100);
  }

  acceptandproceed(){
    this.step = true
  }
  doNotShowagn(){
    localStorage.setItem('DoNotShowAnnouncement', 'yes')
    this.dontshowagn =!this.dontshowagn
  }
}
