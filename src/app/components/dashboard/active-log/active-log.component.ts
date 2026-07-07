import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-active-log',
  templateUrl: './active-log.component.html',
  styleUrls: ['./active-log.component.css']
})
export class ActiveLogComponent {

  activityLog: any;
  passwrodLog: any;
  currentPage = 1;
  loading: boolean = true;
  pages: number[] = [1, 2, 3, 4, 5];
  totalPages: any;

  constructor(private location: Location, private dataServe: DataHandlerService, private meta: Meta) { }

  ngOnInit(): void {
    this.dataServe.isLoggedIn();
    this.dataServe.getActivityLog(1).subscribe((res: any) => {
      // this.activityLog = res?.data;
      this.activityLog = res?.data.filter((re: any) => {
        if (re?.activityType !== 'Password Change') {
          return re;
        };
      })
      this.passwrodLog = res?.data.filter((re: any) => {
        if (re?.activityType === 'Password Change') {
          return re;
        };
      })
      this.totalPages = res.totalPages
      this.loading = false;
    })
  }

  onPageClick(page: number): void {
    this.currentPage = page;
    this.dataServe.getActivityLog(this.currentPage).subscribe((res: any) => {
      this.activityLog = res?.data;
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

  goBack(): void {
    this.location.back();
  }

  selectTab = false;
  selectedOption = 'Active Log';

  toggleSelect() {
    this.selectTab = !this.selectTab;
  }

  selectOption(option: string) {
    this.loading = true
    this.selectedOption = option;
    this.selectTab = false;
   setTimeout(() => {
    this.loading = false
   }, 1000);
  }
}
