import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  isClassicTheme = false;

  constructor(
    private location: Location,
    private dataService:DataHandlerService,
    private router : Router
  ) { }
  
  goBack(): void {
    if(this.isClassicTheme){
      this.router.navigate(['/account'])
    }else{
      this.location.back();
    }
  }

  ngOnInit() {
    this.dataService.changeTheme$.subscribe({
next:(isClassicTheme) => this.isClassicTheme = isClassicTheme,
    })
  }
}
