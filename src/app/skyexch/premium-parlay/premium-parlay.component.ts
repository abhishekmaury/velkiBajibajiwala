import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { SocketServiceService } from '../../services/socket-service.service';
import { ParlayBetPlaceComponent } from '../parlay-bet-place/parlay-bet-place.component';
import { GetSocketUrlService } from '../../services/get-socket-url.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';



@Component({
  selector: 'app-premium-parlay',
  standalone: true,
  imports:[CommonModule,ParlayBetPlaceComponent],
  templateUrl: './premium-parlay.component.html',
  styleUrls: ['./premium-parlay.component.css']
})
export class PremiumParlayComponent {
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
  oddsub5: any;
  test: any;
  runnersList: any = [];
  runnersList2: any = [];
  runnersList3: any = [];
  matchrunners: any = [];
  matchrunnerssid: any = [];
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
  fancyData: any
  BookMFlag: boolean = false;
  isLogin = false;
  counterBet: number = 0;
  openBMInfo: boolean = false;
  openTossInfo: boolean = false;
  openFancyinfo: boolean = false;
  hideHeader: boolean = false;
  hideHeader1: boolean = false;
  hideHeader2: boolean = false;
  normalfancy: any = [];
  showFancy = true;
  toggleFancy = true;
  showBackSelectPreF = null
  showPreFancyBet = null;
  hideFancyForST = true
  classclrforlayBack = ''
  oddPrice: any;
  closeLTv = true;
  hideTossBefore2hr: boolean = false;
  showhidetoss: boolean = false;
  tosscheck: any;
  eventData2: any;
  socketEventOdds: any;
  socketEventMOdds: any;
  matchData: any;
  betSuccess: any;
  betsuccessstatus: boolean = false;
  showBetMsg: boolean = false;
  betresult: any;
  betOddResult: any;
  inplay: any;
  inplaystatus: any;
  getMatcBkData = false;
  getTossBkData = false;
  getMatchODData = false;
  PFancyAllData: any = [];
  PFancyData: any = [];
  PremiumfancyLiability: any;
  openFanBook = false;
  beforeoddscal = false;
  afteroddscal = false;
  beforeBMcal = false;
  afterBMcal = false;
  oddpnl1: any = 0;
  oddpnl2: any = 0;
  oddpnl3: any = 0;
  bmpnl1: any = 0;
  bmpnl2: any = 0;
  bmpnl3: any = 0;
  backTrue: any;
  fancybookdata: any = [];
  preMatchMarket: any = [];
  validateapi: any;
  newbookdata: any;
  oddspermission: any;
  bmpermission: any;
  fancypermission: any;
  otpermisssion: any;
  prempermission: any;
  bookList: any = [];
  pnlList: any = [];
  premtimeout: any;
  layBet = true;
  odlimit = false;
  collapse1 = false;
  oddminStake: any;
  oddmaxStake: any;
  show: any;
  private mutationObserver!: MutationObserver;
  private intervalId!: any;
  betCount = 0;
  openBetSlip = false;
  urlSafe: SafeResourceUrl | undefined;
  urlSafe2: SafeResourceUrl | undefined;
  tvchannel: any;
  oddsub: any;





  constructor(private dataServe: DataHandlerService, private socket: SocketServiceService, private getSocketPath: GetSocketUrlService,
    private route: ActivatedRoute, public sanitizer: DomSanitizer, private elRef: ElementRef, private renderer: Renderer2) {
  }

  async ngOnInit() {
    await this.getSocketPath.getSocketUrl();

    let token = localStorage.getItem('token')
    if (token) {
      this.isLogin = true;
      this.getMatcBkData = true;
      let data = localStorage.getItem('userData')
      if (data) {
        this.loginResData = JSON.parse(data)
      }

      let btct = localStorage.getItem('parlayOdds')
      if (btct) {
        let ndt = JSON.parse(btct)
        this.betCount = ndt.length;
      }

      this.dataServe.betSuccessMsg.subscribe((res: any) => {
        this.betSuccess = res;
        this.showBetMsg = true;

        this.betsuccessstatus = this.betSuccess[0];
        setTimeout(() => {
          this.showBetMsg = false;
        }, 5000);
      })

    } else {
      this.isLogin = false;
    }

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('sportId') && paramMap.has('eventId')) {

        this.sportId = paramMap.get('sportId');
        this.eventId = paramMap.get('eventId');
        this.socket.connectSocket2(this.sportId)
        this.urlSafe = this.getScore(this.eventId)



        if (this.sportId == 2 || this.sportId == 1) {
          this.showFancy = false
          this.hideFancyForST = false
          this.toggleFancy = false
        } else if (this.sportId == 4) {
          this.toggleFancy = true
          this.showFancy = true
          this.hideFancyForST = true
        }

        let sectimed = this.dataServe.getTimeStamp();
        let mddata = { "eventId": this.eventId, "timeStamp": sectimed.timeStamp, "secretKey": sectimed.secretKey }

        // this.dataServe.verifyUser(mddata).subscribe((res: any) => {
        // }, (error) => {
        //   if (error.status == 200) {
        //     this.validateapi = this.dataServe.decryptData(error.error.text);
        //     if (this.validateapi.data.type == 'success') {
        //       this.dataServe.getUserMatcheDetail(mddata).subscribe((res: any) => {
        //       }, (error) => {
        //         if (error.status == 200) {
        //           let res = this.dataServe.decryptData(error.error.text);
        //           this.eventData = res.data;
        //           this.prempermission = this.eventData?.isPrem;

        //           this.inplaystatus = this.inPlayMatches(this.eventData.matchDate);
        //           if (this.sportId !== '4' && this.inplaystatus == false) {
        //             this.layBet = false;
        //           }

        //           if (this.eventData.team3 != undefined) {
        //             this.matchrunners.push(this.eventData.team1, this.eventData.team2, this.eventData.team3);
        //             this.matchrunnerssid.push(this.eventData.id1, this.eventData.id2, this.eventData.id3);
        //           } else {
        //             this.matchrunners.push(this.eventData.team1, this.eventData.team2);
        //             this.matchrunnerssid.push(this.eventData.id1, this.eventData.id2);
        //           }

        //           this.preMatchMarket = JSON.parse(this.eventData.preMatchMarket).map((market: any) => {
        //             if (market.name) {
        //               market.pSelection = JSON.parse(market.pSelection);
        //             }
        //             return market;
        //           });

        //         }
        //       })
        //     }
        //   }
        // })
        this.oddsub = this.socket.getUpdateMessageListner().subscribe((res: any) => {
          this.tvchannel = res.message.banglaTV;

        })

        //Primium Fancy Code Start
        this.socket.setPremiumFancy(this.eventId);
        this.socket.getPremiumFancy(this.eventId);

        this.oddsub5 = this.socket.getUpdatePRMFancyListner().subscribe((res: any) => {
          this.PFancyAllData = res.message5;
          if (res.message5.Type == 'Premium') {
            this.PFancyData = res.message5.data.sportsBookMarket;
            this.oddminStake = this.PFancyAllData?.events?.markets[0].limit[2].minStake;
            this.oddmaxStake = this.PFancyAllData?.events?.markets[0].limit[2].maxStake;
          }
        })
        //Primium Fancy Code End

      }

    })

    setTimeout(() => {
      let url = localStorage.getItem('tvurl')
      this.urlSafe2 = this.sanitizer.bypassSecurityTrustResourceUrl(url + this.tvchannel)
    }, 3000)

    setTimeout(() => {
      const dataElement = this.elRef.nativeElement.querySelectorAll('.sparknew');
      dataElement.forEach((element: HTMLElement, index: number) => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              this.renderer.addClass(element.parentElement, 'spark');
              setTimeout(() => {
                this.renderer.removeClass(element.parentElement, 'spark');
              }, 500);
            }
          });
        });

        observer.observe(element, {
          characterData: true,
          childList: true,
          subtree: true
        });
      });

    }, 3000);
  }

  getMatchDetails() {
    let sectimed = this.dataServe.getTimeStamp();
    let mddata = { "eventId": this.eventId, "timeStamp": sectimed.timeStamp, "secretKey": sectimed.secretKey }

    // this.dataServe.verifyUser(mddata).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataServe.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataServe.getUserMatcheDetail(mddata).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let res = this.dataServe.decryptData(error.error.text);
    //           this.eventData = res.data;
    //           this.prempermission = this.eventData?.isPrem;

    //         }
    //       })
    //     }
    //   }
    // })
  }


  closeFancyBook() {
    this.openFanBook = false
  }
  trackByFn(index: number, item: any): any {
    return index;
  }

  openoddslimit() {
    if (this.odlimit == true) {
      this.odlimit = false;
    } else {
      this.odlimit = true;
    }

  }

  openmatchBetSlip() {
    this.openBetSlip = true;
  }
  closeParlyBet(data: any) {
    if (data == 'false') {
      this.openBetSlip = false;
    } else {
      this.betCount = data.length;
    }
  }
  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.socket.destorySocket(this.eventId);
    if (this.oddsub5) {
      this.oddsub5.unsubscribe();
    }
  }

  closeBet() {
    this.showBetMsg = false
  }

  hideFancyBet() {
    this.toggleFancy = true
    this.showFancy = true
  }
  showPreFancy() {
    this.toggleFancy = false
    this.showFancy = false
  }
  collapseData(i: any) {
    document.getElementById('DDR' + i)?.classList.toggle('openar');
    document.getElementById('sportSelData' + i)?.classList.toggle('displaydata');
  }
  hideSelectionData() {
    document.getElementById("sportSelectionData")?.classList.toggle('d-none')
  }

  cancelBet() {
    this.counterBet = 0
  }

  openTossinfo() {
    this.openTossInfo = !this.openTossInfo
  }
  closeBMinfo() {
    this.show = null
    this.openBMInfo = false;
    this.openTossInfo = false;
    this.openFancyinfo = false;
    this.hideHeader1 = false;
    this.hideHeader2 = false;
    this.dataServe.getloginFlag(this.hideHeader1)
  }
  openFancyInfo(i: any) {
    if (this.show == i) {
      this.show = null;
    } else {
      this.show = i;
    }
  }

  openPreFancyBetPlace(parlayType: any, data: any) {
    let parType = localStorage.getItem('parlayType')
    if (parType == 'Premium' || parType == null) {

      localStorage.setItem('parlayType', parlayType)
      let localodd = localStorage.getItem('parlayOdds')
      if (localodd) {
        let localodddata = JSON.parse(localodd)
        let sameEvent = localodddata.find((item: any) => item.eventId == this.eventId);
        if (sameEvent) {
          let diffEvent = localodddata.filter((item: any) => item.eventId !== this.eventId);
          if (diffEvent) {
            diffEvent.push(data[0])
            localStorage.setItem('parlayOdds', JSON.stringify(diffEvent))
          } else {
            localStorage.setItem('parlayOdds', JSON.stringify(data))
          }
        } else {
          localodddata.push(data[0])
          localStorage.setItem('parlayOdds', JSON.stringify(localodddata))
        }
      } else {
        localStorage.setItem('parlayOdds', JSON.stringify(data))
      }


      let btct = localStorage.getItem('parlayOdds')
      if (btct) {
        let ndt = JSON.parse(btct)
        this.betCount = ndt.length;
      }
    } else {
      let res = { "type": "error", "message": "You Already Selected " + parType + " Parlay Type", "title": "Oops.." }
      this.dataServe.betSuccessParlay(false, '', res)
    }
  }

  openRulesPopup() {
    this.hideHeader1 = !this.hideHeader1
    if (this.route.component?.name === 'MobMainPageComponent') {
      this.hideHeader = true;
      this.dataServe.getloginFlag(this.hideHeader)
    } else {
      this.hideHeader = false
    }
  }

  openPRulesPopup() {
    this.hideHeader2 = !this.hideHeader2
    if (this.route.component?.name === 'MobMainPageComponent') {
      this.hideHeader = true;
      this.dataServe.getloginFlag(this.hideHeader)
    } else {
      this.hideHeader = false
    }
  }
  closeLiveTv() {
    this.closeLTv = false;
  }

  hideTossbefor2HrFun(data: any) {
    const dateTime = this.datetimeconvert(data.matchDate);

    // let withinHrs = moment(dateTime).subtract(2, 'hours').format('MM/DD/YYYY HH:mm:ss');
    let withinHrs = moment(dateTime).add(210, 'minutes').format('MM/DD/YYYY HH:mm:ss');
    let date3 = new Date()
    let date2 = moment(date3).format('MM/DD/YYYY HH:mm:ss')

    if (moment(date2).isAfter(withinHrs)) {
      return this.hideTossBefore2hr = false
    } else {
      if (this.sportId == '4') {
        return this.hideTossBefore2hr = true
      } else {
        return this.hideTossBefore2hr = false
      }
    }
  }

  datetimeconvert(data: any) {
    const dateTime = new Date(data);
    const utcYear = dateTime.getUTCFullYear();
    const utcMonth = padZero(dateTime.getUTCMonth() + 1); // Months are 0-indexed
    const utcDate = padZero(dateTime.getUTCDate());
    const utcHours = padZero(dateTime.getUTCHours());
    const utcMinutes = padZero(dateTime.getUTCMinutes());
    const utcSeconds = padZero(dateTime.getUTCSeconds());

    function padZero(value: any) {
      return value < 10 ? `0${value}` : value;
    }
    const opendate = `${utcYear}-${utcMonth}-${utcDate} ${utcHours}:${utcMinutes}:${utcSeconds}`;
    return opendate;
  }

  toNumber(value: any): number {
    return typeof value === 'number' ? value : 0;
  }

  inPlayMatches(data: any) {
    let date = this.datetimeconvert(data);
    //let withinHrs = moment(date).format('MM/DD/YYYY HH:mm:ss');
    let withinHrs = moment(date).add(330, 'minutes').format('MM/DD/YYYY HH:mm:ss');
    let date3 = new Date()
    let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
    if (moment(currentDate).isAfter(withinHrs)) {
      this.inplay = true
      return this.inplay;
    } else {
      this.inplay = false
      return this.inplay;
    }
  }

  refreshPage() {
    window.location.reload()
  }

  stopTimeout(data: any) {
    if (data == true) {
      clearTimeout(this.premtimeout)
    }
  }
  scrollToElement(type: string, level: number, id: number): void {
    const elementId = `${type}${level}Odds${id}`;
    const element = this.elRef.nativeElement.querySelector(`#${elementId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center'
      });
    } else {
      // console.warn(`Element with ID ${elementId} not found`);
    }
  }
  collapseData1() {

    this.collapse1 = !this.collapse1;
  }
  closePopup() {
    this.collapse1 = false;
  }
  showTabs = 'tv';
  scoreTvTabs(dt: any) {
    this.showTabs = dt;
  }
  sortPFancyData(sportsBookSelection: any[]): any[] {
    return sportsBookSelection?.sort((a, b) => {
      if (a.selectionName < b.selectionName) return -1;
      if (a.selectionName > b.selectionName) return 1;
      return 0;
    });
  }

  getScore(data: any) {
    let url = "https://b2cscore.365cric.com/#/score1/";
    //let url = "https://tejscore.com/cricket/anim-score/"
    let random = Math.floor(1000 + Math.random() * 9000);
    return this.sanitizer.bypassSecurityTrustResourceUrl(url + data + '?v=' + random)
  }


}
