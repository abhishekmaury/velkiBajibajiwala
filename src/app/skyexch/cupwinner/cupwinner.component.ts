import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { SocketServiceService } from '../../services/socket-service.service';
import { PlaceBetCupwinnerComponent } from '../place-bet-cupwinner/place-bet-cupwinner.component';
import { GetSocketUrlService } from '../../services/get-socket-url.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-cupwinner',
  standalone: true,
  imports:[CommonModule,PlaceBetCupwinnerComponent],
  templateUrl: './cupwinner.component.html',
  styleUrls: ['./cupwinner.component.css']
})
export class CupwinnerComponent {

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
  isLogin = false;
  counterBet :number = 0;

  show = null
  showOdd = null
  showBackSelect = null
  showLaySelect = null
  classclrforlayBack = ''
  oddPrice : any;
  closeLTv = true;
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
  oddsPnlArray : any[] = [];
  beforeoddsPnlArray : any[] = [];
  afteroddsPnlArray : any[] = [];
  backTrue : any;
  validateapi : any;
  newbookdata : any;
  oddspermission:any;
  bookList:any =[];
  pnlList:any =[];
  oddtimeout:any;
  url2:any;
  urlSafe: SafeResourceUrl | undefined;
  urlSafe2: SafeResourceUrl | undefined;
  layBet = true;
  odlimit = false;
  collapse1 = false;
  oddminStake : any;
  oddmaxStake : any;
  private mutationObserver!: MutationObserver;
  private intervalId!: any;
  themeData:any;

  constructor(private dataServe: DataHandlerService, private getSocketPath: GetSocketUrlService, private socket: SocketServiceService,
              private route: ActivatedRoute, public sanitizer: DomSanitizer,private elRef: ElementRef,private renderer: Renderer2) {
               }

  async ngOnInit() {
    await this.getSocketPath.getSocketUrl();
    // this.dataServe.sendWebData.subscribe((res: any) => {
    //   this.themeData = res?.theme;
    // })
    let webdata = localStorage.getItem("webData");
    if (webdata) {
      let formatedDt = JSON.parse(webdata)
      this.themeData = formatedDt?.theme;
    }
    let token = localStorage.getItem('token')
    if(token){
      this.isLogin = true;
      this.getMatcBkData = true;
      let data = localStorage.getItem('userData')
      if (data) {
        this.loginResData = JSON.parse(data)
      }

      this.dataServe.betSuccessMsg.subscribe((res : any)=>{
        this.betSuccess = res;
        this.showBetMsg = true;
        this.showOdd = null;
        this.showBackSelect = null;
        this.showLaySelect = null;

        let sectime = this.dataServe.getTimeStamp();
        let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

        // this.dataServe.verifyUser(data).subscribe((res: any) => {
        // }, (error) => {
        //   if (error.status == 200) {

        //     this.validateapi = this.dataServe.decryptData(error.error.text);
        //     if (this.validateapi.data.type == 'success') {
        //       this.dataServe.getUserActiveFancyBook(this.eventId,data).subscribe((res: any) => {
        //       }, (error) => {
        //         let res = this.dataServe.decryptData(error.error.text);
        //         if(error.status == 200) {
        //           this.betOddResult = res.data;
        //           this.bookgenerate();
        //           this.getMatcBkData = true;
        //         } else {
        //           this.getMatcBkData = false;
        //         }
        //       })
        //     }
        //   }
        // })


        this.betsuccessstatus = this.betSuccess[0];
          setTimeout(() => {
            this.showBetMsg = false;
          }, 5000);
      })

    }else{
      this.isLogin = false;
    }


    this.socket.connectSocket();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('sportId') && paramMap.has('eventId')) {

        this.sportId = paramMap.get('sportId');
        this.eventId = paramMap.get('eventId');

        let sectimed = this.dataServe.getTimeStamp();
        let mddata = {"eventId":this.eventId,"timeStamp": sectimed.timeStamp, "secretKey": sectimed.secretKey }

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
        //           this.oddspermission=this.eventData?.isOdds;

        //           this.inplaystatus = this.inPlayMatches(this.eventData.matchDate);
        //           if(this.sportId!=='4' && this.inplaystatus==false){
        //             this.layBet = false;
        //           }

        //           this.matchrunners = JSON.parse(this.eventData.selctionids)

        //         }
        //       })
        //     }
        //   }
        // })


        if(token){
          let sectime = this.dataServe.getTimeStamp();
          let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

          // this.dataServe.verifyUser(data).subscribe((res: any) => {
          // }, (error) => {
          //   if (error.status == 200) {
          //     this.validateapi = this.dataServe.decryptData(error.error.text);
          //     if (this.validateapi.data.type == 'success') {
          //       this.dataServe.getUserActiveFancyBook(this.eventId,data).subscribe((res: any) => {
          //       }, (error) => {
          //         if (error.status == 200) {
          //           let res = this.dataServe.decryptData(error.error.text);
          //           this.betOddResult = res.data;
          //           this.getMatcBkData = true;

          //           setTimeout(() => {
          //             this.bookgenerate();
          //           }, 1000);
          //         } else {
          //           this.getMatcBkData = false;
          //         }
          //       })
          //     }
          //   }
          // })

        }


        let sectimeds = this.dataServe.getTimeStamp();
        let mddatas = {"eventId":this.eventId,"timeStamp": sectimeds.timeStamp, "secretKey": sectimeds.secretKey }

        // this.dataServe.verifyUser(mddatas).subscribe((res: any) => {
        // }, (error) => {
        //   if (error.status == 200) {
        //     this.validateapi = this.dataServe.decryptData(error.error.text);
        //     if (this.validateapi.data.type == 'success') {
        //       this.dataServe.getPreLoadData(mddatas,this.eventId).subscribe((res: any) => {
        //       }, (error) => {
        //         if (error.status == 200) {
        //           let res1 = this.dataServe.decryptData(error.error.text);
        //           let res = res1.data;
        //           this.eventData2 = res;
        //           if(this.eventData2){
        //             // code for odds start
        //             if(this.eventData2.oddsProvider==='Tiger')
        //             {
        //               this.totalMatched = res.odds[0].totalMatched;
        //               this.runnersList = res.odds[0].runners;
        //             }
        //             else if(this.eventData2.oddsProvider==='Neeraj')
        //             {
        //               this.totalMatched = res.odds[0].totalMatched;
        //               this.runnersList = res.odds[0].runners;
        //             }
        //             // code for odds End
        //           }
        //         }
        //       })
        //     }
        //   }
        // })

        // Odds Code Start
        this.socket.setOdds(this.eventId);
        this.socket.getOdds(this.eventId);

        this.oddsub = this.socket.getUpdateMessageListner().subscribe((res: any) => {
          if(res.message['data'].length > 0) {

            if(res.message.Type==='Tiger')
            {
              let newsocketdt = res.message['data'][0].runners;
              this.socketEventOdds = res.message.events;

              const mergedData = this.matchrunners.map((runner:any) => {
                const runnerDetails = newsocketdt.find((item:any) => item.selectionId === runner.selectionid);
                return {
                    ...runner,
                    ...(runnerDetails ? { ex: runnerDetails.ex } : {})
                };
              });

              this.runnersList = mergedData;
            }
            else if(res.message.Type==='Neeraj')
            {
              let newsocketdt = res.message['data'][0].runners;
              this.socketEventOdds = res.message.events;

              const mergedData = this.matchrunners.map((runner:any) => {
                const runnerDetails = newsocketdt.find((item:any) => item.selectionId === runner.selectionid);
                return {
                    ...runner,
                    ...(runnerDetails ? { ex: runnerDetails.ex } : {})
                };
              });

              this.runnersList = mergedData;
            }

          }
        })
        // Odds Code End

      }

    })

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


  trackByFn(index: number, item: any): any {
    return index;
  }

  openoddslimit(){
    if(this.odlimit==true){
      this.odlimit=false;
    } else {
      this.odlimit=true;
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
    if (this.oddsub) {
      this.oddsub.unsubscribe();
    }
  }

  closeBet(){
    this.showBetMsg = false
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

  bookgenerate() {
    this.pnlList = [];
    for(var j = 0; j < this.matchrunners.length; j++) {
      let dt = { [this.matchrunners[j].selectionid] : 0 };
      this.pnlList.push(dt);
    }

    for(var i = 0; i < this.betOddResult.length; i++) {
      for(var j = 0; j < this.matchrunners.length; j++) {
        let selectionId = this.matchrunners[j].selectionid;
        let pnlItem = this.pnlList.find((item:any) => item.hasOwnProperty(selectionId));
        if(selectionId == this.betOddResult[i].runnerId) {
            pnlItem[selectionId] += this.betOddResult[i].equalGreaterBook;
        } else {
            pnlItem[selectionId] += this.betOddResult[i].belowBook;
        }
      }
    }
  }

  openOddBetPlace(i : any, str : any, price : any){
    clearTimeout(this.oddtimeout)
    this.getMatcBkData = true;
    this.beforeoddsPnlArray =[0,0,0];
    this.afteroddsPnlArray =[0,0,0];
    this.classclrforlayBack = str
    this.oddPrice = price

    if (str == 'back') {
      this.backTrue = true
      this.showOdd = i;
      this.showBackSelect = i;
      this.showLaySelect = null;
    }else if(str == 'lay'){
      this.backTrue = false
      this.showOdd = i;
      this.showLaySelect = i;
      this.showBackSelect = null;
    }
    this.oddtimeout = setTimeout(() => {
      this.showOdd = null
      this.showBackSelect = null;
      this.showLaySelect = null;
    }, 10000);
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

  getOddsCalculation(result : any){
    if(result==false){
      this.beforeoddsPnlArray =[0,0,0];
      this.afteroddsPnlArray =[0,0,0];
      this.showBackSelect = null;
      this.showLaySelect = null;
      this.showOdd = null;
      if(this.betOddResult != undefined){
        this.getMatcBkData = true;
      } else {
        this.getMatcBkData = false;
      }
    } else {
      let stake = result[1];
    }
  }
  toNumber(value: any): number {
    return typeof value === 'number' ? value : 0;
  }

  inPlayMatches(data:any){
    let date = this.datetimeconvert(data);
    //let withinHrs = moment(date).format('MM/DD/YYYY HH:mm:ss');
    let withinHrs = moment(date).add(330, 'minutes').format('MM/DD/YYYY HH:mm:ss');
    let date3 = new Date()
    let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');
    if(moment(currentDate).isAfter(withinHrs) ) {
      this.inplay = true
      return this.inplay;
    }else{
      this.inplay = false
      return this.inplay;
    }
  }

  refreshPage(){
    window.location.reload()
  }

  stopTimeout(data:any){
    if(data==true){
      clearTimeout(this.oddtimeout)
    }
  }

  collapseData1(){
    this.collapse1 = !this.collapse1;
  }
  closePopup(){
    this.collapse1 = false;
  }

  bookfilter(data:any){
    return this.pnlList.filter((item:any) => item.hasOwnProperty(data)).map((item:any) => item[data])[0] ?? null;
  }
}
