import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.css']
})
export class MainFooterComponent implements OnInit{
  webdata : any;
  jsonWeblinksdt : any;
  themeData : any;
  domainName = window.location.hostname;
  showAmbassador = false;
  showSponsor = false;
  isClassicTheme = false;
  img : any
  constructor(private router: Router, private dataserve : DataHandlerService) {

  }

  ngOnInit(): void {
     this.dataserve.sendWebData.subscribe((res: any) => {
      // this.banners = res?.banner
      this.domainName = this.dataserve.getdomain()
      this.themeData = res?.theme;
    })
    let webdata = localStorage.getItem("webData1");
    if (webdata) {
      let formatedDt = JSON.parse(webdata)
      // this.banners = formatedDt?.banner;
      this.domainName = this.dataserve.getdomain()
      // console.log(this.banners);

      this.themeData = formatedDt?.theme;
    }
    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.img = this.webdata?.imageData?.headers?.[0]?.logo?.replace(' ', '%20')
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
    }
    this.dataserve.changeTheme$.subscribe({
      next:(isClassic) => {
        this.isClassicTheme = isClassic;
      }
    })
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
