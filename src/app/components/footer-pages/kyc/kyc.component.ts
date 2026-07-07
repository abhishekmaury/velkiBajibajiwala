import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.css']
})
export class KycComponent {
  constructor(private location: Location,private router:Router) {

  }
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/home'])

  }

}
