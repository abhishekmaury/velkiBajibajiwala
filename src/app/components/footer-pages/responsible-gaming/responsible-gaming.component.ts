import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-responsible-gaming',
  templateUrl: './responsible-gaming.component.html',
  styleUrls: ['./responsible-gaming.component.css']
})
export class ResponsibleGamingComponent {
  constructor(private location: Location, private router: Router) {

  }
  goBack(): void {
    this.location.back();
    // this.router.navigate(['/home'])
  }

}
