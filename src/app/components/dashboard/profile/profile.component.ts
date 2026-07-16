
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  openProfile=false
  userData : any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  isClassicTheme = false;

  constructor(private location: Location,private router: Router,private dataServe: DataHandlerService) { }
  ngOnInit(): void {

    this.dataServe.changeTheme$.subscribe({
next:(isClassicTheme) => this.isClassicTheme = isClassicTheme,
    })

let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing=this.jsonWeblinksdt?.validShowing;
    }
    let data = localStorage.getItem('userData');
    if (data) {
      this.userData = JSON.parse(data)
    }
  }

  
  goBack(): void {
    if(this.isClassicTheme){
      this.router.navigate(['/account'])
    }else{
      this.location.back();
    }
  }


}
