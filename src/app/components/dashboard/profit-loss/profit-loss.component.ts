import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent {
  @ViewChild('tabsContainer') tabsContainer!: ElementRef;

  during = false
  calender = false
  isRefreshing = false;
  goBack(): void {
    this.location.back();
  }
  onDuring() {
    this.during = !this.during
  }
  dropdownshow = false;
  betAllProfitLoss: any
  betProfitLoss: any;
  currentDate = new Date().toISOString().slice(0, 10) || null;
  currentTime = new Date().getHours() + ":" + new Date().getMinutes();
  startDate: any;
  yesterday: any;
  loginResData: any;
  currentPage = 1;
  pages: number[] = [1, 2, 3, 4, 5];
  totalPages: any;
  expand: any;
  expandcheck = false;
  sourcedata: any;
  activetab: any;
  activedata: any;
  loading: boolean = true;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  showCalendar = false;
  isClassicTheme = false;
  constructor(private dataServe: DataHandlerService, private activeRoute: ActivatedRoute, private location: Location,
    private datePipe: DatePipe
  ) { }

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
    let data = localStorage.getItem('userData')
    if (data) {
      this.loginResData = JSON.parse(data)
    }
    let d = new Date();
    d.setDate(d.getDate() - 0);
    d.toISOString().split('T')[0];
    this.startDate = d.toISOString().slice(0, 10)
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      this.betProfitLoss = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(stddate),
        startTime: new FormControl(this.currentTime),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        betstatus: new FormControl(name.get('name')),
        sportid: new FormControl('1,2,4'),
      })
      this.dataServe.getUserOwnProfitLoss(this.betProfitLoss.value).subscribe((res: any) => {
        this.expand = null;
        this.loading = false;
        this.betAllProfitLoss = res;
      })
      this.activetab = name.get('name');
    });
    this.updateIndicatorPosition();
  }


  getProfitLoss() {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.loading = true;
    this.activetab = this.betProfitLoss.value.betstatus;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      this.betProfitLoss = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(this.startDate),
        startTime: new FormControl(this.currentTime),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        betstatus: new FormControl(name.get('name')),
        sportid: new FormControl('1,2,4'),
      })
    })

    this.dataServe.getUserOwnProfitLoss(this.betProfitLoss.value).subscribe((res: any) => {
      this.expand = null;
      this.loading = false;
      this.betAllProfitLoss = res;
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
  justForToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate());
    twoDaysAgo.setHours(0, 0, 0, 0);

    this.selectedStartDate = twoDaysAgo;
    this.selectedEndDate = today;
    this.loading = true;
    this.during = false;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      this.betProfitLoss = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(this.currentDate),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        betstatus: new FormControl(name.get('name')),
        sportid: new FormControl('1,2,4'),
      })
      this.activetab = name.get('name');
    })
    this.dataServe.getUserOwnProfitLoss(this.betProfitLoss.value).subscribe((res: any) => {
      this.expand = null;
      this.loading = false;
      this.betAllProfitLoss = res;
    })
  }
  formYesterday() {
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
      this.betProfitLoss = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(this.yesterday),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        betstatus: new FormControl(name.get('name')),
        sportid: new FormControl('1,2,4'),
      })
      this.activetab = name.get('name');
    })
    this.dataServe.getUserOwnProfitLoss(this.betProfitLoss.value).subscribe((res: any) => {
      this.expand = null;
      this.loading = false;
      this.betAllProfitLoss = res;

    })
  }

  form7days() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(today.getDate() - 7);
    twoDaysAgo.setHours(0, 0, 0, 0);

    this.selectedStartDate = twoDaysAgo;
    this.selectedEndDate = today;
    this.loading = true;
    this.during = false;
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      let sevendays = new Date();
      sevendays.setDate(sevendays.getDate() - 7);
      sevendays.toISOString().split('T')[0];
      let last7days = sevendays.toISOString().slice(0, 10);
      this.betProfitLoss = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(last7days),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        betstatus: new FormControl(name.get('name')),
        sportid: new FormControl('1,2,4'),
      })
      this.activetab = name.get('name');
    })
    this.dataServe.getUserOwnProfitLoss(this.betProfitLoss.value).subscribe((res: any) => {
      this.expand = null;
      this.loading = false;
      this.betAllProfitLoss = res;

    })
  }
  onPageClick(page: number): void {
    this.loading = true;
    this.currentPage = page;
    let d = new Date();
    d.setDate(d.getDate() - 1);
    d.toISOString().split('T')[0];
    this.startDate = d.toISOString().slice(0, 10)
    this.activeRoute.paramMap.subscribe((name: ParamMap) => {
      this.betProfitLoss = new FormGroup({
        filter: new FormControl('all'),
        startDate: new FormControl(this.startDate),
        startTime: new FormControl('00:00'),
        endDate: new FormControl(this.currentDate),
        endTime: new FormControl(this.currentTime),
        pageNo: new FormControl(this.currentPage),
        betstatus: new FormControl(name.get('name')),
        sportid: new FormControl('1,2,4'),
      })
      this.activetab = name.get('name');
      this.dataServe.getUserOwnProfitLoss(this.betProfitLoss.value).subscribe((res: any) => {
        this.expand = null;
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

  details(i: any, data: any) {
    if (this.expandcheck == false) {
      let ddt = { "sourceId": data.sourceId, "sourceType": this.betProfitLoss.value.betstatus }
      this.dataServe.getUserBetsBySourceId(ddt).subscribe((res: any) => {
        this.sourcedata = res;
        this.activedata = data;
      })


      this.expand = i;
      this.expandcheck = true;
    } else {
      this.expand = undefined;
      this.expandcheck = false;
    }
  }

  getTotalStake(): number {
    return this.sourcedata?.reduce((total: any, item: any) => total + item.stake, 0);
  }
  getTotalResultPnlForBack(): number {
    return this.sourcedata?.filter((item: any) => item.isBack === true)?.reduce((total: any, item: any) => total + item.resultPnl, 0);
  }
  getTotalResultPnlForLay(): number {
    return this.sourcedata?.filter((item: any) => item.isBack === false)?.reduce((total: any, item: any) => total + item.resultPnl, 0);
  }
  onSelect(option: string) {
    this.betProfitLoss.controls['resultType'].setValue(option);
    this.dropdownshow = false

  }
  onDrop() {
    this.dropdownshow = !this.dropdownshow
  }
  activeTab: number = 0;
  indicatorWidth: number = 0;
  indicatorLeft: number = 0;


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

  private updateIndicatorPosition(): void {
    const activeTabElement = document.querySelectorAll('.tab')[this.activeTab] as HTMLElement;
    this.indicatorWidth = activeTabElement.offsetWidth;
    this.indicatorLeft = activeTabElement.offsetLeft;
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
