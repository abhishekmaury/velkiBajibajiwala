import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from 'src/app/services/handler.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() countData: any;
  @Input() avtiveData: any;
  isLogin = false;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing = 'true';
  activetab = '';

  activeTabs = 0;
  indicatorOffset = 0;
  indicatorWidth = 0;
  constructor(private popupService: HandlerService, private router: Router, private el: ElementRef) { }

  ngOnInit(): void {
    this.updateIndicator(this.avtiveData)
    let token = localStorage.getItem('token')
    if (token) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(d1?.theme)
      this.jsonWeblinksdt = JSON.parse(d1?.links)
      this.validShowing = this.jsonWeblinksdt.validShowing;
    }
  }
  activeTab(data: any) {
    const isEditRoute = this.router.url?.split('/')[1];
    //   this.activeTabs = data;
    // this.updateIndicator(data);
    if (data == isEditRoute) {
      return {
        'background-image': this.jsonWebdt?.imagesBottomBorderColor,
        'color': this.jsonWebdt?.imagesPlayNowTextColor
      };
    } else {
      return {
        'background-color': 'transparent'
      }
    }
  }

  openPopup() {
    if (this.isLogin) {
      this.popupService.openPopup();
    } else {
      this.router.navigate(['/login'])
    }
  }

  ngAfterViewInit() {
    // this.updateIndicator(0);
  }
  // setActiveTabByRoute(url: string) {
  //   if (url.startsWith('/casino')) {
  //     this.activeTabs = 1;
  //   } else if (url.startsWith('/sports')) {
  //     this.activeTabs = 2;
  //   } else if (url.startsWith('/league')) {
  //     this.activeTabs = 3;
  //   }

  //   // Update indicator position safely
  //   setTimeout(() => {
  //     this.updateIndicator(this.activeTabs);
  //   }, 100);
  // }

  setActiveTab(index: number) {
    this.activeTabs = index;
    this.updateIndicator(index);
    const tabs = this.el.nativeElement.querySelectorAll('.main-con');
    tabs.forEach((tab: HTMLElement) => tab.classList.remove('active'));

    const activeTab = tabs[index] as HTMLElement;
    if (activeTab) activeTab.classList.add('active');
    if (index === 1) {
      this.router.navigate(['/casino', 'POPULAR', 'ALL']);
    } else if (index === 2) {
      this.router.navigate(['/sports', 'Inplay', '5']);
    } else if (index === 3) {
      this.router.navigate(['/league']);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateIndicator(this.activeTabs);
  }

  updateIndicator(index: number) {
    const tabs = this.el.nativeElement.querySelectorAll('.main-con');
    tabs.forEach((tab: HTMLElement) => tab.classList.remove('active'));
    if (!tabs.length) return;

    const activeTab = tabs[index] as HTMLElement;
    if (activeTab) activeTab.classList.add('active');
    const parentRect = activeTab.parentElement!.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    this.indicatorOffset = tabRect.left - parentRect.left;
    this.indicatorWidth = tabRect.width;
  }
}
