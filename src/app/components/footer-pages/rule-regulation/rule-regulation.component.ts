import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rule-regulation',
  templateUrl: './rule-regulation.component.html',
  styleUrls: ['./rule-regulation.component.css']
})
export class RuleRegulationComponent {
  constructor(private location: Location,private router:Router) {

  }
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/home'])

  }

}
