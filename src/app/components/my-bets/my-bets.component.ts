import { Component, HostListener, OnInit } from '@angular/core';
import { HandlerService } from 'src/app/services/handler.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-my-bets',
  templateUrl: './my-bets.component.html',
  styleUrls: ['./my-bets.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})

export class MyBetsComponent implements OnInit {
  activeTab = 0
  indicatorWidth: number = 95;
  indicatorLeft: number = 160;
  isOpen = false;
  betsComp = false;
  betList = true;
  betListInfo = false;
  allActiveLiab: any;
  selectedList: any;
  ActiveLiablist: any;
  betid = '';
  count: any;
  countEx: any
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing = 'true';
  parlay: any;
  exchange: any;
  parlayActive: any;
  openParlayBets: any;
  selectmatch = '1'
  selectmatch1 = '1'

  unmatchedData: any;
  exchange01: any;
  constructor(private popupService: HandlerService, private dataServe: DataHandlerService) { }

  ngOnInit(): void {

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(d1?.theme)
      this.jsonWeblinksdt = JSON.parse(d1?.links)
      this.validShowing = this.jsonWeblinksdt.validShowing;
    }
    this.popupService.popupState$.subscribe(state => {
      this.isOpen = state;
    });
    let token = localStorage.getItem('token')
    if (token) {
      this.dataServe.getActiveLiabUserWise().subscribe((res: any) => {
        this.allActiveLiab = res;
        this.parlay = this.allActiveLiab.filter((item: any) => item.sportId === 15);
        this.exchange = this.allActiveLiab.filter((item: any) => item.sportId !== 15)
        this.count = this.parlay.length
        this.countEx = this.exchange.length
      })
      this.dataServe.betSuccessMsg.subscribe((res: any) => {
        if (res) {
          this.dataServe.getActiveLiabUserWise().subscribe((res: any) => {
            this.allActiveLiab = res;
            this.parlay = this.allActiveLiab.filter((item: any) => item.sportId === 15);
            this.exchange = this.allActiveLiab.filter((item: any) => item.sportId !== 15)
            this.count = this.parlay.length
            this.countEx = this.exchange.length
          })
        }
      })


      this.dataServe.getUserUnmatchedBets().subscribe((res: any) => {
        this.unmatchedData = res;
        this.exchange01 = this.unmatchedData.filter((item: any) => item.sportId !== 15)
        this.count = this.parlay.length
        this.countEx = this.exchange.length
      })
    }
    this.updateIndicatorPosition();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownList = document.querySelector('.dpshow');
    if (dropdownList && !dropdownList.contains(target) && !target.closest('.dropdown-toggle')) {
      this.competion = false;
    }
  }

  competion = false
  changestabs = 'by Time';

  closePopup() {
    this.popupService.closePopup();
  }
  onCompet() {
    this.competion = !this.competion
  }
  tabsActive(selectedTab: string) {
    this.changestabs = selectedTab;
    this.competion = false;
  }
  openListInfo(data: any) {
    if (this.betListInfo == false) {
      this.betid = data?.id
      this.selectedList = data
      this.betList = false;
      this.betListInfo = true;
      this.dataServe.getActiveBetsUserWise(this.selectedList.sourceId).subscribe((res: any) => {
        this.ActiveLiablist = res;
      })
    } else {
      this.betListInfo = false
    }
  }
  openListUnmatchedInfo(data: any) {
    if (this.betListInfo == false) {
      this.betid = data?.id
      this.selectedList = data
      this.betList = false;
      this.betListInfo = true;
      this.dataServe.getUnmatchedBetsUserWise(this.selectedList.sourceId).subscribe((res: any) => {
        this.ActiveLiablist = res;
      })
    } else {
      this.betListInfo = false
    }
  }
  getParlayById(data: any) {
    if (this.openParlayBets == data) {
      this.openParlayBets = '';
    } else {
      this.openParlayBets = data;
      this.dataServe.getParlayById(data).subscribe((res: any) => {
        this.parlayActive = res
      })

    }
  }
  goBack() {
    this.betList = true;
    this.betListInfo = false;
  }

  setTab(data: any) {
    this.activeTab = data
    this.updateIndicatorPosition()
  }
  private updateIndicatorPosition(): void {
    const activeTabElement = document.querySelectorAll('.tab')[this.activeTab] as HTMLElement;

    this.indicatorWidth = activeTabElement.offsetWidth;
    this.indicatorLeft = activeTabElement.offsetLeft;
  }

  matchtab(val: any) {
    this.selectmatch = val
  }
  matchtab1(val: any) {
    this.selectmatch1 = val
  }
}
