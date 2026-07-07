import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent {
  constructor(private location: Location,private router:Router) {

  }
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/home'])

  }

}
