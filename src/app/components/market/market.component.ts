import { AuthserviceService } from 'src/app/services/authservice.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { min, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import 'moment-timezone';
import { HandlerService } from 'src/app/services/handler.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { HttpResponse } from '@angular/common/http';
import { GetSocketUrlService } from 'src/app/services/get-socket-url.service';
import { NodeWebSocket } from 'socket.io-client';
declare var Hls: any;

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
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
  ]
})

export class MarketComponent implements OnInit, OnDestroy {
  @ViewChild('formDataBack') formDataBack: any;
  @ViewChild('formDataLay') formDataLay: any;
  @ViewChild('socketEventOdds') formDataEvent: any;
  @ViewChild('iframeRef') iframeRef!: ElementRef<HTMLIFrameElement>;
  hls: any = null;
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
  normalfancy: any = [];
  normalFan = true;
  fancy1: any = [];
  fan1 = true;
  overfancy: any = [];
  overFan = true
  bbbfancy: any = [];
  bbbFan = true
  khaddafancy: any = [];
  khaddaFan = true
  lotteryfancy: any = [];
  lotteryFan = true
  oddevenfancy: any = [];
  oddevenFan = true
  showFancy = true;
  toggleFancy = true;
  show = null
  showOdd = null
  showBackSelect = null
  showLaySelect = null
  showBackSelectBM = null
  showLaySelectBM = null
  showBackSelectToss = null
  showBackSelectPreF = null
  showBackSelectFancy = null
  showLaySelectFancy = null
  showBM = null
  showToss = null;
  showOther = null
  showBackSelectOD = null
  showLaySelectOD = null
  showFancyBet = null;
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
  totalMatched: any;
  matchData: any;
  betSuccess: any;
  betsuccessstatus: boolean = false;
  showBetMsg: boolean = false;
  betresult: any;
  selectionname: any;
  stakes: any;
  betOddResult: any;
  isback: boolean = false;
  isLay: boolean = false;
  inplay: any;
  inplaystatus: any;
  getMatcBkData = false;
  getTossBkData = false;
  getMatchODData = false;
  oddsPnlArray: any[] = [];
  tossPnlArray: any = [];
  beforeoddsPnlArray: any[] = [];
  afteroddsPnlArray: any[] = [];
  beforeBMPnlArray: any[] = [];
  afterBMPnlArray: any[] = [];
  bmPnlArray: any[] = []
  tosssocketdata: any = [];
  fancyDataList: any = [];
  allFancyDataList: any[] = []
  fancyselectedTab: any = 'all';
  fancyEventData: any = [];
  PFancyAllData: any = [];
  PFancyData: any = [];
  fancyLiability: any;
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
  MOddsAllData: any = [];
  MOddsDataOther: any = [];
  omPnlArray: any = [];
  omPnlArrayData: any = [];
  TopMenuselectedItem: any = 'Match-Odds';
  oddspermission: any;
  bmpermission: any;
  fancypermission: any;
  prempermission: any;
  otherpermission: any;
  bookList: any = [];
  pnlList: any = [];
  tvchannel: any;
  bmtimeout: any;
  oddtimeout: any;
  tosstimeout: any;
  fancytimeout: any;
  premtimeout: any;
  othertimeout: any;
  openBetComp = false;
  url2: any;
  showTabs = 'scrd';
  urlSafe: SafeResourceUrl | undefined;
  urlSafe2: SafeResourceUrl | undefined;
  videoHeight: number = 120;
  startX: any;
  startY: any;
  initialLeft: any;
  initialTop: any;
  isDragging: boolean = false;
  fancyLiab: any;
  bets: number = 0
  count = 0;
  arroicon = true;
  isOutside: boolean = false;
  hideHeader2: boolean = false;
  arroiconToss: boolean = true;
  showWidget: boolean = false;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  betMsgTimer: any;
  preactivetab: any = 'All';
  activeTab: number = 0;
  indicatorWidth: number = 0;
  indicatorLeft: number = 0;
  deviceId: any;
  premiumData: any;
  checkLimits: any;
  AllLimits: any;
  oddMin: number = 0;
  oddMax: number = 0;
  bmMin: number = 0;
  bmMax: number = 0;
  fancyMin: number = 0;
  fancyMax: number = 0;
  otherMin: number = 0;
  otherMax: number = 0;
  tossMin: number = 0;
  tossMax: number = 0;
  playtv: boolean = false;
  isMuted: boolean = false;
  intervalIdTime: any;
  newSocketData: any;

  constructor(private dataServe: DataHandlerService, private socket: SocketServiceService, private popupService: HandlerService,
    private route: ActivatedRoute, public sanitizer: DomSanitizer, private getSocketPath : GetSocketUrlService, private authServe: AuthserviceService, private router: Router,
    private el: ElementRef, private renderer: Renderer2) { }

  async ngOnInit() {
    await this.getSocketPath.SocketUrls;
    this.newSocketData = this.getSocketPath.SocketUrls;
    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      if (d1?.theme) {
        this.jsonWebdt = JSON.parse(d1?.theme)
      }
      if (d1?.links) {
        this.jsonWeblinksdt = JSON.parse(d1?.links)
      }
    }

    this.socket.destorySocket2();
    localStorage.setItem('placebetcheck', 'false')
    let token = localStorage.getItem('token')
    if (token) {
      this.isLogin = true;
      this.getMatcBkData = true;
      let data = localStorage.getItem('userData')
      if (data) {
        this.loginResData = JSON.parse(data)
      }
      this.dataServe.openLTV.subscribe((res: any) => {
        this.closeLTv = res
      })

      this.dataServe.betSuccessMsg.subscribe((res: any) => {
        this.betSuccess = res;
        this.showBetMsg = true;
        if (res[3].type == 'success') {

          if (res[1].sourceBetType === 'Fancy' || res[1].sourceBetType === 'Fancy1') {
            this.showFancyBet = null
            this.showBackSelectFancy = null;
            this.showLaySelectFancy = null;

            this.dataServe.getUserFancyBookData(res[1].eventId).subscribe((res: any) => {
              if (res) {
                this.fancyLiability = res;
                this.fancyLiab = res?.liability;
              }
            })
          } else if (res[1].sourceBetType === 'Odds' || res[1].sourceBetType === 'BooKMaker') {
            let type = 'Match odds';

            this.showOdd = null;
            this.showBM = null;
            this.showBackSelect = null;
            this.showLaySelect = null;
            this.showBackSelectBM = null;
            this.showLaySelectBM = null;
            this.afteroddscal = false;
            this.beforeoddscal = false;
            this.afterBMcal = false;
            this.beforeBMcal = false;

            this.dataServe.getUserMatchBookData(res[1].eventId, type).subscribe((res: any) => {
              if (res) {
                this.betOddResult = res;
                this.oddsPnlArray = [res.pnl1, res.pnl2, res.pnl3];
                this.bmPnlArray = [res.bmPnl1, res.bmPnl2, res.bmPnl3];
                this.getMatcBkData = true;
              } else {
                this.getMatcBkData = false;
                this.oddsPnlArray = [0, 0, 0];
                this.bmPnlArray = [0, 0, 0];
              }
            })
          } else if (res[1].sourceBetType === 'Toss') {
            let type = 'Toss';
            this.showBackSelectToss = null;
            this.showToss = null;
            this.dataServe.getUserMatchBookData(res[1].eventId, type).subscribe((res: any) => {
              if (res) {
                this.getTossBkData = true;
                this.tossPnlArray = [res.pnl1, res.pnl2, res.pnl3];
              } else {
                this.getTossBkData = false;
                this.tossPnlArray = [0, 0, 0];
              }
            });
          } else if (res[1].sourceBetType === 'Premium') {
            this.showPreFancyBet = null;
            this.showBackSelectPreF = null;
            this.dataServe.getPremiumFancyBook(res[1].eventId).subscribe((res: any) => {
              if (res) {
                this.PremiumfancyLiability = res
              }
            });
          } else if (res[1].sourceBetType === 'Other') {

            let type2 = 'Other';
            this.dataServe.getUserMatchBookData(res[1].eventId, type2).subscribe((res: any) => {
              if (res) {
                this.omPnlArray = res;
              } else {
                this.omPnlArray = [];
              }
            })

            this.showOther = null;
            this.showBackSelectOD = null;
            this.showLaySelectOD = null;
          }
        } else {
          this.afteroddscal = false;
          this.beforeoddscal = false;
          this.afterBMcal = false;
          this.beforeBMcal = false;
          this.showOdd = null;
          this.showBM = null;
          this.backTrue = false;
        }

        this.betsuccessstatus = this.betSuccess[0];
        this.betMsgTimer = setTimeout(() => {
          this.showBetMsg = false;
        }, 5000);
      })

    } else {
      this.isLogin = false;
    }

    this.socket.connectSocket();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has('sportId') && paramMap.has('eventId')) {
        this.sportId = paramMap.get('sportId');
        this.eventId = paramMap.get('eventId');
        if(this.sportId!=='2'){
          this.socket.connectSocket2(this.sportId);
        }
        this.getTodayGameslist(this.sportId)
        localStorage.setItem('selectedEventId', this.eventId)
        if (this.sportId == 2 || this.sportId == 1) {
          this.showFancy = false
          this.hideFancyForST = false
          this.toggleFancy = false
        } else if (this.sportId == 4) {
          this.toggleFancy = true
          this.showFancy = true
          this.hideFancyForST = true
        }

        if (token) {
          this.dataServe.getEventDataOnLoadnew(this.eventId).subscribe((res: any) => {
            this.eventData = res;
            this.urlSafe = this.getScore(this.eventData?.scoreBase, this.eventId);
            this.url2 = res.tvurl;
            localStorage.setItem('tvurl', this.url2)

            if (this.eventData.gameType == 'virtual1') {
              this.showTabs = 'scrd';
            } else {
              this.showTabs = 'tv';
            }

            if (this.url2) {
            } else {
              this.authServe.logout();
            }

            this.oddspermission = this.eventData?.isAutoOdds;
            this.bmpermission = this.eventData?.isBookmakerOdds;
            this.fancypermission = this.eventData?.isAutoFancy;
            this.otherpermission = this.eventData?.isOther;

            if (this.eventData?.gameType == 'virtual1' || this.sportId == 2 || this.sportId == 1) {
              this.fancypermission = false;
              this.fBets(1)
            }

            this.tosscheck = this.hideTossbefor2HrFun(this.eventData);
            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            this.intervalIdTime = setInterval(() => {
            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            }, 10000);
            this.matchrunners = this.eventData.selectionIdName.split(',');
            this.matchrunnerssid = this.eventData.selectionId.split(',');

            document.addEventListener('visibilitychange', () => {
              if (!document.hidden) {
                this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
              }
            });
            window.addEventListener('focus', () => {
              this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            });

            this.checkLimits = res.limits;

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonOddsLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.oddMin = this.checkLimits?.commonOddsLimit?.minLimit;
                this.oddMax = this.checkLimits?.commonOddsLimit?.maxLimit;
              } else {
                this.oddMin = this.checkLimits?.commonOddsLimit?.preminLimit;
                this.oddMax = this.checkLimits?.commonOddsLimit?.premaxLimit;
              }
            }

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.bmMin = this.checkLimits?.commonBookmakerLimit?.minLimit;
                this.bmMax = this.checkLimits?.commonBookmakerLimit?.maxLimit;
              } else {
                this.bmMin = this.checkLimits?.commonBookmakerLimit?.preminLimit;
                this.bmMax = this.checkLimits?.commonBookmakerLimit?.premaxLimit;
              }
            }

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.fancyMin = this.checkLimits?.commonFancyLimit?.minLimit;
                this.fancyMax = this.checkLimits?.commonFancyLimit?.maxLimit;
                this.tossMin = this.checkLimits?.commonFancyLimit?.minLimit;
                this.tossMax = this.checkLimits?.commonFancyLimit?.maxLimit;
              } else {
                this.fancyMin = this.checkLimits?.commonFancyLimit?.preminLimit;
                this.fancyMax = this.checkLimits?.commonFancyLimit?.premaxLimit;
                this.tossMin = this.checkLimits?.commonFancyLimit?.preminLimit;
                this.tossMax = this.checkLimits?.commonFancyLimit?.premaxLimit;
              }
            }

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonOtherLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.otherMin = this.checkLimits?.commonOtherLimit?.minLimit;
                this.otherMax = this.checkLimits?.commonOtherLimit?.maxLimit;
              } else {
                this.otherMin = this.checkLimits?.commonOtherLimit?.preminLimit;
                this.otherMax = this.checkLimits?.commonOtherLimit?.premaxLimit;
              }
            }

            this.preMatchMarket = JSON.parse(this.eventData.preMatchMarket).map((market: any) => {
              if (market.name) {
                market.pSelection = JSON.parse(market.pSelection);
              }
              return market;
            });

            //Toss Code Start
            if (this.tosscheck == true) {
              this.socket.setToss(this.eventId);
              this.socket.getToss(this.eventId);
              this.oddsub3 = this.socket.getUpdate3MessageListner().subscribe((res: any) => {
                this.tosssocketdata = res.message3;

                if (this.tosssocketdata.data.status === 'OPEN') {
                  this.showhidetoss = true;
                } else {
                  this.showhidetoss = false;
                }

                if (this.checkLimits == 'NONE') {
                  this.tossMin = res?.message3?.events?.markets[0]?.limit[0]?.preMinStake;
                  this.tossMax = res?.message3?.events?.markets[0]?.limit[0]?.preMaxStake;
                } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Provider') {
                  this.tossMin = res?.message3?.events?.markets[0]?.limit[0]?.preMinStake;
                  this.tossMax = res?.message3?.events?.markets[0]?.limit[0]?.preMaxStake;
                } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Central') {
                  this.tossMin = res?.message3?.events?.markets[0]?.limit[0]?.preMinStake;
                  this.tossMax = res?.message3?.events?.markets[0]?.limit[0]?.preMaxStake;
                }
              })
            }
            //Toss Code End

            this.loading = false;
          })
        } else {
          this.dataServe.getEventDataOnLoad(this.eventId).subscribe((res: any) => {
            this.eventData = res;
            this.urlSafe = this.getScore(this.eventData?.scoreBase, this.eventId);

            this.oddspermission = this.eventData?.isAutoOdds;
            this.bmpermission = this.eventData?.isBookmakerOdds;
            this.fancypermission = this.eventData?.isAutoFancy;
            this.otherpermission = this.eventData?.isOther;

            if (this.eventData?.gameType == 'virtual1' || this.sportId == 2 || this.sportId == 1) {
              this.fancypermission = false;
              this.fBets(1)
            }

            this.tosscheck = this.hideTossbefor2HrFun(this.eventData);
            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            this.intervalIdTime = setInterval(() => {
            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            }, 10000);
            this.matchrunners = this.eventData.selectionIdName.split(',');
            this.matchrunnerssid = this.eventData.selectionId.split(',');

            document.addEventListener('visibilitychange', () => {
              if (!document.hidden) {
                this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
              }
            });
            window.addEventListener('focus', () => {
              this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            });

            this.checkLimits = res.limits;

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonOddsLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.oddMin = this.checkLimits?.commonOddsLimit?.minLimit;
                this.oddMax = this.checkLimits?.commonOddsLimit?.maxLimit;
              } else {
                this.oddMin = this.checkLimits?.commonOddsLimit?.preminLimit;
                this.oddMax = this.checkLimits?.commonOddsLimit?.premaxLimit;
              }
            }

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.bmMin = this.checkLimits?.commonBookmakerLimit?.minLimit;
                this.bmMax = this.checkLimits?.commonBookmakerLimit?.maxLimit;
              } else {
                this.bmMin = this.checkLimits?.commonBookmakerLimit?.preminLimit;
                this.bmMax = this.checkLimits?.commonBookmakerLimit?.premaxLimit;
              }
            }

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.fancyMin = this.checkLimits?.commonFancyLimit?.minLimit;
                this.fancyMax = this.checkLimits?.commonFancyLimit?.maxLimit;
                this.tossMin = this.checkLimits?.commonFancyLimit?.minLimit;
                this.tossMax = this.checkLimits?.commonFancyLimit?.maxLimit;
              } else {
                this.fancyMin = this.checkLimits?.commonFancyLimit?.preminLimit;
                this.fancyMax = this.checkLimits?.commonFancyLimit?.premaxLimit;
                this.tossMin = this.checkLimits?.commonFancyLimit?.preminLimit;
                this.tossMax = this.checkLimits?.commonFancyLimit?.premaxLimit;
              }
            }

            if (this.checkLimits != 'NONE' && this.checkLimits?.commonOtherLimit?.limitProvider == 'Website') {
              if (this.inplaystatus) {
                this.otherMin = this.checkLimits?.commonOtherLimit?.minLimit;
                this.otherMax = this.checkLimits?.commonOtherLimit?.maxLimit;
              } else {
                this.otherMin = this.checkLimits?.commonOtherLimit?.preminLimit;
                this.otherMax = this.checkLimits?.commonOtherLimit?.premaxLimit;
              }
            }

            this.preMatchMarket = JSON.parse(this.eventData.preMatchMarket).map((market: any) => {
              if (market.name) {
                market.pSelection = JSON.parse(market.pSelection);
              }
              return market;
            });

            //Toss Code Start
            if (this.tosscheck == true) {
              this.socket.setToss(this.eventId);
              this.socket.getToss(this.eventId);
              this.oddsub3 = this.socket.getUpdate3MessageListner().subscribe((res: any) => {
                this.tosssocketdata = res.message3;
                if (this.tosssocketdata.data.status === 'OPEN') {
                  this.showhidetoss = true;
                } else {
                  this.showhidetoss = false;
                }

                if (this.checkLimits == 'NONE') {
                  this.tossMin = res?.message3?.events?.markets[0]?.limit[0]?.preMinStake;
                  this.tossMax = res?.message3?.events?.markets[0]?.limit[0]?.preMaxStake;
                } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Provider') {
                  this.tossMin = res?.message3?.events?.markets[0]?.limit[0]?.preMinStake;
                  this.tossMax = res?.message3?.events?.markets[0]?.limit[0]?.preMaxStake;
                } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Central') {
                  this.tossMin = res?.message3?.events?.markets[0]?.limit[0]?.preMinStake;
                  this.tossMax = res?.message3?.events?.markets[0]?.limit[0]?.preMaxStake;
                }
              })
            }
            //Toss Code End

            this.loading = false;
          })
        }

        if (token) {
          let type = 'Match odds';
          this.dataServe.getUserMatchBookData(this.eventId, type).subscribe((res: any) => {
            if (res) {
              this.betOddResult = res;
              this.oddsPnlArray = [res.pnl1, res.pnl2, res.pnl3];
              this.bmPnlArray = [res.bmPnl1, res.bmPnl2, res.bmPnl3];
            } else {
              this.getMatcBkData = false;
              this.oddsPnlArray = [0, 0, 0];
              this.bmPnlArray = [0, 0, 0];
            }
          })

          let type1 = 'Toss';
          this.showBackSelectToss = null;
          this.dataServe.getUserMatchBookData(this.eventId, type1).subscribe((res: any) => {
            if (res) {
              this.getTossBkData = true;
              this.tossPnlArray = [res.pnl1, res.pnl2, res.pnl3];
            } else {
              this.getTossBkData = false;
              this.tossPnlArray = [0, 0, 0];
            }
          });

          this.dataServe.getUserFancyBookData(this.eventId).subscribe((res: any) => {
            this.fancyLiability = res
            this.fancyLiab = res?.liability;
          })

          this.dataServe.getPremiumFancyBook(this.eventId).subscribe((res: any) => {
            this.PremiumfancyLiability = res
          })

          let type2 = 'Other';
          this.dataServe.getUserMatchBookData(this.eventId, type2).subscribe((res: any) => {
            if (res) {
              this.omPnlArray = res;
            } else {
              this.omPnlArray = [];
            }
          })
        }

        this.dataServe.getEventDataOnLoad2(this.eventId).subscribe((res: any) => {
          this.eventData2 = res;
          if (this.eventData2 && this.eventData2 !== 'OK') {
            // code for odds start
            if (this.eventData2.oddsProvider === 'Tiger') {
              this.totalMatched = res.odds?.[0]?.totalMatched;
              this.runnersList = res.odds[0].runners;
            }
            else if (this.eventData2.oddsProvider === 'Neeraj') {
              this.totalMatched = res.odds?.[0]?.totalMatched;
              this.runnersList = res.odds[0].runners;
            }
            // code for odds End

            // code for bookmaker Start
            if (this.eventData2.bmProvider === 'Diamond') {
              let runnersd = (((this.eventData2.bookMaker).map((d: any) => (d.bm1))).flat()).filter((rd: any) => {
                if (rd?.mname == this.eventData?.bookheader) {
                  return rd;
                }
              });

              let bm = runnersd.map((dt: any) => ({
                ...dt,
                ordering: this.eventData?.bookt1 == dt.nat ? '1' : this.eventData?.bookt2 == dt.nat ? '2' : this.eventData?.bookt3 == dt.nat ? '3' : '',
                status: dt.s == 'SUSPENDED' ? 'Suspended' : dt.s == 'ACTIVE' ? 'Active' : dt.s,
                backOddsInfo: [dt.b1, dt.b2, dt.b3],
                layOddsInfo: [dt.l1, dt.l2, dt.l3]
              })
              );

              bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))
              this.runnersList2 = { bookmaker: bm, events: this.eventData };
            }
            else if (this.eventData2.bmProvider === 'Sky') {
              let bm = this.eventData2.bookMaker[0]?.map((dt: any) => ({
                ...dt,
                ordering: this.eventData?.bookt1 == dt.runnerName ? '1' : this.eventData?.bookt2 == dt.runnerName ? '2' : this.eventData?.bookt3 == dt.runnerName ? '3' : '',
                status: dt.status == '2' ? 'Suspended' : dt.status == '1' ? 'Active' : dt.status,
                backOddsInfo: JSON.parse(dt.backOddsInfo).map(Number),
                layOddsInfo: JSON.parse(dt.layOddsInfo).map(Number)
              }));

              bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

              this.runnersList2 = { bookmaker: bm, events: this.eventData };
            } else if (this.eventData2.bmProvider === 'World') {
              let runnersdw = (this.eventData2.bookMaker).filter((rd: any) => {
                if (rd?.mname == this.eventData?.bookheader) {
                  return rd;
                }
              });

              let bm = runnersdw?.[0]?.section.map((dt: any) => ({
                ...dt,
                ordering: this.eventData?.bookt1 == dt.nat ? '1' : this.eventData?.bookt2 == dt.nat ? '2' : this.eventData?.bookt3 == dt.nat ? '3' : '',
                status: dt.gstatus == 'SUSPENDED' ? 'Suspended' : dt.gstatus == 'ACTIVE' ? 'Active' : dt.gstatus,
                backOddsInfo: dt.odds.filter((o: any) => o.otype == 'back').reverse().map((m: any) => m.odds),
                layOddsInfo: dt.odds.filter((o: any) => o.otype == 'lay').map((m: any) => m.odds)
              }));

              bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

              this.runnersList2 = { bookmaker: bm, events: this.eventData };
            }
            // code for bookmaker End
          }
        })

        // Odds Code Start
        this.socket.setOdds(this.eventId);
        this.socket.getOdds(this.eventId);

        this.oddsub = this.socket.getUpdateMessageListner().subscribe((res: any) => {
          if(res.message.banglaTV!=''){
            this.tvchannel = res.message.pm3u8+res.message.banglaTV;
          }
          if (res.message['data'].length > 0) {

            if (res.message.Type === 'Tiger') {
              this.totalMatched = res.message['data'][0]?.totalMatched;
              this.runnersList = res.message['data'][0].runners;
              this.socketEventOdds = res.message.events;

              if (this.checkLimits == 'NONE' || this.checkLimits?.commonOddsLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  this.oddMin = res.message.events?.markets[0].limit[0].minStake;
                  this.oddMax = res.message.events?.markets[0].limit[0].maxStake;
                } else {
                  this.oddMin = res.message.events?.markets[0].limit[0].preMinStake;
                  this.oddMax = res.message.events?.markets[0].limit[0].preMaxStake;
                }
              }

              if (this.checkLimits == 'NONE' || this.checkLimits?.commonOtherLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  this.otherMin = res.message.events?.markets[0].limit[0].minStake;
                  this.otherMax = res.message.events?.markets[0].limit[0].maxStake;
                } else {
                  this.otherMin = res.message.events?.markets[0].limit[0].preMinStake;
                  this.otherMax = res.message.events?.markets[0].limit[0].preMaxStake;
                }
              }
            }
            else if (res.message.Type === 'Neeraj') {
              this.totalMatched = res.message['data'][0]?.totalMatched;
              this.runnersList = res.message['data'][0].runners;
              this.socketEventOdds = res.message.events;

              if (this.checkLimits == 'NONE' || this.checkLimits?.commonOddsLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  this.oddMin = res.message.events?.markets[0].limit[0].minStake;
                  this.oddMax = res.message.events?.markets[0].limit[0].maxStake;
                } else {
                  this.oddMin = res.message.events?.markets[0].limit[0].preMinStake;
                  this.oddMax = res.message.events?.markets[0].limit[0].preMaxStake;
                }
              }

              if (this.checkLimits == 'NONE' || this.checkLimits?.commonOtherLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  this.otherMin = res.message.events?.markets[0].limit[0].minStake;
                  this.otherMax = res.message.events?.markets[0].limit[0].maxStake;
                } else {
                  this.otherMin = res.message.events?.markets[0].limit[0].preMinStake;
                  this.otherMax = res.message.events?.markets[0].limit[0].preMaxStake;
                }
              }
            }

          }
        })
        // Odds Code End

        //BookMaker Code Start
        this.socket.setBookMaker(this.eventId);
        this.socket.getBookMaker(this.eventId);

        this.oddsub2 = this.socket.getUpdate2MessageListner().subscribe((res: any) => {
          if (res.message2.Type === 'Diamond') {
            let runnersd = (((res.message2['data']).map((d: any) => (d.bm1))).flat()).filter((rd: any) => {
              if (rd?.mname == this.eventData?.bookheader) {
                return rd;
              }
            });

            let bm = runnersd.map((dt: any) => ({
              ...dt,
              ordering: this.eventData?.bookt1 == dt.nat ? '1' : this.eventData?.bookt2 == dt.nat ? '2' : this.eventData?.bookt3 == dt.nat ? '3' : '',
              status: dt.s == 'SUSPENDED' ? 'Suspended' : dt.s == 'ACTIVE' ? 'Active' : dt.s,
              backOddsInfo: [dt.b1, dt.b2, dt.b3],
              layOddsInfo: [dt.l1, dt.l2, dt.l3]
            })
            );

            bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

            this.AllLimits = res.message2.data?.[0];

            if (this.checkLimits == 'NONE') {
              this.bmMin = this.AllLimits?.min / 100;
              this.bmMax = this.AllLimits?.max / 100;
            } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Provider') {
              this.bmMin = this.AllLimits?.min / 100;
              this.bmMax = this.AllLimits?.max / 100;
            } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Central') {
              if (this.inplaystatus) {
                this.bmMin = res.message2['events']?.markets[0].limit[0].minStake;
                this.bmMax = res.message2['events']?.markets[0].limit[0].maxStake;
              } else {
                this.bmMin = res.message2['events']?.markets[0].limit[0].preMinStake;
                this.bmMax = res.message2['events']?.markets[0].limit[0].preMaxStake;
              }
            }

            this.runnersList2 = { bookmaker: bm, events: res.message2['events'], Limits: this.AllLimits, min: this.bmMin, max: this.bmMax };
          }
          else if (res.message2.Type === 'Sky') {
            if (res.message2['data'][0]?.length > 0) {
              let bm = res.message2['data'][0].map((dt: any) => ({
                ...dt,
                ordering: this.eventData?.bookt1 == dt.runnerName ? '1' : this.eventData?.bookt2 == dt.runnerName ? '2' : this.eventData?.bookt3 == dt.runnerName ? '3' : '',
                status: dt.status == '2' ? 'Suspended' : dt.status == '1' ? 'Active' : dt.status,
                backOddsInfo: JSON.parse(dt.backOddsInfo).map(Number),
                layOddsInfo: JSON.parse(dt.layOddsInfo).map(Number)
              }));

              bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

              this.AllLimits = res.message2.details?.[0];

              if (this.checkLimits == 'NONE') {
                this.bmMin = this.AllLimits?.min / 100;
                this.bmMax = this.AllLimits?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Provider') {
                this.bmMin = this.AllLimits?.min / 100;
                this.bmMax = this.AllLimits?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  this.bmMin = res.message2['events']?.markets[0].limit[0].minStake;
                  this.bmMax = res.message2['events']?.markets[0].limit[0].maxStake;
                } else {
                  this.bmMin = res.message2['events']?.markets[0].limit[0].preMinStake;
                  this.bmMax = res.message2['events']?.markets[0].limit[0].preMaxStake;
                }
              }

              this.runnersList2 = { bookmaker: bm, events: res.message2['events'], Limits: this.AllLimits, min: this.bmMin, max: this.bmMax };
            }
          }
          else if (res.message2.Type === 'World') {
            let runnersdw = (res.message2['data']).filter((rd: any) => {
              if (rd?.mname == this.eventData?.bookheader) {
                return rd;
              }
            });

            let bm = runnersdw[0]?.section.map((dt: any) => ({
              ...dt,
              ordering: this.eventData?.bookt1 == dt.nat ? '1' : this.eventData?.bookt2 == dt.nat ? '2' : this.eventData?.bookt3 == dt.nat ? '3' : '',
              status: dt.gstatus == 'SUSPENDED' ? 'Suspended' : dt.gstatus == 'ACTIVE' ? 'Active' : dt.gstatus,
              backOddsInfo: dt.odds.filter((o: any) => o.otype == 'back').reverse().map((m: any) => m.odds),
              layOddsInfo: dt.odds.filter((o: any) => o.otype == 'lay').map((m: any) => m.odds)
            }));

            bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

            this.AllLimits = res.message2.data?.[0];

            if (this.checkLimits == 'NONE') {
              this.bmMin = this.AllLimits?.min / 100;
              this.bmMax = this.AllLimits?.max / 100;
            } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Provider') {
              this.bmMin = this.AllLimits?.min / 100;
              this.bmMax = this.AllLimits?.max / 100;
            } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Central') {
              if (this.inplaystatus) {
                this.bmMin = res.message2['events']?.markets[0].limit[0].minStake;
                this.bmMax = res.message2['events']?.markets[0].limit[0].maxStake;
              } else {
                this.bmMin = res.message2['events']?.markets[0].limit[0].preMinStake;
                this.bmMax = res.message2['events']?.markets[0].limit[0].preMaxStake;
              }
            }

            this.runnersList2 = { bookmaker: bm, events: res.message2['events'], Limits: this.AllLimits, min: this.bmMin, max: this.bmMax };

          } else if (res.message2.Type === 'Tiger') {
            let runnersdw = (res.message2.data).filter((rd: any) => {
              if (rd.data.name == this.eventData?.bookheader.toUpperCase()) {
                return rd;
              }
            });

            let newrunnersdw = JSON.parse(runnersdw[0].data.runners)

            let bm = Object.values(newrunnersdw || {}).map((dt: any) => ({
              ...dt,
              ordering: this.eventData?.bookt1 === dt.name ? '1' : this.eventData?.bookt2 === dt.name ? '2' : this.eventData?.bookt3 === dt.name ? '3' : '',
              status: runnersdw[0].data.status !== 'OPEN' ? 'Suspended' : runnersdw[0].data.is_active !== '1' ? 'Suspended' : dt.status === 'ACTIVE' ? 'Active' : dt.status,
              backOddsInfo: [dt.back_price, dt.back_1_price, dt.back_2_price],
              layOddsInfo: [dt.lay_price, dt.lay_1_price, dt.lay_2_price]
            }));

            bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

            this.AllLimits = res.message2.data?.[0];

            if (this.checkLimits == 'NONE') {
              this.bmMin = this.AllLimits?.min / 100;
              this.bmMax = this.AllLimits?.max / 100;
            } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Provider') {
              this.bmMin = this.AllLimits?.min / 100;
              this.bmMax = this.AllLimits?.max / 100;
            } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonBookmakerLimit?.limitProvider == 'Central') {
              if (this.inplaystatus) {
                this.bmMin = res.message2['events']?.markets[0].limit[0].minStake;
                this.bmMax = res.message2['events']?.markets[0].limit[0].maxStake;
              } else {
                this.bmMin = res.message2['events']?.markets[0].limit[0].preMinStake;
                this.bmMax = res.message2['events']?.markets[0].limit[0].preMaxStake;
              }
            }

            this.runnersList2 = { bookmaker: bm, events: res.message2['events'], Limits: this.AllLimits, min: this.bmMin, max: this.bmMax };
          }
        });
        //BookMaker Code End


        //Fancy Code Start
        this.socket.setFancy(this.eventId);
        this.socket.getFancy(this.eventId);

        this.oddsub4 = this.socket.getUpdateFancyListner().subscribe((res: any) => {
          this.fancyEventData = res.message4;

          if (res.message4.Type1 == 'Diamond') {
            let fancydatas = res.message4.diamond;
            if (fancydatas?.length < 1) {
              this.fancypermission = false;
              this.fBets(1);
            }
            this.fancyEventData = fancydatas.map((dt: any) => {
              let fancyMin = 0;
              let fancyMax = 0;
              if (this.checkLimits == 'NONE') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Provider') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.minStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.maxStake;
                } else {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.preMinStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.preMaxStake;
                }
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Website') {
                fancyMin = this.fancyMin;
                fancyMax = this.fancyMax;
              }

              return {
                ...dt,
                fancyMin: fancyMin,
                fancyMax: fancyMax
              };
            });

            if (this.fancyDataList.length < 1) {
              this.showFancy = false;
            }

            this.normalfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '1')
                return re.ballsess
            })

            this.fancy1 = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'fancy1')
                return re.gtype
            })

            this.overfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '2')
                return re.ballsess
            })

            this.bbbfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '3')
                return re.ballsess
            })

            this.khaddafancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'khadda')
                return re.gtype
            })

            this.lotteryfancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'lottery')
                return re.gtype
            })

            this.oddevenfancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'oddeven')
                return re.gtype
            })

          } else if (res.message4.Type1 == 'Sky') {
            let fancydatas = res.message4.sky;
            if (fancydatas?.length < 1) {
              this.fancypermission = false;
              this.fBets(1);
            }

            this.fancyDataList = fancydatas.map((dt: any) => {
              let fancyMin = 0;
              let fancyMax = 0;
              if (this.checkLimits == 'NONE') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Provider') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.minStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.maxStake;
                } else {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.preMinStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.preMaxStake;
                }
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Website') {
                fancyMin = this.fancyMin;
                fancyMax = this.fancyMax;
              }

              return {
                ...dt,
                gstatus: dt.status == '2' ? 'Active' : 'SUSPENDED',
                nat: dt.marketName,
                bs1: dt.oddsYes,
                b1: dt.runsYes,
                ls1: dt.oddsNo,
                l1: dt.runsNo,
                sid: dt.marketId,
                selectionId: dt.eventId + "-" + dt.marketId + ".FY",
                fancyMin: fancyMin,
                fancyMax: fancyMax
              };
            });

            if (this.fancyDataList.length < 1) {
              this.showFancy = false;
            }

            this.normalfancy = this.fancyDataList.filter((re: any) => {
              if (re.marketType == '1' || re.marketType == '2')
                return re.marketType
            })

            this.fancy1 = this.fancyDataList.filter((re: any) => {
              if (re.marketType == 'fancy1')
                return re.marketType
            })

            this.overfancy = this.fancyDataList.filter((re: any) => {
              if (re.marketType == '3')
                return re.marketType
            })

            this.bbbfancy = this.fancyDataList.filter((re: any) => {
              if (re.marketType == '8')
                return re.marketType
            })

            this.khaddafancy = this.fancyDataList.filter((re: any) => {
              if (re.marketType == '4')
                return re.marketType
            })

            this.lotteryfancy = this.fancyDataList.filter((re: any) => {
              if (re.marketType == '5')
                return re.marketType
            })

            this.oddevenfancy = this.fancyDataList.filter((re: any) => {
              if (re.marketType == '6')
                return re.marketType
            })

          } else if (res.message4.Type1 == 'World') {
            let fancydatas = res.message4.world;
            if (fancydatas?.length < 1) {
              this.fancypermission = false;
              this.fBets(1);
            }

            this.fancyDataList = fancydatas.map((dt: any) => {
              let fancyMin = 0;
              let fancyMax = 0;
              if (this.checkLimits == 'NONE') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Provider') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.minStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.maxStake;
                } else {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.preMinStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.preMaxStake;
                }
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Website') {
                fancyMin = this.fancyMin;
                fancyMax = this.fancyMax;
              }

              return {
                ...dt,
                gstatus: dt.gstatus == 'SUSPENDED' ? 'SUSPENDED' : dt.gstatus == 'ACTIVE' ? 'Active' : dt.gstatus,
                b1: dt.odds.filter((o: any) => o.oname == 'back1').map((m: any) => m.odds)[0] || 0,
                bs1: dt.odds.filter((o: any) => o.oname == 'back1').map((m: any) => m.size)[0] || 0,
                l1: dt.odds.filter((o: any) => o.oname == 'lay1').map((m: any) => m.odds)[0] || 0,
                ls1: dt.odds.filter((o: any) => o.oname == 'lay1').map((m: any) => m.size)[0] || 0,
                gtype: 'Fancy',
                ballsess: '1',
                fancyMin: fancyMin,
                fancyMax: fancyMax
              };
            });

            if (this.fancyDataList.length < 1) {
              this.showFancy = false;
            }

            this.normalfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '1')
                return re.ballsess
            })

            this.fancy1 = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'fancy1')
                return re.gtype
            })

            this.overfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '2')
                return re.ballsess
            })

            this.bbbfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '3')
                return re.ballsess
            })

            this.khaddafancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'khadda')
                return re.gtype
            })

            this.lotteryfancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'lottery')
                return re.gtype
            })

            this.oddevenfancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'oddeven')
                return re.gtype
            })

          } else if (res.message4.Type1 == 'Tiger') {
            let fancydatas = res.message4.tiger;
            if (fancydatas?.length < 1) {
              this.fancypermission = false;
              this.fBets(1);
            }
            this.fancyDataList = fancydatas.map((dt: any) => {
              let fancyMin = 0;
              let fancyMax = 0;
              if (this.checkLimits == 'NONE') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Provider') {
                fancyMin = dt?.min / 100;
                fancyMax = dt?.max / 100;
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Central') {
                if (this.inplaystatus) {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.minStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.maxStake;
                } else {
                  fancyMin = res?.message4?.events?.markets[0]?.limit[0]?.preMinStake;
                  fancyMax = res?.message4?.events?.markets[0]?.limit[0]?.preMaxStake;
                }
              } else if (this.checkLimits != 'NONE' && this.checkLimits?.commonFancyLimit?.limitProvider == 'Website') {
                fancyMin = this.fancyMin;
                fancyMax = this.fancyMax;
              }

              return {
                ...dt,
                gstatus: (dt.status1 !== 'ACTIVE' || dt.is_active !== '1') ? 'SUSPENDED' : 'Active',
                nat: dt.name,
                sid: dt.marketId,
                b1: dt.b1 || 0,
                bs1: dt.bs1 || 0,
                l1: dt.l1 || 0,
                ls1: dt.ls1 || 0,
                gtype: 'Fancy',
                ballsess: '1',
                fancyMin: fancyMin,
                fancyMax: fancyMax
              };
            });

            if (this.fancyDataList.length < 1) {
              this.showFancy = false;
            }

            this.normalfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '1')
                return re.ballsess
            })

            this.fancy1 = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'fancy1')
                return re.gtype
            })

            this.overfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '2')
                return re.ballsess
            })

            this.bbbfancy = this.fancyDataList.filter((re: any) => {
              if (re.ballsess == '3')
                return re.ballsess
            })

            this.khaddafancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'khadda')
                return re.gtype
            })

            this.lotteryfancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'lottery')
                return re.gtype
            })

            this.oddevenfancy = this.fancyDataList.filter((re: any) => {
              if (re.gtype == 'oddeven')
                return re.gtype
            })

          }
        })
        //Fancy Code End

        //Primium Fancy Code Start
        this.socket.setPremiumFancy(this.eventId);
        this.socket.getPremiumFancy(this.eventId);

        this.oddsub5 = this.socket.getUpdatePRMFancyListner().subscribe((res: any) => {
          this.PFancyAllData = res.message5;
          if (res.message5.Type == 'Premium') {
            this.PFancyData = res.message5.data.sportsBookMarket;
          }
        })
        //Primium Fancy Code End

        // MOdds Code Start
        this.socket.setmOdds(this.eventId);
        this.socket.getmOdds(this.eventId);

        this.oddsub6 = this.socket.getUpdateMessageM1Listner().subscribe((res: any) => {
          if (res.m1message['data'].length > 0) {
            if (res.m1message.Type === 'Tiger') {
              this.MOddsAllData = res.m1message;
              this.MOddsDataOther = res.m1message.data;
            }
          }
        })
        // MOdds Code End

      }

    })

    setTimeout(() => {
      this.startPlayer(this.tvchannel)
    }, 3000)
    setTimeout(() => {
      const dataElement = this.el.nativeElement.querySelectorAll('.spark-back');
      dataElement.forEach((element: HTMLElement, index: number) => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              this.renderer.addClass(element.parentElement, 'animate-spark-back');
              setTimeout(() => {
                this.renderer.removeClass(element.parentElement, 'animate-spark-back');
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
    setTimeout(() => {
      const dataElement = this.el.nativeElement.querySelectorAll('.spark-lay');
      dataElement.forEach((element: HTMLElement, index: number) => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
              this.renderer.addClass(element.parentElement, 'animate-spark-lay');
              setTimeout(() => {
                this.renderer.removeClass(element.parentElement, 'animate-spark-lay');
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

  ngAfterViewInit() {
    window.addEventListener('message', (event: MessageEvent) => {
    let height = null;
    try {
      const data = typeof event.data === 'string'
        ? JSON.parse(event.data)
        : event.data;
      height = data?.height || data?.bodyHeight;
    } catch (e) {}
    if (typeof event.data === 'number') {
      height = event.data;
    }
    if (height && this.iframeRef) {
      this.iframeRef.nativeElement.style.height = height + 'px';
    }
  });
}

  startPlayer(tvchannel: any) {
    const video = document.getElementById('videoPlayer') as HTMLVideoElement;
    const loadingImage = document.getElementById('loadingImage') as HTMLElement;

    const muteBtn = document.getElementById('muteBtn');
    const unMuteBtn = document.getElementById('unMuteBtn');
    const controls = document.getElementById('customControls');

    const streamUrl = `${tvchannel}/tracks-v1a1/mono.m3u8?ts=${Date.now()}`;

    if (!video || !Hls.isSupported()) return;

    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    this.hls = new Hls({
      liveSyncDuration: 3,
      liveMaxLatencyDuration: 5,
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 0
    });

    this.hls.loadSource(streamUrl);
    this.hls.attachMedia(video);

    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.muted = true;
      video.currentTime = 0;
      video.play().catch(() => { });
    });

    video.onplaying = () => {
      if (loadingImage) loadingImage.style.display = 'none';
      if (controls) controls.style.display = 'flex';
    };

    // muteBtn?.addEventListener('click', () => video.muted = true);
    // unMuteBtn?.addEventListener('click', () => {
    //   video.muted = false;
    //   video.volume = 1;
    // });

    this.fullScreenHandler = () => {
      if (document.fullscreenElement) document.exitFullscreen();
    };

    document.addEventListener('fullscreenchange', this.fullScreenHandler);

    // setTimeout(() => {
    //   this.playtv=false;
    // }, 5000)
  }
  showHideIcon() {
    this.playtv = !this.playtv;
  }
   // Simple mute function
  muteVideo(): void {
    const video = document.getElementById('videoPlayer') as HTMLVideoElement;
    if (video) {
      video.muted = true;
    }
  }

  // Simple unmute function
  unmuteVideo(): void {
    const video = document.getElementById('videoPlayer') as HTMLVideoElement;
    if (video) {
      video.muted = false;
      video.volume = 1;
    }
  }
  private fullScreenHandler!: () => void;

  getLinkStyles(isActive: boolean): { [key: string]: any } {
    if (isActive) {
      return {
        'background-image': this.jsonWebdt?.imagesBottomBorderColor,
      };
    } else {
      return {
        'background-color': 'transparent'
      }
    }
  }
  getactiveColor(isActive: boolean): { [key: string]: any } {
    if (isActive) {
      return {
        // 'background-image' : this.jsonWebdt?.imagesBottomBorderColor,
        'color': this.jsonWebdt?.imagesPlayNowTextColor
        //  'color' : 'yellow'

      };
    } else {
      return {
        'color': '#ffc800'
      }
    }
  }
  closeWiddgett() {
    this.showWidget = false;
  }
  openBetSlip(dt: any) {
    this.openBetComp = true;
  }
  closeBetComp(dt: any) {
    this.openBetComp = dt;
  }
  openfnacyBook(data: any) {
    this.bookList = [];
    this.pnlList = [];
    this.dataServe.getListBookData(data).subscribe((res: any) => {
      this.fancybookdata = res;

      var length = this.fancybookdata.length;

      for (var i = 0; i < length; i++) {
        if (!this.bookList.includes(this.fancybookdata[i].runs - 1)) {
          this.bookList.push(this.fancybookdata[i].runs - 1);
          this.pnlList.push(0.00);
        }
        if (!this.bookList.includes(this.fancybookdata[i].runs)) {
          this.bookList.push(this.fancybookdata[i].runs);
          this.pnlList.push(0.00);
        }
        if (!this.bookList.includes(this.fancybookdata[i].runs + 1)) {
          this.bookList.push(this.fancybookdata[i].runs + 1);
          this.pnlList.push(0.00);
        }
      }

      for (var i = 0; i < this.bookList.length; i++) {
        for (var j = 0; j < length; j++) {
          if (this.bookList[i] < this.fancybookdata[j].runs) {
            this.pnlList[i] = this.pnlList[i] + this.fancybookdata[j].belowBook
          } else {
            this.pnlList[i] = this.pnlList[i] + this.fancybookdata[j].equalGreaterBook
          }
        }
      }
    })
    this.openFanBook = true
  }
  closeFancyBook() {
    this.openFanBook = false
  }
  trackByFn(index: number, item: any): any {
    return index;
  }

  getTodayGameslist(sportId: any) {
    this.dataServe.getTodayGames().subscribe((res: any) => {
      this.gameList = res.filter((res: any) => res.sportid == sportId);
      this.showWidget = true;
    })
  }
  ombookfilter(data: any) {
    let omddt = this.omPnlArray.filter((dt: any) => { if (dt.sourceName == data) { return dt; } });
    if (omddt[0]) {
      this.getMatchODData = true;
      this.omPnlArrayData = [omddt[0].pnl1, omddt[0].pnl2, omddt[0].pnl3];
    } else {
      this.getMatchODData = false;
      this.omPnlArrayData = [0, 0, 0];
    }
  }

  displayFancy(data: any) {
    this.activeTab = data
    if (data == 0) {
      this.fan1 = true
      this.normalFan = true
      this.overFan = true
      this.bbbFan = true
      this.khaddaFan = true
      this.lotteryFan = true
      this.oddevenFan = true
      this.fancyselectedTab = 'all';
    } else if (data == 1) {
      this.fan1 = false
      this.normalFan = true
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'normal';
    } else if (data == 2) {
      this.fan1 = true
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'fancy1';
    } else if (data == 3) {
      this.fan1 = false
      this.normalFan = false
      this.overFan = true
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'over';
    } else if (data == 4) {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = true
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'bbb';
    } else if (data == 5) {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = true
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'khadda';
    } else if (data == 6) {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = true
      this.oddevenFan = false
      this.fancyselectedTab = 'lottery';
    } else if (data == 7) {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = true
      this.fancyselectedTab = 'oddeven';
    }
    this.updateIndicatorPosition();
  }

  matchTabs(name: string): void {
    this.TopMenuselectedItem = name;
  }

   getScore(socreUrl : any, data: any) {
    let random = Math.floor(1000 + Math.random() * 9000);
    return this.sanitizer.bypassSecurityTrustResourceUrl(socreUrl+data+'?v='+random)
  }

  ngOnDestroy() {
    this.socket.destorySocket(this.eventId);
    if (this.oddsub) {
      this.oddsub.unsubscribe();
    }
    if (this.intervalIdTime) {
      clearInterval(this.intervalIdTime);
    }
    if (this.oddsub2) {
      this.oddsub2.unsubscribe();
    }
    if (this.oddsub3) {
      this.oddsub3.unsubscribe();
    }
    if (this.oddsub4) {
      this.oddsub4.unsubscribe();
    }
    if (this.oddsub5) {
      this.oddsub5.unsubscribe();
    }
    if (this.oddsub6) {
      this.oddsub6.unsubscribe();
    }

    localStorage.removeItem('tvurl')

    const video = document.getElementById('videoPlayer') as HTMLVideoElement;
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }

    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    localStorage.removeItem('videoTime');
    sessionStorage.clear();

    if (this.fullScreenHandler) {
      document.removeEventListener('fullscreenchange', this.fullScreenHandler);
    }
  }

  closeBet() {
    this.showBetMsg = false
    clearTimeout(this.betMsgTimer)
  }

  scoreTvTabs(dt: any) {
    if(this.showTabs = 'scrd'){
      this.muteVideo();
    }
    this.showTabs = dt;
  }
  hideFancyBet() {
    this.toggleFancy = true
    this.showFancy = true
  }
  showPreFancy() {
    this.toggleFancy = true
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
  minusCounter() {
    if (this.counterBet > 5) {
      this.counterBet--
    } else if (this.counterBet) {
      this.counterBet = 5;
    }
  }
  plusCounter() {
    this.counterBet++
  }
  openBMinfo() {
    this.openBMInfo = !this.openBMInfo
  }
  openTossinfo() {
    this.openTossInfo = !this.openTossInfo
  }
  closeBMinfo() {
    this.show = null
    this.openBMInfo = false;
    this.openTossInfo = false;
    this.openFancyinfo = false;
    this.hideHeader1 = false
    this.dataServe.getloginFlag(this.hideHeader1)
  }
  openFancyInfo(i: any) {
    if (this.show == i) {
      this.show = null;
    } else {
      this.show = i;
    }
  }
  openBMBetPlace(i: any, str: any, price: any) {
    let token = localStorage.getItem('token');
    if (token) {
      clearTimeout(this.bmtimeout)
      this.classclrforlayBack = str
      this.oddPrice = price;
      this.showOdd = null;
      this.showBackSelect = null;
      this.showLaySelect = null;
      if (str == 'back') {
        this.backTrue = true
        this.showBM = i;
        this.showBackSelectBM = i;
        this.showLaySelectBM = null;
      } else if (str == 'lay') {
        this.backTrue = false
        this.showBM = i;
        this.showLaySelectBM = i;
        this.showBackSelectBM = null;
      }
    } else {
      this.router.navigate(['/login'])
    }
    // this.bmtimeout = setTimeout(() => {
    //   this.showBM = null
    //   this.beforeBMcal = false;
    //   this.afterBMcal = false;
    //   this.showBackSelectBM = null;
    //   this.showLaySelectBM = null;
    // }, 10000);
  }
  openOddBetPlace(i: any, str: any, price: any) {
    let token = localStorage.getItem('token');
    if (token) {
      clearTimeout(this.oddtimeout)
      this.getMatcBkData = true;
      this.beforeoddscal = false;
      this.afteroddscal = false;
      this.beforeoddsPnlArray = [0, 0, 0];
      this.afteroddsPnlArray = [0, 0, 0];
      this.classclrforlayBack = str
      this.oddPrice = price

      this.showBM = null;
      this.showBackSelectBM = null;
      this.showLaySelectBM = null;

      if (str == 'back') {
        this.backTrue = true
        this.showOdd = i;
        this.showBackSelect = i;
        this.showLaySelect = null;
      } else if (str == 'lay') {
        this.backTrue = false
        this.showOdd = i;
        this.showLaySelect = i;
        this.showBackSelect = null;
      }
    } else {
      this.router.navigate(['/login'])
    }
    // this.oddtimeout = setTimeout(() => {
    //   this.beforeoddscal = false;
    //   this.afteroddscal = false;
    //   this.showOdd = null
    //   this.showBackSelect = null;
    //   this.showLaySelect = null;
    // }, 10000);
  }

  openOtherBetPlace(i: any, str: any, price: any) {
    let token = localStorage.getItem('token');
    if (token) {
      clearTimeout(this.othertimeout)
      this.classclrforlayBack = str
      this.oddPrice = price

      if (str == 'back') {
        this.showOther = i;
        this.showBackSelectOD = i;
        this.showLaySelectOD = null;

      } else if (str == 'lay') {
        this.showOther = i;
        this.showBackSelectOD = null;
        this.showLaySelectOD = i;
      }
    } else {
      this.router.navigate(['/login'])
    }
    // this.othertimeout = setTimeout(() => {
    //   this.showOther = null;
    //   this.showBackSelectOD = null;
    //   this.showLaySelectOD = null;
    // }, 10000);
  }


  openTossBetPlace(i: any, str: any, price: any) {
    let token = localStorage.getItem('token');
    if (token) {
      clearTimeout(this.tosstimeout)
      this.classclrforlayBack = str
      this.getMatcBkData = true;
      this.beforeBMcal = false;
      this.afterBMcal = false;
      this.oddPrice = price
      if (str == 'back') {
        this.showToss = i;
        this.showBackSelectToss = i;
      }
    } else {
      this.router.navigate(['/login'])
    }
    // this.tosstimeout = setTimeout(() => {
    //   this.showToss = null
    //   this.showBackSelectToss = null;
    // }, 10000);
  }

  openFancyBetPlace(i: any, str: any, price: any) {
    let token = localStorage.getItem('token');
    if (token) {
      clearTimeout(this.fancytimeout)
      this.classclrforlayBack = str
      this.oddPrice = price
      if (str == 'back') {
        this.backTrue = true
        this.showFancyBet = i;
        this.showBackSelectFancy = i;
        this.showLaySelectFancy = null;
      } else if (str == 'lay') {
        this.backTrue = false
        this.showFancyBet = i;
        this.showLaySelectFancy = i;
        this.showBackSelectFancy = null;
      }
    } else {
      this.router.navigate(['/login'])
    }
    // this.fancytimeout = setTimeout(() => {
    //   this.showFancyBet = null
    //   this.showBackSelectFancy = null;
    //   this.showLaySelectFancy = null;
    // }, 10000);
  }
  openPreFancyBetPlace(i: any, str: string, price: any) {
    let token = localStorage.getItem('token');
    if (token) {
      clearTimeout(this.premtimeout)
      this.classclrforlayBack = str
      this.oddPrice = price
      if (str == 'back') {
        this.showPreFancyBet = i;
        this.showBackSelectPreF = i;
      }
    } else {
      this.router.navigate(['/login'])
    }
    // this.premtimeout = setTimeout(() => {
    //   this.showPreFancyBet = null;
    //   this.showBackSelectPreF = null;
    // }, 10000);
  }

  openRulesPopup() {
    this.hideHeader1 = !this.hideHeader1
    if (this.route.component?.name === 'match') {
      this.hideHeader = true;
      this.dataServe.getloginFlag(this.hideHeader)
    } else {
      this.hideHeader = false
    }
  }
  openPreRulesPopup() {
    this.hideHeader2 = !this.hideHeader2
    if (this.route.component?.name === 'match') {
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
    const dateTime = this.datetimeconvert(data.openDate);

    let withinHrs = moment(dateTime).subtract(2, 'hours').format('MM/DD/YYYY HH:mm:ss');
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

  getOddsCalculation(result: any) {
    if (result == false) {
      this.beforeoddsPnlArray = [0, 0, 0];
      this.afteroddsPnlArray = [0, 0, 0];
      this.beforeoddscal = false;
      this.afteroddscal = false;
      this.beforeBMcal = false;
      this.afterBMcal = false;
      this.showBackSelect = null;
      this.showLaySelect = null;
      this.showLaySelectBM = null;
      this.showBackSelectBM = null;
      this.showLaySelectFancy = null;
      this.showBackSelectFancy = null;
      this.showBackSelectToss = null
      this.showBackSelectPreF = null
      this.showBackSelectOD = null
      this.showLaySelectOD = null
      this.showOdd = null;
      this.showToss = null;
      this.showBM = null;
      this.showFancyBet = null
      this.showPreFancyBet = null
      this.showOther = null
      if (this.betOddResult) {
        this.getMatcBkData = true;
      } else {
        this.getMatcBkData = false;
      }
    } else {
      let stake = result[1];
      if (result[0].sourceBetType == 'Odds') {
        if (this.betOddResult?.selection1 == result[0].selectionId) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.betOddResult.pnl1 + respnl;
            this.oddpnl2 = this.betOddResult.pnl2 - stake;
            this.oddpnl3 = this.betOddResult.pnl3 - stake;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 - respnl;
            this.oddpnl2 = this.betOddResult.pnl2 + stake;
            this.oddpnl3 = this.betOddResult.pnl3 + stake;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];
        } else if (this.betOddResult?.selection2 == result[0].selectionId) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.betOddResult.pnl1 - stake;
            this.oddpnl2 = this.betOddResult.pnl2 + respnl;
            this.oddpnl3 = this.betOddResult.pnl3 - stake;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 + stake;
            this.oddpnl2 = this.betOddResult.pnl2 - respnl;
            this.oddpnl3 = this.betOddResult.pnl3 + stake;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];
        } else if (this.betOddResult?.selection3 == result[0].selectionId) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.betOddResult.pnl1 - stake;
            this.oddpnl2 = this.betOddResult.pnl2 - stake;
            this.oddpnl3 = this.betOddResult.pnl3 + respnl;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 + stake;
            this.oddpnl2 = this.betOddResult.pnl2 + stake;
            this.oddpnl3 = this.betOddResult.pnl3 - respnl;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];

        } else {
          this.getMatcBkData = false;
          this.afteroddscal = false;
          this.beforeoddscal = true;
          if (this.matchrunnerssid[0] == result[0].selectionId) {
            let respnl = (result[0].odds - 1) * stake;
            if (result[0].isBack == true) {
              this.oddpnl1 = 0 + respnl;
              this.oddpnl2 = 0 - stake;
              this.oddpnl3 = 0 - stake;
            } else {
              this.oddpnl1 = 0 - respnl;
              this.oddpnl2 = 0 + stake;
              this.oddpnl3 = 0 + stake;
            }
          } else if (this.matchrunnerssid[1] == result[0].selectionId) {
            let respnl = (result[0].odds - 1) * stake;
            if (result[0].isBack == true) {
              this.oddpnl1 = 0 - stake;
              this.oddpnl2 = 0 + respnl;
              this.oddpnl3 = 0 - stake;
            } else {
              this.oddpnl1 = 0 + stake;
              this.oddpnl2 = 0 - respnl;
              this.oddpnl3 = 0 + stake;
            }
          } else if (this.matchrunnerssid[2] == result[0].selectionId) {
            let respnl = (result[0].odds - 1) * stake;
            if (result[0].isBack == true) {
              this.oddpnl1 = 0 - stake;
              this.oddpnl2 = 0 - stake;
              this.oddpnl3 = 0 + respnl;
            } else {
              this.oddpnl1 = 0 + stake;
              this.oddpnl2 = 0 + stake;
              this.oddpnl3 = 0 - respnl;
            }
          }
          this.beforeoddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];
        }
      } else if (result[0].sourceBetType == 'BooKMaker') {
        if (this.betOddResult?.selection1 == result[0].selectionId) {
          this.afterBMcal = true;
          let respnl = (result[0].odds / 100) * stake;
          if (result[0].isBack == true) {
            this.bmpnl1 = this.betOddResult.bmPnl1 + respnl;
            this.bmpnl2 = this.betOddResult.bmPnl2 - stake;
            this.bmpnl3 = this.betOddResult.bmPnl3 - stake;
          } else {
            this.bmpnl1 = this.betOddResult.bmPnl1 - respnl;
            this.bmpnl2 = this.betOddResult.bmPnl2 + stake;
            this.bmpnl3 = this.betOddResult.bmPnl3 + stake;
          }
          this.afterBMPnlArray = [this.bmpnl1, this.bmpnl2, this.bmpnl3];
        } else if (this.betOddResult?.selection2 == result[0].selectionId) {
          this.afterBMcal = true;
          let respnl = (result[0].odds / 100) * stake;
          if (result[0].isBack == true) {
            this.bmpnl1 = this.betOddResult.bmPnl1 - stake;
            this.bmpnl2 = this.betOddResult.bmPnl2 + respnl;
            this.bmpnl3 = this.betOddResult.bmPnl3 - stake;
          } else {
            this.bmpnl1 = this.betOddResult.bmPnl1 + stake;
            this.bmpnl2 = this.betOddResult.bmPnl2 - respnl;
            this.bmpnl3 = this.betOddResult.bmPnl3 + stake;
          }
          this.afterBMPnlArray = [this.bmpnl1, this.bmpnl2, this.bmpnl3];
        } else if (this.betOddResult?.selection3 == result[0].selectionId) {
          this.afterBMcal = true;
          let respnl = (result[0].odds / 100) * stake;
          if (result[0].isBack == true) {
            this.bmpnl1 = this.betOddResult.bmPnl1 - stake;
            this.bmpnl2 = this.betOddResult.bmPnl2 - stake;
            this.bmpnl3 = this.betOddResult.bmPnl3 + respnl;
          } else {
            this.bmpnl1 = this.betOddResult.bmPnl1 + stake;
            this.bmpnl2 = this.betOddResult.bmPnl2 + stake;
            this.bmpnl3 = this.betOddResult.bmPnl3 - respnl;
          }
          this.afterBMPnlArray = [this.bmpnl1, this.bmpnl2, this.bmpnl3];
        } else {
          this.getMatcBkData = false;
          this.afterBMcal = false;
          this.beforeBMcal = true;
          if (this.matchrunnerssid[0] == result[0].selectionId) {
            let respnl = (result[0].odds / 100) * stake;
            if (result[0].isBack == true) {
              this.bmpnl1 = 0 + respnl;
              this.bmpnl2 = 0 - stake;
              this.bmpnl3 = 0 - stake;
            } else {
              this.bmpnl1 = 0 - respnl;
              this.bmpnl2 = 0 + stake;
              this.bmpnl3 = 0 + stake;
            }
          } else if (this.matchrunnerssid[1] == result[0].selectionId) {
            let respnl = (result[0].odds / 100) * stake;
            if (result[0].isBack == true) {
              this.bmpnl1 = 0 - stake;
              this.bmpnl2 = 0 + respnl;
              this.bmpnl3 = 0 - stake;
            } else {
              this.bmpnl1 = 0 + stake;
              this.bmpnl2 = 0 - respnl;
              this.bmpnl3 = 0 + stake;
            }
          } else if (this.matchrunnerssid[2] == result[0].selectionId) {
            let respnl = (result[0].odds / 100) * stake;
            if (result[0].isBack == true) {
              this.bmpnl1 = 0 - stake;
              this.bmpnl2 = 0 - stake;
              this.bmpnl3 = 0 + respnl;
            } else {
              this.bmpnl1 = 0 + stake;
              this.bmpnl2 = 0 + stake;
              this.bmpnl3 = 0 - respnl;
            }
          }
          this.beforeBMPnlArray = [this.bmpnl1, this.bmpnl2, this.bmpnl3];
        }
      }
    }
  }

  inPlayMatches(data: any) {
    if (this.sportId == 4) {
      let date = this.datetimeconvert(data);
      let withinHrs = moment(date).subtract(15, 'minutes').format('MM/DD/YYYY HH:mm:ss');

      let date3 = new Date();
      let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
      if (moment(currentDate).isAfter(withinHrs)) {
        this.inplay = true
        return this.inplay;
      } else {
        this.inplay = false
        return this.inplay;
      }
    } else {
      let date = this.datetimeconvert(data);
      let withinHrs = moment(date).format('MM/DD/YYYY HH:mm:ss');
      let date3 = new Date();
      let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
      if (moment(currentDate).isAfter(withinHrs)) {
        this.inplay = true
        return this.inplay;
      } else {
        this.inplay = false
        return this.inplay;
      }
    }
  }

  refreshPage() {
    window.location.reload()
  }
  stopTimeout(data: any) {
    if (data == true) {
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
    this.arroicon = !this.arroicon
  }
  downarrowToss() {
    this.arroiconToss = !this.arroiconToss
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
        framedetElement.style.display = 'block';
        videoWrapperElement.classList.remove('is-outside');
        framedetElement.style.transform = '';
        this.isOutside = false;

      }
    }
  }

  private updateIndicatorPosition(): void {
    const activeTabElement = document.querySelectorAll('.tab')[this.activeTab] as HTMLElement;
    this.indicatorWidth = activeTabElement.offsetWidth;
    this.indicatorLeft = activeTabElement.offsetLeft;
  }

  closeTv() {
    const framedetElement = document.querySelector('.framedet') as HTMLElement;
    framedetElement.style.display = 'none';
    this.showTabs = 'scrd';
    if(this.showTabs = 'scrd'){
      this.muteVideo();
    }
  }
  preActiveTab(data: any) {
    this.preactivetab = data;
  }
  openPopup() {
    this.popupService.openPopup();
  }
}

