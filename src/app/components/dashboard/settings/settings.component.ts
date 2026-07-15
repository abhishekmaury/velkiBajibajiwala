import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone:true,
  imports:[],
})
export class SettingsComponent {
  isClassicTheme = false;

  constructor(
    private location: Location,
    private dataService:DataHandlerService,
  ) { }
  goBack(): void {
    this.location.back();
  }

  ngOnInit() {
    this.dataService.changeTheme$.subscribe({
next:(isClassicTheme) => this.isClassicTheme = isClassicTheme,
    })
  }
}
