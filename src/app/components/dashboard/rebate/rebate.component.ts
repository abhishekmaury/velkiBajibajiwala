import { DatePipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-rebate',
  templateUrl: './rebate.component.html',
  styleUrls: ['./rebate.component.css']
})
export class RebateComponent {
  during = false
  calender = false
  dropdownshow = false;
  betAllProfitLoss: any
  betProfitLoss: any;
  loginResData: any;
  currentPage = 1;
  pages: number[] = [1, 2, 3, 4, 5];
  totalPages: any;
  sourcedata: any;
  activeTab: number = 1;
  activedata: any;
  loading: boolean = true;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  indicatorWidth: number = 0;
  indicatorLeft: number = 0;
  isClassicTheme = false;
  
  constructor(private dataServe: DataHandlerService, private activeRoute: ActivatedRoute, private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
     this.dataServe.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing = this.jsonWeblinksdt?.validShowing;
    }
    let data = localStorage.getItem('userData')
    if (data) {
      this.loginResData = JSON.parse(data)
    }
   
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      let name1 = name.get('name');
      if(name1=='Daily'){
        this.activeTab=1;
      }else if(name1=='Weekly'){
        this.activeTab=2;
      }else if(name1=='Monthly'){
        this.activeTab=3;
      }
      let pdt = { "pageNo" : this.currentPage, "commType": this.activeTab }
      this.dataServe.getUserRebateData(pdt).subscribe((res: any) => {
        this.loading = false;
        this.betAllProfitLoss = res;
      })
    });
    this.updateIndicatorPosition();
  }
  
  goBack(): void {
    if(this.isClassicTheme){
      this.router.navigate(['/account'])
    }else{
      this.location.back();
    }
  }

  onPageClick(page: number): void {
    this.loading = true;
    this.currentPage = page;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      let name1 = name.get('name');
      if(name1=='Daily'){
        this.activeTab=1;
      }else if(name1=='Weekly'){
        this.activeTab=2;
      }else if(name1=='Monthly'){
        this.activeTab=3;
      }
      let pdt = { "pageNo" : this.currentPage, "commType": this.activeTab }
      this.dataServe.getUserRebateData(pdt).subscribe((res: any) => {
        this.loading = false;
        this.betAllProfitLoss = res;
        this.totalPages = res.totalPages
      })
    })
    if (this.pages.length == 5) {

    } else {
      this.pages.shift()
    }

  }

  addNextPage(): void {
    const nextPage = this.pages[this.pages.length - 1] + 1;;
    this.pages.push(nextPage);
    this.onPageClick(nextPage);
  }

  removeLastPage(): void {
    if (this.pages.length > 2) {
      const currentIndex = this.pages.indexOf(this.currentPage);
      if (currentIndex > 0) {
        this.onPageClick(this.pages[currentIndex - 1]);
      } else {
        this.pages.pop();
        this.pages.unshift(this.pages[0] - 1)
      }
    }
  }

  switchTab(index: number): void {
    this.activeTab = index;
    this.updateIndicatorPosition();
  }

  private updateIndicatorPosition(): void {
    const tabs = document.querySelectorAll('.tab');
    if (!tabs || tabs.length === 0) return;
    const activeTabElement = tabs[this.activeTab - 1] as HTMLElement;
    if (!activeTabElement) return;
    this.indicatorWidth = activeTabElement.offsetWidth;
    this.indicatorLeft = activeTabElement.offsetLeft;
  }
}
