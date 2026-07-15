import { AuthserviceService } from 'src/app/services/authservice.service';
import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Subscription, Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import 'moment-timezone';
import { HandlerService } from 'src/app/services/handler.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { GetSocketUrlService } from 'src/app/services/get-socket-url.service';
import { BetPlaceComponent } from '../bet-place/bet-place.component';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { MainFooterComponent } from '../main-footer/main-footer.component';
import { BetPlaceParlayComponent } from '../bet-place-parlay/bet-place-parlay.component';

@Component({
  selector: 'app-market-premium-parlay',
  templateUrl: './market-premium-parlay.component.html',
  styleUrls: ['./market-premium-parlay.component.css'],
   animations: [
      trigger('fadeInOut', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('300ms ease-in', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          animate('300ms ease-out', style({ opacity: 0 }))
        ])
      ])
    ],
    standalone:true,
    imports:[BetPlaceComponent,LoaderComponent,CommonModule,MainFooterComponent,BetPlaceParlayComponent]
})

export class MarketPremiumParlayComponent implements OnInit , OnDestroy{
  @ViewChild('formDataBack') formDataBack: any;
  @ViewChild('formDataLay') formDataLay: any;
  @ViewChild('socketEventOdds') formDataEvent: any;
  sub: Subscription = new Subscription();
  gameList: any;
  cricketList: any;
  loading: boolean = true;
  eventId: any;
  sportId: any;
  eventData: any = [];
  runners: any;
  oddsub: any;
  oddsub2: Subscription | undefined;
  oddsub3: any;
  oddsub4: any;
  oddsub5: any;
  oddsub6: any;
  test: any;
  runnersList: any = [];
  runnersList2: any = [];
  runnersList3: any = [];
  matchrunners : any = [];
  matchrunnerssid : any = [];
  selectedRunner: any;
  displayprice: any = 0.0;
  displayprice2: any = 0.0;
  betprice: any = 0.0;
  backData: Number = 0;
  backPriceSize: Number = 0;
  j: Number = 0;
  layData: Number = 0;
  betprice2: any = null;
  currentNat: any;
  loginResData: any;
  stakeDataBack: any;
  stakeDataLay: any;
  fancyData:any
  BookMFlag : boolean = false;
  isLogin = false;
  counterBet :number = 0;
  openBMInfo : boolean = false;
  openTossInfo : boolean = false;
  openFancyinfo : boolean = false;
  hideHeader : boolean = false;
  hideHeader1 : boolean = false;
  showFancy = true;
  toggleFancy = true;
  show = null
  showBackSelectToss = null
  showBackSelectPreF = null
  showBackSelectFancy = null
  showLaySelectFancy = null
  showFancyBet = null;
  showPreFancyBet = null;
  hideFancyForST = true
  classclrforlayBack = ''
  oddPrice : any;
  closeLTv = true;
  hideTossBefore2hr: boolean = false;
  showhidetoss: boolean = false;
  tosscheck : any;
  eventData2 : any;
  socketEventOdds : any;
  socketEventMOdds : any;
  totalMatched : any;
  matchData : any;
  betSuccess : any ;
  betsuccessstatus : boolean = false;
  showBetMsg : boolean = false;
  betresult : any;
  selectionname : any;
  stakes : any;
  betOddResult : any;
  isback : boolean = false;
  isLay : boolean = false;
  inplay : any;
  inplaystatus : any;
  getMatcBkData = false;
  getTossBkData = false;
  getMatchODData = false;
  PFancyAllData : any = [];
  PFancyData : any = [];
  PremiumfancyLiability : any;
  backTrue : any;
  fancybookdata : any = [];
  preMatchMarket : any = [];
  fancypermission:any;
  bookList:any =[];
  pnlList:any =[];
  tvchannel:any;
  bmtimeout:any;
  oddtimeout:any;
  tosstimeout:any;
  fancytimeout:any;
  premtimeout:any;
  othertimeout:any;
  openBetComp = false;
  url2:any;
  showTabs='scrd';
  urlSafe: SafeResourceUrl | undefined;
  urlSafe2: SafeResourceUrl | undefined;
  videoHeight: number = 120;
  startX: any;
  startY: any;
  initialLeft: any;
  initialTop: any;
  isDragging: boolean = false;
  fancyLiab : any;
  bets: number = 1
  count = 0;
  arroicon=true;
  isOutside: boolean = false;
  betCount = 0;
  openBetSlip = false;
  webdata : any;
  jsonWebdt : any;
  constructor(private dataServe: DataHandlerService, private socket: SocketServiceService,private popupService: HandlerService,
              private route: ActivatedRoute, public sanitizer: DomSanitizer, private getSocketPath : GetSocketUrlService, private authServe:AuthserviceService,
              private el: ElementRef, private renderer: Renderer2) { }

  async ngOnInit() {
    await this.getSocketPath.getSocketUrl();
    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      if (d1?.theme) {
        this.jsonWebdt = JSON.parse(d1?.theme)
      }
    }
    //this.socket.destorySocket2();
    localStorage.setItem('placebetcheck', 'false')
    let token = localStorage.getItem('token')
    if(token){
      // this.showTabs='tv';
      this.isLogin = true;
      this.getMatcBkData = true;
      let data = localStorage.getItem('userData')
      if (data) {
        this.loginResData = JSON.parse(data)
      }
      this.dataServe.openLTV.subscribe((res : any)=>{
        this.closeLTv = res
      })

      this.dataServe.betSuccessMsg.subscribe((res : any)=>{
        this.betSuccess = res;
        this.showBetMsg = true;
        if(res[2].type=='success'){
          this.dataServe.getActiveLiabUserWise().subscribe((res: any) => {
            this.count = res.length
          })
        }

        this.betsuccessstatus = this.betSuccess[0];
          setTimeout(() => {
            this.showBetMsg = false;
          }, 5000);
      })

    }else{
      this.isLogin = false;
    }

    let btct = localStorage.getItem('parlayOdds')
      if(btct){
        let ndt = JSON.parse(btct)
        this.betCount=ndt.length;
      }

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('sportId') && paramMap.has('eventId')) {

        this.sportId = paramMap.get('sportId');
        this.eventId = paramMap.get('eventId');
        this.socket.connectSocket2(this.sportId);

        localStorage.setItem('selectedEventId', this.eventId)
        if(this.sportId == 2 || this.sportId == 1){
          this.showFancy = false
          this.hideFancyForST = false
          this.toggleFancy = false
        }else if(this.sportId== 4){
          this.toggleFancy = true
          this.showFancy = true
          this.hideFancyForST = true
        }

        if(token){
          this.dataServe.getEventDataOnLoadnew(this.eventId).subscribe((res: any) => {
            this.eventData = res;
            this.urlSafe = this.getScore(this.eventData?.scoreBase, this.eventId);
            this.url2=res.tvurl;
            localStorage.setItem('tvurl',this.url2)

            if(this.url2){
            } else {
              this.authServe.logout();
            }

            this.fancypermission=this.eventData?.isAutoFancy;

            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            this.matchrunners = this.eventData.selectionIdName.split(',');
            this.matchrunnerssid = this.eventData.selectionId.split(',');

            this.preMatchMarket = JSON.parse(this.eventData.preMatchMarket).map((market:any) => {
              if(market.name) {
                market.pSelection = JSON.parse(market.pSelection);
              }
              return market;
            });

            this.loading = false;

          })
        } else {
          this.dataServe.getEventDataOnLoad(this.eventId).subscribe((res: any) => {
            this.eventData = res;
            this.urlSafe = this.getScore(this.eventData?.scoreBase, this.eventId);
            this.fancypermission=this.eventData?.isAutoFancy;

            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);

            this.matchrunners = this.eventData.selectionIdName.split(',');
            this.matchrunnerssid = this.eventData.selectionId.split(',');

            this.preMatchMarket = JSON.parse(this.eventData.preMatchMarket).map((market:any) => {
              if(market.name) {
                market.pSelection = JSON.parse(market.pSelection);
              }
              return market;
            });

            this.loading = false;

          })
        }

        if(token){
          this.dataServe.getPremiumFancyBook(this.eventId).subscribe((res : any)=>{
            this.PremiumfancyLiability = res
          })
        }

        this.dataServe.getEventDataOnLoad2(this.eventId).subscribe((res: any) => {
          this.eventData2 = res;
          if(this.eventData2 && this.eventData2!=='OK'){
            // code for odds start
            if(this.eventData2.oddsProvider==='Tiger')
            {
              this.totalMatched = res.odds?.[0]?.totalMatched;
              this.runnersList = res.odds?.[0]?.runners;
            }
            else if(this.eventData2.oddsProvider==='Neeraj')
            {
              this.totalMatched = res.odds?.[0]?.totalMatched;
              this.runnersList = res.odds?.[0]?.runners;
            }
            // code for odds End

          }
        })

        //Primium Fancy Code Start
        this.socket.setPremiumFancy(this.eventId);
        this.socket.getPremiumFancy(this.eventId);

        this.oddsub5 = this.socket.getUpdatePRMFancyListner().subscribe((res: any) => {
          this.PFancyAllData = res.message5;
          if(res.message5.Type=='Premium'){
            this.PFancyData = res.message5.data.sportsBookMarket;
          }
        })
        //Primium Fancy Code End

      }

    })

    setTimeout(()=>{
      let url = localStorage.getItem('tvurl')
      this.urlSafe2 = this.sanitizer.bypassSecurityTrustResourceUrl(url+this.tvchannel);
    },3000)
  }

  getMatchDetails(){
    this.dataServe.getEventDataOnLoad(this.eventId).subscribe((res: any) => {
      this.eventData = res;
      this.fancypermission=this.eventData?.isAutoFancy;
      this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
    });
  }


  trackByFn(index: number, item: any): any {
    return index;
  }

   getScore(socreUrl : any, data: any) {
    let random = Math.floor(1000 + Math.random() * 9000);
    return this.sanitizer.bypassSecurityTrustResourceUrl(socreUrl+data+'?v='+random)
  }

  openmatchBetSlip(){
    this.openBetSlip=true;
  }
  closeParlyBet(data:any){
    if(data=='false'){
      this.openBetSlip=false;
    } else {
      this.betCount=data.length;
    }
  }

  ngOnDestroy() {
    this.socket.destorySocket(this.eventId);
    if(this.oddsub5){
      this.oddsub5.unsubscribe();
    }

    localStorage.removeItem('tvurl')
  }

  closeBet(){
    this.showBetMsg = false
  }

  scoreTvTabs(dt:any){
    this.showTabs = dt;
  }
  hideFancyBet(){
    this.toggleFancy = true
    this.showFancy = true
  }
  showPreFancy(){
    this.toggleFancy = true
    this.showFancy = false
  }
  collapseData(i:any){
    document.getElementById('DDR'+i)?.classList.toggle('openar');
    document.getElementById('sportSelData'+i)?.classList.toggle('displaydata');
  }
  hideSelectionData(){
    document.getElementById("sportSelectionData")?.classList.toggle('d-none')
  }

  cancelBet(){
    this.counterBet = 0
  }
  minusCounter(){
    if(this.counterBet > 5){
      this.counterBet--
    }else if(this.counterBet){
      this.counterBet = 5;
    }
  }
  plusCounter(){
    this.counterBet++
  }
  openBMinfo(){
    this.openBMInfo = !this.openBMInfo
  }
  openTossinfo(){
    this.openTossInfo = !this.openTossInfo
  }
  closeBMinfo(){
    this.show = null
    this.openBMInfo = false;
    this.openTossInfo = false;
    this.openFancyinfo = false;
    this.hideHeader1 = false
    this.dataServe.getloginFlag(this.hideHeader1)
  }
  openFancyInfo(i : any){
    if (this.show == i) {
      this.show = null;
    } else {
      this.show = i;
    }
  }

  openPreFancyBetPlace(parlayType: any, data: any){
    let parType = localStorage.getItem('parlayType')
    if(parType=='Premium' || parType==null){

      localStorage.setItem('parlayType',parlayType)
      let localodd = localStorage.getItem('parlayOdds')
      if(localodd){
        let localodddata = JSON.parse(localodd)
        let sameEvent = localodddata.find((item:any) => item.eventId == this.eventId);
        if(sameEvent){
          let diffEvent = localodddata.filter((item:any) => item.eventId !== this.eventId);
          if(diffEvent){
            diffEvent.push(data[0])
            localStorage.setItem('parlayOdds',JSON.stringify(diffEvent))
          } else {
            localStorage.setItem('parlayOdds',JSON.stringify(data))
          }
        } else {
          localodddata.push(data[0])
          localStorage.setItem('parlayOdds',JSON.stringify(localodddata))
        }
      } else {
        localStorage.setItem('parlayOdds',JSON.stringify(data))
      }


      let btct = localStorage.getItem('parlayOdds')
      if(btct){
        let ndt = JSON.parse(btct)
        this.betCount=ndt.length;
      }
    } else {
      let res = {"type": "error","message": "You Already Selected " + parType + " Parlay Type","title": "Oops.."}
      this.dataServe.betSuccessParlay(false,'', res)
    }
  }

  openRulesPopup(){
    this.hideHeader1 = !this.hideHeader1
    if(this.route.component?.name === 'match'){
      this.hideHeader = true;
      this.dataServe.getloginFlag(this.hideHeader)
    }else{
      this.hideHeader = false
    }
  }
  closeLiveTv(){
    this.closeLTv = false;
  }

  hideTossbefor2HrFun(data: any) {
    const dateTime = this.datetimeconvert(data.openDate);

    let withinHrs = moment(dateTime).subtract(2, 'hours').format('MM/DD/YYYY HH:mm:ss');
    let date3 = new Date()
    let date2 = moment(date3).format('MM/DD/YYYY HH:mm:ss')

    if(moment(date2).isAfter(withinHrs)) {
      return this.hideTossBefore2hr = false
    } else {
      if(this.sportId == '4') {
        return this.hideTossBefore2hr = true
      } else {
        return this.hideTossBefore2hr = false
      }
    }
  }

  datetimeconvert(data:any){
    const dateTime = new Date(data);
    const utcYear = dateTime.getUTCFullYear();
    const utcMonth = padZero(dateTime.getUTCMonth() + 1); // Months are 0-indexed
    const utcDate = padZero(dateTime.getUTCDate());
    const utcHours = padZero(dateTime.getUTCHours());
    const utcMinutes = padZero(dateTime.getUTCMinutes());
    const utcSeconds = padZero(dateTime.getUTCSeconds());

    function padZero(value:any) {
      return value < 10 ? `0${value}` : value;
    }
    const opendate = `${utcYear}-${utcMonth}-${utcDate} ${utcHours}:${utcMinutes}:${utcSeconds}`;
    return opendate;
  }

  inPlayMatches(data:any){
    if(this.sportId==4){
      let date = this.datetimeconvert(data);
      let withinHrs = moment(date).subtract(30, 'minutes').format('MM/DD/YYYY HH:mm:ss');

      let date3 = new Date();
      let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
      if(moment(currentDate).isAfter(withinHrs)){
        this.inplay = true
        return this.inplay;
      }else{
        this.inplay = false
        return this.inplay;
      }
    } else {
      let date = this.datetimeconvert(data);
      let withinHrs = moment(date).format('MM/DD/YYYY HH:mm:ss');
      let date3 = new Date();
      let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
      if(moment(currentDate).isAfter(withinHrs) ) {
        this.inplay = true
        return this.inplay;
      }else{
        this.inplay = false
        return this.inplay;
      }
    }
  }
  refreshPage(){
    window.location.reload()
  }
  stopTimeout(data:any){
    if(data==true){
      clearTimeout(this.oddtimeout)
      clearTimeout(this.bmtimeout)
      clearTimeout(this.tosstimeout)
      clearTimeout(this.fancytimeout)
      clearTimeout(this.othertimeout)
      clearTimeout(this.premtimeout)
    }
  }

  sortPFancyData(sportsBookSelection: any[]): any[] {
    return sportsBookSelection?.sort((a, b) => {
      if (a.selectionName < b.selectionName) return -1;
      if (a.selectionName > b.selectionName) return 1;
      return 0;
    });
  }

  openBetpop() {
    this.popupService.openBetPopup();
  }
  fBets(arg0: number) {
    this.bets = arg0
  }
  downarrow() {
    this.arroicon=!this.arroicon
  }
 onScroll(event: Event): void {
  const uiEvent = event as UIEvent;
  const container = uiEvent.target as HTMLElement;

  const videoWrapperElement = document.querySelector('.video-wrapper');
  const framedetElement = document.querySelector('.framedet') as HTMLElement;
  if (videoWrapperElement) {
    if (container.scrollTop > 100) {
      videoWrapperElement.classList.add('is-outside');
      this.isOutside = true;
    } else {
      videoWrapperElement.classList.remove('is-outside');
        framedetElement.style.transform = '';
        this.isOutside = false;

    }
  }
}

openPopup() {
  this.popupService.openPopup();
}
closeTv() {
  const framedetElement = document.querySelector('.framedet') as HTMLElement;
  framedetElement.style.display = 'none';
  this.showTabs = 'scrd';
}



// Track which items are open
openItems: Set<number> = new Set();

toggle(i: number) {
  // Only toggle items after the first 3
  if (i > 2) {
    if (this.openItems.has(i)) {
      this.openItems.delete(i);
    } else {
      this.openItems.add(i);
    }
  }
}

// Check if an item is open
isOpen(i: number): boolean {
  return i <= 2 || this.openItems.has(i); // first 3 always open
}
}
