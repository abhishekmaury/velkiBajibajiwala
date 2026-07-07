
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FooterComponent {
  privacyp = false;
  kyc = false;
  tandc = false;
  resGming = false;
  randr = false;
  openfooterPopup(data : any){
    if(data == 'pp'){
      this.privacyp = true;
    }else if(data == 'kyc'){
      this.kyc = true;
    }else if(data == 'tc'){
      this.tandc = true;
    }else if(data == 'rr'){
      this.randr = true;
    }else{
      this.resGming = true;
    }
  }
  closefooterPopups(){
    this.privacyp = false;
    this.kyc = false;
    this.tandc = false;
    this.resGming = false;
    this.randr = false;
  }
}
