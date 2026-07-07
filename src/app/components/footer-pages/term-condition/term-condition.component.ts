import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-term-condition',
  templateUrl: './term-condition.component.html',
  styleUrls: ['./term-condition.component.css']
})
export class TermConditionComponent {
  constructor(private location: Location, private router: Router) {

  }
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/home'])

  }
}
