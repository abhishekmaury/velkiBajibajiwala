import { HandlerService } from 'src/app/services/handler.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private location: Location,private popupService: HandlerService,private dataServe: DataHandlerService) { }
  ngOnInit(): void {
   
  
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
    this.location.back();
  }
}
