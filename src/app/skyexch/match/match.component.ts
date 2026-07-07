import { Component, OnInit, OnDestroy, ViewChild, HostListener, ElementRef, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import moment from 'moment';
import 'moment-timezone';
import { CommonModule } from '@angular/common';
import { DatahandlerService } from '../../services/datahandler.service';
import { SocketServiceService } from '../../services/socket-service.service';
import { BetPlaceComponent } from '../bet-place/bet-place.component';
import { HttpResponse } from '@angular/common/http';
import { FingerprintService } from '../../services/fingerprint.service';
import { GetSocketUrlService } from '../../services/get-socket-url.service';

@Component({
  selector: 'app-match',
  imports: [CommonModule, BetPlaceComponent],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class MatchComponent implements OnInit, OnDestroy {
  @ViewChild('formDataBack') formDataBack: any;
  @ViewChild('formDataLay') formDataLay: any;
  @ViewChild('socketEventOdds') formDataEvent: any;
  @ViewChild('iframeRef') iframeRef!: ElementRef<HTMLIFrameElement>;
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
  hideHeader2: boolean = false;
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
  fancy1Liability: any;
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
  validateapi: any;
  newbookdata: any;
  oddspermission: any;
  bmpermission: any;
  fancypermission: any;
  otpermisssion: any;
  prempermission: any;
  bookList: any = [];
  pnlList: any = [];
  tvchannel: any;
  bmtimeout: any;
  oddtimeout: any;
  tosstimeout: any;
  fancytimeout: any;
  premtimeout: any;
  othertimeout: any;
  url2: any;
  urlSafe: SafeResourceUrl | undefined;
  urlSafe2: SafeResourceUrl | undefined;
  layBet = true;
  odlimit = false;
  collapse1 = false;
  oddminStake: any;
  oddmaxStake: any;
  private mutationObserver!: MutationObserver;
  private intervalId!: any;
  LocalLimit: any;
  currency: any;
  collapsedetails: boolean = true;
  fancyLimitCheck = false;
  bookmakerLimit = false;
  deviceId: any;
  premiumData: any;
  onlyPremium = false;

  videoHeight: number = 120;
  startX: any;
  startY: any;
  initialLeft: any;
  initialTop: any;
  isDragging: boolean = false;
  demoUser = false;
  intervalIdTime: any;

  constructor(private dataServe: DatahandlerService, private getSocketPath: GetSocketUrlService, private socket: SocketServiceService, private fingerprintService: FingerprintService,
    private route: ActivatedRoute, public sanitizer: DomSanitizer, private elRef: ElementRef, private renderer: Renderer2) { }

  async ngOnInit() {
    await this.getSocketPath.getSocketUrl();
    this.getDeviceId()
    let token = localStorage.getItem('token')
    if (token) {
      this.showTabs = 'tv';
      this.isLogin = true;
      this.getMatcBkData = true;
      let data = localStorage.getItem('userData')
      if (data) {
        this.loginResData = JSON.parse(data)
        this.demoUser = this.loginResData.data.user.isDemo;
        this.currency = this.loginResData?.data?.user?.currency
        this.LocalLimit = this.loginResData.data.user;
      }
      this.dataServe.openLTV.subscribe((res: any) => {
        this.closeLTv = res
      })

      this.dataServe.betSuccessMsg.subscribe((res: any) => {
        this.betSuccess = res;
        this.showBetMsg = true;
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
        this.showFancyBet = null
        this.showBackSelectFancy = null;
        this.showLaySelectFancy = null;
        this.showPreFancyBet = null;
        this.showBackSelectPreF = null;
        this.showOther = null;
        this.showBackSelectOD = null;
        this.showLaySelectOD = null;

        let sectime = this.dataServe.getTimeStamp();
        let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

        this.dataServe.verifyUser(data).subscribe((res: any) => {
        }, (error) => {
          if (error.status == 200) {

            this.validateapi = this.dataServe.decryptData(error.error.text);
            if (this.validateapi.data.type == 'success') {
              this.dataServe.getUserMarketBook(this.eventId, data).subscribe((res: any) => {
              }, (error) => {
                if (error.status == 200) {

                  this.newbookdata = this.dataServe.decryptData(error.error.text);
                  let res = this.bookFilter(this.newbookdata, 'Odds')

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

                  this.showBackSelectToss = null;
                  this.showToss = null;

                  let res1 = this.bookFilter(this.newbookdata, 'toss')
                  if (res1) {
                    this.getTossBkData = true;
                    this.tossPnlArray = [res1.pnl1, res1.pnl2, res1.pnl3];
                  } else {
                    this.getTossBkData = false;
                    this.tossPnlArray = [0, 0, 0];
                  }

                  let res2 = this.fancybookFilter(this.newbookdata, 'Fancy')
                  if (res2) {
                    this.fancyLiability = res2
                  } else {
                    this.fancyLiability = []
                  }

                  let res22 = this.fancybookFilter(this.newbookdata, 'Fancy1')
                  if (res22) {
                    this.fancy1Liability = res22
                  } else {
                    this.fancy1Liability = []
                  }

                  let res3 = this.fancybookFilter(this.newbookdata, 'premium')
                  if (res3) {
                    this.PremiumfancyLiability = res3
                  } else {
                    this.PremiumfancyLiability = [];
                  }

                  let res4 = this.fancybookFilter(this.newbookdata, 'Other')
                  if (res4) {
                    this.omPnlArray = res4;
                  } else {
                    this.omPnlArray = [];
                  }


                } else {
                  this.getMatcBkData = false;
                  this.oddsPnlArray = [0, 0, 0];
                  this.bmPnlArray = [0, 0, 0];
                  this.getTossBkData = false;
                  this.tossPnlArray = [0, 0, 0];
                }
              })
            }
          }
        })


        this.betsuccessstatus = this.betSuccess[0];
        setTimeout(() => {
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
        this.socket.connectSocket2(this.sportId);


        localStorage.setItem('selectedEventId', this.eventId)

        let sectimed = this.dataServe.getTimeStamp();
        let mddata = { "eventId": this.eventId, "timeStamp": sectimed.timeStamp, "secretKey": sectimed.secretKey }

        this.dataServe.verifyUser(mddata).subscribe((res: any) => {
        }, (error) => {
          if (error.status == 200) {
            this.validateapi = this.dataServe.decryptData(error.error.text);
            if (this.validateapi.data.type == 'success') {
              this.dataServe.getUserMatcheDetail(mddata).subscribe((res: any) => {
              }, (error) => {
                if (error.status == 200) {
                  let res = this.dataServe.decryptData(error.error.text);
                  this.eventData = res.data;
                  this.urlSafe = this.getScore(this.eventData.scoreBase, this.eventId)
                  if (this.eventData?.onlyPremium) {
                    this.onlyPremium = this.eventData?.onlyPremium;
                  } else {
                    this.onlyPremium = false;
                  }
                  if (this.sportId == 2 || this.sportId == 1) {
                    this.showFancy = false
                    this.hideFancyForST = false
                    this.toggleFancy = false
                    // if(this.sportId==1){
                    //   this.launchPremium(552001,this.eventId)
                    // } else if(this.sportId==2){
                    //   this.launchPremium(552002,this.eventId)
                    // } else if(this.sportId==4){
                    //   this.launchPremium(552003,this.eventId)
                    // }
                  } else if (this.sportId == 4) {
                    if (this.eventData.gameType == 'virtual1' || this.onlyPremium) {
                      this.showFancy = false
                      this.hideFancyForST = false
                      this.toggleFancy = false

                      //   if(this.sportId==1){
                      //   this.launchPremium(552001,this.eventId)
                      // } else if(this.sportId==2){
                      //   this.launchPremium(552002,this.eventId)
                      // } else if(this.sportId==4){
                      //   this.launchPremium(552003,this.eventId)
                      // }
                    } else {
                      this.toggleFancy = true
                      this.showFancy = true
                      this.hideFancyForST = true
                    }
                  }

                  this.url2 = res.data.tvurl;
                  localStorage.setItem('tvurl', this.url2)
                  this.oddspermission = this.eventData?.isOdds;
                  this.bmpermission = this.eventData?.isBook;
                  this.fancypermission = this.eventData?.isFancy;
                  this.otpermisssion = this.eventData?.isOther;
                  this.prempermission = this.eventData?.isPrem;
                  // console.log(this.prempermission);


                  this.tosscheck = this.hideTossbefor2HrFun(this.eventData)
                  this.inplaystatus = this.inPlayMatches(this.eventData.matchDate);
                  this.intervalIdTime = setInterval(() => {
                    this.inplaystatus = this.inPlayMatches(this.eventData.matchDate);
                  }, 10000);
                  if (this.sportId !== '4' && this.inplaystatus == false) {
                    this.layBet = false;
                  }

                  if (this.eventData.team3 != undefined) {
                    this.matchrunners.push(this.eventData.team1, this.eventData.team2, this.eventData.team3);
                    this.matchrunnerssid.push(this.eventData.id1, this.eventData.id2, this.eventData.id3);
                  } else {
                    this.matchrunners.push(this.eventData.team1, this.eventData.team2);
                    this.matchrunnerssid.push(this.eventData.id1, this.eventData.id2);
                  }

                  document.addEventListener('visibilitychange', () => {
                    if (!document.hidden) {
                      this.inplaystatus = this.inPlayMatches(this.eventData.matchDate);
                    }
                  });
                  window.addEventListener('focus', () => {
                    this.inplaystatus = this.inPlayMatches(this.eventData.matchDate);
                  });
                  
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
                    })
                  }
                  //Toss Code End

                }
              })
            }
          }
        })



        if (token) {
          // if(this.sportId==1){
          //   this.launchPremium(552001,this.eventId)
          // } else if(this.sportId==2){
          //   this.launchPremium(552002,this.eventId)
          // } else if(this.sportId==4){
          //   this.launchPremium(552003,this.eventId)
          // }
          let type = 'Match odds';

          let sectime = this.dataServe.getTimeStamp();
          let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

          this.dataServe.verifyUser(data).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 200) {

              this.validateapi = this.dataServe.decryptData(error.error.text);
              if (this.validateapi.data.type == 'success') {
                this.dataServe.getUserMarketBook(this.eventId, data).subscribe((res: any) => {
                }, (error) => {
                  if (error.status == 200) {
                    this.newbookdata = this.dataServe.decryptData(error.error.text);
                    let res = this.bookFilter(this.newbookdata, 'Odds')
                    if (res) {
                      this.betOddResult = res;
                      this.oddsPnlArray = [res.pnl1, res.pnl2, res.pnl3];
                      this.bmPnlArray = [res.bmPnl1, res.bmPnl2, res.bmPnl3];
                    } else {
                      this.getMatcBkData = false;
                      this.oddsPnlArray = [0, 0, 0];
                      this.bmPnlArray = [0, 0, 0];
                    }

                    let res1 = this.bookFilter(this.newbookdata, 'toss')
                    if (res1) {
                      this.getTossBkData = true;
                      this.tossPnlArray = [res1.pnl1, res1.pnl2, res1.pnl3];
                    } else {
                      this.getTossBkData = false;
                      this.tossPnlArray = [0, 0, 0];
                    }

                    let res2 = this.fancybookFilter(this.newbookdata, 'Fancy')
                    if (res2) {
                      this.fancyLiability = res2

                    } else {
                      this.fancyLiability = []
                    }

                    let res22 = this.fancybookFilter(this.newbookdata, 'Fancy1')
                    if (res22) {
                      this.fancy1Liability = res22
                    } else {
                      this.fancy1Liability = []
                    }

                    let res3 = this.fancybookFilter(this.newbookdata, 'premium')
                    if (res3) {
                      this.PremiumfancyLiability = res3
                    } else {
                      this.PremiumfancyLiability = [];
                    }

                    let res4 = this.fancybookFilter(this.newbookdata, 'Other')
                    if (res4) {
                      this.omPnlArray = res4;
                    } else {
                      this.omPnlArray = [];
                    }

                  } else {
                    this.getMatcBkData = false;
                    this.bmPnlArray = [0, 0, 0];
                    this.getTossBkData = false;
                    this.tossPnlArray = [0, 0, 0];
                  }
                })
              }
            }
          })

        }


        let sectimeds = this.dataServe.getTimeStamp();
        let mddatas = { "eventId": this.eventId, "timeStamp": sectimeds.timeStamp, "secretKey": sectimeds.secretKey }

        this.dataServe.verifyUser(mddatas).subscribe((res: any) => {
        }, (error) => {
          if (error.status == 200) {
            this.validateapi = this.dataServe.decryptData(error.error.text);
            if (this.validateapi.data.type == 'success') {
              this.dataServe.getPreLoadData(mddatas, this.eventId).subscribe((res: any) => {
              }, (error) => {
                if (error.status == 200) {
                  let res1 = this.dataServe.decryptData(error.error.text);
                  let res = res1.data;
                  this.eventData2 = res;
                  if (this.eventData2) {
                    // code for odds start
                    if (this.eventData2.oddsProvider === 'Tiger') {
                      this.totalMatched = res.odds?.[0]?.totalMatched;
                      this.runnersList = res.odds?.[0]?.runners;
                    }
                    else if (this.eventData2.oddsProvider === 'Neeraj') {
                      this.totalMatched = res.odds?.[0]?.totalMatched;
                      this.runnersList = res.odds?.[0]?.runners;
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
                      let bm = this.eventData2.bookMaker[0].map((dt: any) => ({
                        ...dt,
                        ordering: this.eventData?.bookt1 == dt.runnerName ? '1' : this.eventData?.bookt2 == dt.runnerName ? '2' : this.eventData?.bookt3 == dt.runnerName ? '3' : '',
                        status: dt.status == '2' ? 'Suspended' : dt.status == '1' ? 'Active' : dt.status,
                        backOddsInfo: JSON.parse(dt.backOddsInfo).map(Number),
                        layOddsInfo: JSON.parse(dt.layOddsInfo).map(Number)
                      }));

                      bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

                      this.runnersList2 = { bookmaker: bm, events: this.eventData };
                    }
                    else if (this.eventData2.bmProvider === 'World') {
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
                }
              })
            }
          }
        })

        // Odds Code Start
        this.socket.setOdds(this.eventId);
        this.socket.getOdds(this.eventId);

        this.oddsub = this.socket.getUpdateMessageListner().subscribe((res: any) => {
          this.tvchannel = res.message.banglaTV;
          this.socketEventOdds = res.message.events;

          if (res.message?.['data']?.length > 0) {
            if (res.message.Type === 'Tiger') {
              this.totalMatched = res.message?.['data']?.[0]?.totalMatched;
              this.runnersList = res.message?.['data']?.[0]?.runners;
            }
            else if (res.message.Type === 'Neeraj') {
              this.totalMatched = res.message?.['data']?.[0]?.totalMatched;
              this.runnersList = res.message?.['data']?.[0]?.runners;
            }

          }
        })
        // Odds Code End


        //BookMaker Code Start
        this.socket.setBookMaker(this.eventId);
        this.socket.getBookMaker(this.eventId);

        this.oddsub2 = this.socket.getUpdate2MessageListner().subscribe((res: any) => {

          if (res.message2.Type === 'Sky' || res.message2.Type === 'World') {
            this.bookmakerLimit = true;
          } else {
            this.bookmakerLimit = false;
          }

          if (res.message2.Type === 'Diamond') {
            let runnersd = (((res.message2['data']).map((d: any) => (d.bm1))).flat()).filter((rd: any) => {
              if (rd?.mname == this.eventData?.bookheader) {
                return rd;
              }
            });

            let bm = runnersd?.map((dt: any) => ({
              ...dt,
              ordering: this.eventData?.bookt1 == dt.nat ? '1' : this.eventData?.bookt2 == dt.nat ? '2' : this.eventData?.bookt3 == dt.nat ? '3' : '',
              status: dt.s == 'SUSPENDED' ? 'Suspended' : dt.s == 'ACTIVE' ? 'Active' : dt.s,
              backOddsInfo: [dt.b1, dt.b2, dt.b3],
              layOddsInfo: [dt.l1, dt.l2, dt.l3]
            })
            );

            bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

            this.runnersList2 = { bookmaker: bm, events: res.message2['events'] };
          }
          else if (res.message2.Type === 'Sky') {
            if (res.message2?.['data']?.[0]?.length > 0) {
              let bm = res.message2?.['data']?.[0]?.map((dt: any) => ({
                ...dt,
                ordering: this.eventData?.bookt1 == dt.runnerName ? '1' : this.eventData?.bookt2 == dt.runnerName ? '2' : this.eventData?.bookt3 == dt.runnerName ? '3' : '',
                status: dt.status == '2' ? 'Suspended' : dt.status == '1' ? 'Active' : dt.status,
                backOddsInfo: JSON.parse(dt.backOddsInfo).map(Number),
                layOddsInfo: JSON.parse(dt.layOddsInfo).map(Number)
              }));

              bm?.sort((a: any, b: any) => a.ordering.localeCompare(b.ordering))

              this.runnersList2 = { bookmaker: bm, events: res.message2['events'], details: res?.message2?.details?.[0] };
            }
          }
          else if (res.message2.Type === 'World') {
            let runnersdw = (res.message2['data']).filter((rd: any) => {
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

            this.runnersList2 = { bookmaker: bm, events: res.message2['events'], details: res?.message2?.data?.[0] };
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

            this.runnersList2 = { bookmaker: bm, events: res.message2['events'] };
          }
        });
        //BookMaker Code End


        //Fancy Code Start
        this.socket.setFancy(this.eventId);
        this.socket.getFancy(this.eventId);

        this.oddsub4 = this.socket.getUpdateFancyListner().subscribe((res: any) => {
          if (res.message4.Type1 == 'Sky' || res.message4.Type1 == 'World') {
            this.fancyLimitCheck = true;
          } else {
            this.fancyLimitCheck = false;
          }

          this.fancyEventData = res.message4;
          if (res.message4.Type1 == 'Diamond') {
            this.fancyDataList = res.message4.diamond;

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

            this.fancyDataList = fancydatas.map((dt: any) => ({
              ...dt,
              gstatus: dt.status == '2' ? 'Active' : 'SUSPENDED',
              nat: dt.marketName,
              bs1: dt.oddsYes,
              b1: dt.runsYes,
              ls1: dt.oddsNo,
              l1: dt.runsNo,
              sid: dt.marketId,
              selectionId: dt.eventId + "-" + dt.marketId + ".FY"
            })
            );

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

            this.fancyDataList = fancydatas.map((dt: any) => ({
              ...dt,
              gstatus: dt.gstatus == 'SUSPENDED' ? 'SUSPENDED' : dt.gstatus == 'ACTIVE' ? 'Active' : dt.gstatus,
              b1: dt.odds.filter((o: any) => o.oname == 'back1').map((m: any) => m.odds)[0] || 0,
              bs1: dt.odds.filter((o: any) => o.oname == 'back1').map((m: any) => m.size)[0] || 0,
              l1: dt.odds.filter((o: any) => o.oname == 'lay1').map((m: any) => m.odds)[0] || 0,
              ls1: dt.odds.filter((o: any) => o.oname == 'lay1').map((m: any) => m.size)[0] || 0,
              gtype: 'Fancy',
              ballsess: '1'
            })
            );

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
            this.fancyDataList = fancydatas.map((dt: any) => ({
              ...dt,
              gstatus: (dt.status1 !== 'ACTIVE' || dt.is_active !== '1') ? 'SUSPENDED' : 'Active',
              nat: dt.name,
              sid: dt.marketId,
              b1: dt.b1 || 0,
              bs1: dt.bs1 || 0,
              l1: dt.l1 || 0,
              ls1: dt.ls1 || 0,
              gtype: 'Fancy',
              ballsess: '1'
            })
            );

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
            this.PFancyData = res?.message5?.data?.sportsBookMarket?.sort((a: any, b: any) =>  a?.apiSiteMarketId.localeCompare(b?.apiSiteMarketId) );
            this.oddminStake = this.PFancyAllData?.events?.markets[0].limit[2].b2CminStake;
            this.oddmaxStake = this.PFancyAllData?.events?.markets[0].limit[2].b2CmaxStake;
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

  async getDeviceId() {
    const comps = await this.fingerprintService.collect();

    this.dataServe.getIdentify(comps).subscribe((res: any) => {
      if (res) {
        this.deviceId = res?.uuid;
      }
    })
  }

  openfnacyBook(fancyId: any) {
    this.bookList = [];
    this.pnlList = [];

    let sectime = this.dataServe.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    this.dataServe.verifyUser(data).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.getUserActiveFancyBook(fancyId, data).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 200) {
              let msd = this.dataServe.decryptData(error.error.text);
              this.fancybookdata = msd.data;

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

            }
          })
        }
      }
    })

    this.openFanBook = true
    // this.ngOnInit()
  }

  getMatchDetails() {
    let sectimed = this.dataServe.getTimeStamp();
    let mddata = { "eventId": this.eventId, "timeStamp": sectimed.timeStamp, "secretKey": sectimed.secretKey }

    this.dataServe.verifyUser(mddata).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.getUserMatcheDetail(mddata).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 200) {
              let res = this.dataServe.decryptData(error.error.text);
              this.eventData = res.data;
              this.oddspermission = this.eventData?.isOdds;
              this.bmpermission = this.eventData?.isBook;
              this.fancypermission = this.eventData?.isFancy;
              this.otpermisssion = this.eventData?.isOther;
              this.prempermission = this.eventData?.isPrem;

            }
          })
        }
      }
    })
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
    if (data == 'all') {
      this.fan1 = true
      this.normalFan = true
      this.overFan = true
      this.bbbFan = true
      this.khaddaFan = true
      this.lotteryFan = true
      this.oddevenFan = true
      this.fancyselectedTab = 'all';
    } else if (data == 'normal') {
      this.fan1 = false
      this.normalFan = true
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'normal';
    } else if (data == 'fancy1') {
      this.fan1 = true
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'fancy1';
    } else if (data == 'over') {
      this.fan1 = false
      this.normalFan = false
      this.overFan = true
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'over';
    } else if (data == 'bbb') {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = true
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'bbb';
    } else if (data == 'khadda') {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = true
      this.lotteryFan = false
      this.oddevenFan = false
      this.fancyselectedTab = 'khadda';
    } else if (data == 'lottery') {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = true
      this.oddevenFan = false
      this.fancyselectedTab = 'lottery';
    } else if (data == 'oddeven') {
      this.fan1 = false
      this.normalFan = false
      this.overFan = false
      this.bbbFan = false
      this.khaddaFan = false
      this.lotteryFan = false
      this.oddevenFan = true
      this.fancyselectedTab = 'oddeven';
    }

  }

  matchTabs(name: string): void {
    this.TopMenuselectedItem = name;
  }

  ngOnDestroy() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.intervalIdTime) {
      clearInterval(this.intervalIdTime);
    }
    
    this.socket.destorySocket(this.eventId);
    if (this.oddsub) {
      this.oddsub.unsubscribe();
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
    //   if(this.showFancy == false){
    //   if(this.sportId==1){
    //     this.launchPremium(552001,this.eventId)
    //   } else if(this.sportId==2){
    //     this.launchPremium(552002,this.eventId)
    //   } else if(this.sportId==4){
    //     this.launchPremium(552003,this.eventId)
    //   }
    // }
  }
  collapseData() {
    document.getElementById('sportSelData')?.classList.toggle('d-none')
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
  openBMBetPlace(i: any, str: any, price: any) {
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
    this.bmtimeout = setTimeout(() => {
      this.showBM = null
      this.beforeBMcal = false;
      this.afterBMcal = false;
      this.showBackSelectBM = null;
      this.showLaySelectBM = null;
    }, 1000000);
  }
  openOddBetPlace(i: any, str: any, price: any) {
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
    this.oddtimeout = setTimeout(() => {
      this.beforeoddscal = false;
      this.afteroddscal = false;
      this.showOdd = null
      this.showBackSelect = null;
      this.showLaySelect = null;
    }, 1000000);
  }

  openOtherBetPlace(i: any, str: any, price: any) {
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
    this.othertimeout = setTimeout(() => {
      this.showOther = null;
      this.showBackSelectOD = null;
      this.showLaySelectOD = null;
    }, 1000000);
  }

  openTossBetPlace(i: any, str: any, price: any) {
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

    this.tosstimeout = setTimeout(() => {
      this.showToss = null
      this.showBackSelectToss = null;
    }, 1000000);
  }

  openFancyBetPlace(i: any, str: any, price: any) {
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

    this.fancytimeout = setTimeout(() => {
      this.showFancyBet = null
      this.showBackSelectFancy = null;
      this.showLaySelectFancy = null;
    }, 1000000);
  }
  openPreFancyBetPlace(i: any, str: string, price: any) {
    clearTimeout(this.premtimeout)
    this.classclrforlayBack = str
    this.oddPrice = price
    if (str == 'back') {
      this.showPreFancyBet = i;
      this.showBackSelectPreF = i;
    }
    this.premtimeout = setTimeout(() => {
      this.showPreFancyBet = null;
      this.showBackSelectPreF = null;
    }, 1000000);
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
      if (this.betOddResult != undefined) {
        this.getMatcBkData = true;
      } else {
        this.getMatcBkData = false;
      }
    } else {
      let stake = result[1];
      if (result[0].sourceBetType == '') {
        if (result[0].selectionId == 1) {
          this.afteroddscal = true;
          // this.getMatcBkData = false
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.toNumber(this.betOddResult?.pnl1) + respnl;
            this.oddpnl2 = this.toNumber(this.betOddResult?.pnl2) - stake;
            this.oddpnl3 = this.toNumber(this.betOddResult?.pnl3) - stake;
          } else {
            this.oddpnl1 = this.toNumber(this.betOddResult?.pnl1) - respnl;
            this.oddpnl2 = this.toNumber(this.betOddResult?.pnl2) + stake;
            this.oddpnl3 = this.toNumber(this.betOddResult?.pnl3) + stake;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];

        } else if (result[0].selectionId == 2) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.toNumber(this.betOddResult?.pnl1) - stake;
            this.oddpnl2 = this.toNumber(this.betOddResult?.pnl2) + respnl;
            this.oddpnl3 = this.toNumber(this.betOddResult?.pnl3) - stake;
          } else {
            this.oddpnl1 = this.toNumber(this.betOddResult?.pnl1) + stake;
            this.oddpnl2 = this.toNumber(this.betOddResult?.pnl2) - respnl;
            this.oddpnl3 = this.toNumber(this.betOddResult?.pnl3) + stake;
          }
          this.afteroddsPnlArray = [this.oddpnl1, this.oddpnl2, this.oddpnl3];
        } else if (result[0].selectionId == 3) {
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1) * stake;
          if (result[0].isBack == true) {
            this.oddpnl1 = this.toNumber(this.betOddResult?.pnl1) - stake;
            this.oddpnl2 = this.toNumber(this.betOddResult?.pnl2) - stake;
            this.oddpnl3 = this.toNumber(this.betOddResult?.pnl3) + respnl;
          } else {
            this.oddpnl1 = this.toNumber(this.betOddResult?.pnl1) + stake;
            this.oddpnl2 = this.toNumber(this.betOddResult?.pnl2) + stake;
            this.oddpnl3 = this.toNumber(this.betOddResult?.pnl3) - respnl;
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
      } else if (result[0].sourceBetType == 'book') {
        if (result[0].selectionId == 1) {
          this.afterBMcal = true;
          let respnl = (result[0].odds / 100) * stake;
          if (result[0].isBack == true) {
            this.bmpnl1 = this.toNumber(this.betOddResult?.bmPnl1) + respnl;
            this.bmpnl2 = this.toNumber(this.betOddResult?.bmPnl2) - stake;
            this.bmpnl3 = this.toNumber(this.betOddResult?.bmPnl3) - stake;
          } else {
            this.bmpnl1 = this.toNumber(this.betOddResult?.bmPnl1) - respnl;
            this.bmpnl2 = this.toNumber(this.betOddResult?.bmPnl2) + stake;
            this.bmpnl3 = this.toNumber(this.betOddResult?.bmPnl3) + stake;
          }
          this.afterBMPnlArray = [this.bmpnl1, this.bmpnl2, this.bmpnl3];
        } else if (result[0].selectionId == 2) {
          this.afterBMcal = true;
          let respnl = (result[0].odds / 100) * stake;
          if (result[0].isBack == true) {
            this.bmpnl1 = this.toNumber(this.betOddResult?.bmPnl1) - stake;
            this.bmpnl2 = this.toNumber(this.betOddResult?.bmPnl2) + respnl;
            this.bmpnl3 = this.toNumber(this.betOddResult?.bmPnl3) - stake;
          } else {
            this.bmpnl1 = this.toNumber(this.betOddResult?.bmPnl1) + stake;
            this.bmpnl2 = this.toNumber(this.betOddResult?.bmPnl2) - respnl;
            this.bmpnl3 = this.toNumber(this.betOddResult?.bmPnl3) + stake;
          }
          this.afterBMPnlArray = [this.bmpnl1, this.bmpnl2, this.bmpnl3];
        } else if (result[0].selectionId == 3) {
          this.afterBMcal = true;
          let respnl = (result[0].odds / 100) * stake;
          if (result[0].isBack == true) {
            this.bmpnl1 = this.toNumber(this.betOddResult?.bmPnl1) - stake;
            this.bmpnl2 = this.toNumber(this.betOddResult?.bmPnl2) - stake;
            this.bmpnl3 = this.toNumber(this.betOddResult?.bmPnl3) + respnl;
          } else {
            this.bmpnl1 = this.toNumber(this.betOddResult?.bmPnl1) + stake;
            this.bmpnl2 = this.toNumber(this.betOddResult?.bmPnl2) + stake;
            this.bmpnl3 = this.toNumber(this.betOddResult?.bmPnl3) - respnl;
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

  bookFilter(data: any, type: any) {
    let oddsbm = (data.data).filter((rd: any) => {
      if (rd.sourceType == type) {
        return rd;
      }
    });
    return oddsbm[0];
  }

  fancybookFilter(data: any, type: any) {
    let oddsbm = (data.data).filter((rd: any) => {
      if (rd.sourceType == type) {
        return rd;
      }
    });
    return oddsbm;
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
  safeUUID(): string {
    if (window.crypto && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

 getScore(scoreUrl : any, data: any) {
    const uuid = this.safeUUID();
    return this.sanitizer.bypassSecurityTrustResourceUrl(scoreUrl + data + '?v=' + uuid)
  }

  collapseData1() {
    this.collapse1 = !this.collapse1;
  }
  closePopup() {
    this.collapse1 = false;
  }
  showTabs = 'scrd';
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

  collapseDetails() {
    this.collapsedetails = !this.collapsedetails
  }

  collapsedetailstoss: boolean = true
  collapseDetailsToss() {
    this.collapsedetailstoss = !this.collapsedetailstoss
  }

  // launchPremium(gameId: any, gameCode: any) {
  //   this.dataServe.launchPremium(gameId, gameCode, this.deviceId).subscribe(
  //     (response: HttpResponse<any>) => {
  //       if (response.status == 200) {
  //         const res = response.body;
  //         this.premiumData = this.sanitizer.bypassSecurityTrustResourceUrl(res.data.url);
  //       } else {
  //         const res = response.body;
  //       }
  //     }
  //   );
  // }

  isMobile = false;

  @ViewChild('wrap') wrapRef!: ElementRef;
  ngAfterViewInit() {
    this.isMobile = window.innerWidth <= 768;

    if (!this.isMobile && this.wrapRef) {
      this.renderer.listen(this.wrapRef.nativeElement, 'scroll', () => {
        this.handleScroll(this.wrapRef.nativeElement.scrollTop);
      });
    }

    window.addEventListener('message', (event: MessageEvent) => {
      let height = null;
      try {
        const data = typeof event.data === 'string'
          ? JSON.parse(event.data)
          : event.data;
        height = data?.height || data?.bodyHeight;
      } catch (e) { }
      if (typeof event.data === 'number') {
        height = event.data;
      }
      if (height && this.iframeRef) {
        this.iframeRef.nativeElement.style.height = height + 'px';
      }
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isMobile) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.handleScroll(scrollTop);
    }
  }

  handleScroll(scrollTop: number) {
    const videoWrap = document.querySelector('.tv');
    const video = document.querySelector('.zoomed_mode');

    if (videoWrap && video) {
      const videoBottom = this.videoHeight + videoWrap.getBoundingClientRect().top;

      if (scrollTop > videoBottom) {
        (videoWrap as HTMLElement).style.height = `${this.videoHeight}px`;
        video.classList.add('stuck');
        (video as HTMLElement).style.left = 'auto';
        (video as HTMLElement).style.top = 'auto';
      } else {
        (videoWrap as HTMLElement).style.height = '100%';
        video.classList.remove('stuck');
        (video as HTMLElement).style.left = '0';
        (video as HTMLElement).style.top = '0';
      }
    }
  }

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //   const videoWrap = document.querySelector('.tv');
  //   const video = document.querySelector('.zoomed_mode');

  //   if (videoWrap && video) {
  //     const videoBottom = this.videoHeight + videoWrap.getBoundingClientRect().top;

  //     if (windowScrollTop > videoBottom) {
  //       (videoWrap as HTMLElement).style.height = `${this.videoHeight}px`;
  //       video.classList.add('stuck');
  //       (video as HTMLElement).style.left = 'auto';
  //       (video as HTMLElement).style.top = 'auto';
  //     } else {
  //       (videoWrap as HTMLElement).style.height = '100%';
  //       video.classList.remove('stuck');
  //       (video as HTMLElement).style.left = '0';
  //       (video as HTMLElement).style.top = '0';
  //     }
  //   }
  // }

  calculateVideoHeight() {
    const video = document.querySelector('.zoomed_mode');
    if (video) {
      this.videoHeight = video.clientHeight;
    }
  }
  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const draggable = document.getElementById('zoomdrag');
    if (draggable) {
      const rect = draggable.getBoundingClientRect();

      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        this.isDragging = true;
        event.preventDefault();
      }
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const draggable = document.getElementById('zoomdrag');
      if (draggable) {
        draggable.style.left = `${event.clientX - draggable.clientWidth / 2}px`;
        draggable.style.top = `${event.clientY - draggable.clientHeight / 2}px`;
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isDragging = false;
  }

  private isTouchingElement: boolean = false;

  @HostListener('document:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    const draggable = document.getElementById('zoomdrag');
    if (draggable) {
      const touch = event.targetTouches[0];
      const boundingRect = draggable.getBoundingClientRect();
      if (
        touch.clientX >= boundingRect.left &&
        touch.clientX <= boundingRect.right &&
        touch.clientY >= boundingRect.top &&
        touch.clientY <= boundingRect.bottom
      ) {
        this.isTouchingElement = true;
      } else {
        this.isTouchingElement = false;
      }
    }
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isTouchingElement) {
      const draggable = document.getElementById('zoomdrag');
      if (draggable) {
        const touch = event.targetTouches[0];
        draggable.style.left = `${touch.clientX - draggable.clientWidth / 2}px`;
        draggable.style.top = `${touch.clientY - draggable.clientHeight / 2}px`;
        event.preventDefault();
      }
    }
  }

  @HostListener('document:touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    // Reset the touch flag when touch ends
    this.isTouchingElement = false;
  }
}
