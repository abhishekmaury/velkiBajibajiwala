import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { DateRangePickerComponent } from '../../date-range-picker/date-range-picker.component';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.css'],
  standalone:true,
  imports:[DatePipe,CommonModule,DateRangePickerComponent,LoaderComponent,RouterLink,ReactiveFormsModule],
})
export class BetHistoryComponent {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;

  during = false
  calender = false
  dropdownshow = false;
  betAllHistory: any;
  betHistoryData: any;
  currentDate = new Date().toISOString().slice(0, 10) || null;
  currentTime = new Date().getHours() + ":" + new Date().getMinutes();
  startDate: any;
  yesterday: any;
  currentPage = 1;
  pages: number[] = [1, 2, 3, 4, 5];
  totalPages: any;
  expand: any;
  expandcheck = false;
  loading: boolean = true;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  activeTab: number = 0;
  indicatorWidth: number = 0;
  indicatorLeft: number = 0;

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  showCalendar = false;
  resultType = 'Settled'
  isRefreshing = false;
  isClassicTheme = false;

  constructor(private location: Location, private dataServe: DataHandlerService, private activeRoute: ActivatedRoute, private datePipe: DatePipe) { }

  ngOnInit(): void {
     this.dataServe.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 1);
    twoDaysAgo.setHours(0, 0, 0, 0);

    this.selectedStartDate = twoDaysAgo;
    this.selectedEndDate = today;


    // also assign formatted values if needed
    let stdt = new Date(this.selectedStartDate);
    let stddate = this.datePipe.transform(stdt, 'yyyy-MM-dd');

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing = this.jsonWeblinksdt?.validShowing;
    }
    this.updateIndicatorPosition();

    // let d = new Date();
    // d.setDate(d.getDate() - 0);
    // d.toISOString().split('T')[0];
    // this.startDate = d.toISOString().slice(0, 10);

    this.activeRoute.paramMap.subscribe((name: ParamMap) => {

      this.betHistoryData = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(stddate),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        sourceType: new FormControl(name.get('name')),
        resultType: new FormControl('Settled'),
      })

      this.dataServe.getBetHistory(this.betHistoryData.value).subscribe((res: any) => {
        this.betAllHistory = res;
        this.loading = false;
      })
    })
  }

  goBack(): void {
    this.location.back();
  }

  onDuring() {
    this.during = !this.during
  }

  onDrop() {
    this.dropdownshow = !this.dropdownshow
  }

  getHistory1() {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.loading = true;
    this.showCalendar = false;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      this.betHistoryData = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(this.startDate),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        sourceType: new FormControl(name.get('name')),
        resultType: new FormControl(this.resultType),
      })
    })

    this.dataServe.getBetHistory(this.betHistoryData.value).subscribe((res: any) => {
      this.betAllHistory = res;
      this.loading = false;
      setTimeout(() => {
        this.isRefreshing = false;
      }, 500);
      },
      () => {
        this.loading = false;
        setTimeout(() => {
          this.isRefreshing = false;
        }, 500);
      }
    );
  }

  getHistory() {
    this.loading = true;
    this.dataServe.getBetHistory(this.betHistoryData.value).subscribe((res: any) => {
      this.betAllHistory = res;
      this.loading = false;
    })
  }

  justForToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.selectedStartDate = today;
    this.selectedEndDate = today;
    this.loading = true;
    this.during = false;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      this.betHistoryData = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(new Date().toISOString().slice(0, 10)),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(new Date().toISOString().slice(0, 10)),
        endTime: new FormControl(new Date().getHours() + ":" + new Date().getMinutes()),
        pageNo: new FormControl(this.currentPage),
        sourceType: new FormControl(name.get('name')),
        resultType: new FormControl('Settled'),
      })
    })

    this.dataServe.getBetHistory(this.betHistoryData.value).subscribe((res: any) => {
      this.betAllHistory = res;
      this.loading = false;
    })
  }

  fromYesterday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 1);
    twoDaysAgo.setHours(0, 0, 0, 0);

    this.selectedStartDate = twoDaysAgo;
    this.selectedEndDate = today;
    this.loading = true;
    this.during = false;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      let yesterDay = new Date();
      yesterDay.setDate(yesterDay.getDate() - 1);
      yesterDay.toISOString().split('T')[0];
      this.yesterday = yesterDay.toISOString().slice(0, 10);
      this.betHistoryData = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(this.yesterday), // get date before one day
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        sourceType: new FormControl(name.get('name')),
        resultType: new FormControl('Settled'),
      })
    })
    this.dataServe.getBetHistory(this.betHistoryData.value).subscribe((res: any) => {
      this.betAllHistory = res;
      this.loading = false;
    })
  }

  fromLast7day() {
     const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 7);
    twoDaysAgo.setHours(0, 0, 0, 0);

    this.selectedStartDate = twoDaysAgo;
    this.selectedEndDate = today;
    this.during = false;
    this.loading = true;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      let sevenDay = new Date();
      sevenDay.setDate(sevenDay.getDate() - 7);
      sevenDay.toISOString().split('T')[0];
      let nsevenDay = sevenDay.toISOString().slice(0, 10);
      this.betHistoryData = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(nsevenDay), // get date before one day
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        sourceType: new FormControl(name.get('name')),
        resultType: new FormControl('Settled'),
      })
    })
    this.dataServe.getBetHistory(this.betHistoryData.value).subscribe((res: any) => {
      this.betAllHistory = res;
      this.loading = false;
    })
  }

  onPageClick(page: number): void {
    this.currentPage = page;
    let d = new Date();
    d.setDate(d.getDate() - 1);
    d.toISOString().split('T')[0];
    this.startDate = d.toISOString().slice(0, 10)
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      this.betHistoryData = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(this.startDate),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        betstatus: new FormControl(name.get('name')),
        sportid: new FormControl('1,2,4'),
      })
      this.getHistory()
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

  details(i: any) {
    if (this.expandcheck == false) {
      this.expand = i;
      this.expandcheck = true;
    } else {
      this.expand = undefined;
      this.expandcheck = false;
    }
  }

  onSelect(option: string) {
    this.resultType = option
    this.betHistoryData.controls['resultType']?.setValue(option);
    this.dropdownshow = false
  }

  switchTab(index: number): void {
    this.activeTab = index;
    this.updateIndicatorPosition();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 1);
    twoDaysAgo.setHours(0, 0, 0, 0);

    this.selectedStartDate = twoDaysAgo;
    this.selectedEndDate = today;
     setTimeout(() => {
    this.scrollActiveTabToCenter();
  });
  }
  scrollActiveTabToCenter() {
  const activeTab: HTMLElement | null =
    this.tabsContainer.nativeElement.querySelector('.active');

  if (activeTab) {
    activeTab.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }
}

  private updateIndicatorPosition(): void {
    const activeTabElement = document.querySelectorAll('.tab')[this.activeTab] as HTMLElement;
    this.indicatorWidth = activeTabElement.offsetWidth;
    this.indicatorLeft = activeTabElement.offsetLeft;
  }


  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  // Called when custom date-range-picker emits the selected range
  onRangeSelected(range: { start: Date, end: Date }) {
    this.selectedStartDate = range.start;
    this.selectedEndDate = range.end;
    let stdt = new Date(this.selectedStartDate);
    let eddt = new Date(this.selectedEndDate);

    let stddate = this.datePipe.transform(stdt, 'yyyy-MM-dd');
    let eddate = this.datePipe.transform(eddt, 'yyyy-MM-dd');
    this.startDate = stddate;
    this.currentDate = eddate;
    // this.showCalendar = false;
  }
 @HostListener('document:click', ['$event'])
onClick(event: MouseEvent) {
  const target = event.target as HTMLElement;

  // If clicked outside both asidebar & button → close
  if (!target.closest('.asidebar') && !target.closest('.calendar-btn')) {
    this.showCalendar = false;
  }
}
}
