import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent implements OnInit{
  webdata : any;
  jsonWeblinksdt : any;
  constructor(private router: Router) {

  }

  ngOnInit(): void {
    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
    }
  }
  navigateToPrivacyPolicy() {
    this.router.navigate(['/info/privacy-policy']);
  }
  navigateToTermCondtion() {
    this.router.navigate(['/info/term-condition']);
  }
  navigateToRuleRegulation() {
    this.router.navigate(['/info/rule-regulation']);
  }
  navigateToKyc() {
    this.router.navigate(['/info/KYC']);
  }
  navigateToResponsibleGaming() {
    this.router.navigate(['/info/responsible-gaming']);
  }

}
