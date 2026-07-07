import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(
    private location: Location
  ) { }
  goBack(): void {
    this.location.back();
  }
}
