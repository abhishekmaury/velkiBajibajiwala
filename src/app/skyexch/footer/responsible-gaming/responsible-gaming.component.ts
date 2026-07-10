import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-responsible-gaming',
  standalone:true,
  imports: [],
  templateUrl: './responsible-gaming.component.html',
  styleUrls: ['./responsible-gaming.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResponsibleGamingComponent implements OnInit{

    domain: any;
      webdata: any;
      favicon: any;
      jsonWeblinksdt: any;
      loading = true;
      
    constructor(private location: Location , private dataServe: DataHandlerService, private router: Router ,private titleService: Title){}
  
  @Output() closePopup = new EventEmitter()

  closePP(){
    this.closePopup.emit(false)
    this.location.back()
  }


  ngOnInit(): void {
 
    let data1 = localStorage.getItem('webData');
    if (data1 == null) {
      this.dataServe.getWebsiteData().subscribe((res) => {
        localStorage.setItem("webData", JSON.stringify(res))
        let d1 = res;
        this.webdata = d1;
        this.favicon = this.webdata?.imageData?.headers?.[0]?.favicon;
        this.jsonWeblinksdt = JSON.parse(this.webdata.links)

        let dt = this.webdata?.imageData?.domain;
        this.domain = this.getdomain(dt)
        console.log(this.domain)
        const titleFromAPI = this.domain;
        if (titleFromAPI) {
          this.setTitle(titleFromAPI);
        }

        this.dataServe.updateFavicon(this.favicon);
        this.loading = false;
      })
    } else {
      let d1 = JSON.parse(data1);
      this.webdata = d1;
      this.favicon = this.webdata?.imageData?.headers?.[0]?.favicon;
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)

      let dt = this.webdata?.imageData?.domain;
      this.domain = this.getdomain(dt)

      const titleFromAPI = this.domain;
      console.log(titleFromAPI)
      if (titleFromAPI) {
        this.setTitle(titleFromAPI.toUpperCase());
      }

      this.dataServe.updateFavicon(this.favicon);
      this.loading = false;
    }
  }
    setTitle(newTitle: string): void {
    this.titleService.setTitle(newTitle);
  }
   getdomain(data: string) {
    const url = new URL(data);
    const hostnameParts = url.hostname.split('.');
    const domain = hostnameParts[0];
    return domain;
  }
  
}
