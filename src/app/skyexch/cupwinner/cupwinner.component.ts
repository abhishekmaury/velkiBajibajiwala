import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  tosscheck : any;
  eventData2 : any;
  socketEventOdds : any;
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
  tossPnlArray : any = [];
  beforeoddsPnlArray : any[] = [];
  afteroddsPnlArray : any[] = [];
  beforeoddscal = false;
  afteroddscal = false;
  oddpnl1 : any = 0;
  oddpnl2 : any = 0;
  oddpnl3 : any = 0;
  backTrue : any;
  oddspermission:any;
  bookList:any =[];
  pnlList:any =[];
  oddtimeout:any;
  odlimit=false;
  webdata : any;
  jsonWebdt : any;

  constructor(private dataServe: DataHandlerService, private getSocketPath: GetSocketUrlService, private socket: SocketServiceService,
    private route: ActivatedRoute, private elRef: ElementRef, private router: Router) {
  }

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

    let token = localStorage.getItem('token')
    if(token){
      localStorage.setItem('placebetcheck', 'false')
      this.isLogin = true;
      let data = localStorage.getItem('userData')
      if (data) {
        this.loginResData = JSON.parse(data)
      }

      this.dataServe.betSuccessMsg.subscribe((res : any)=>{
        this.betSuccess = res;
        this.showBetMsg = true;

        if(res[1].sourceBetType === 'Odds'){
          let type='winner';

          this.showOdd = null;
          this.showBackSelect = null;
          this.showLaySelect = null;
          this.afteroddscal = false;

          this.dataServe.getUserMatchBookData(res[1].eventId, type).subscribe((res : any)=>{
            if(res){
              this.betOddResult = res;
              this.bookgenerate();
              this.getMatcBkData = true;
            } else{
              this.getMatcBkData = false;
            }
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


    this.socket.connectSocket();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      if(paramMap.has('sportId') && paramMap.has('eventId')) {

        this.sportId = paramMap.get('sportId');
        this.eventId = paramMap.get('eventId');

        localStorage.setItem('selectedEventId', this.eventId)

        if(token){
          this.dataServe.getEventDataOnLoadnew(this.eventId).subscribe((res: any) => {
            this.eventData = res;
            this.oddspermission=this.eventData?.isAutoOdds;
            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            this.matchrunners = JSON.parse(this.eventData.selctionids)
          })

          let type='winner';
          this.dataServe.getUserMatchBookData(this.eventId, type).subscribe((res : any)=>{
            if(res) {
              this.betOddResult = res;
              this.getMatcBkData = true;

              setTimeout(() => {
                this.bookgenerate();
              }, 1000);
            } else {
              this.getMatcBkData = false;
            }
          })
        } else {
          this.dataServe.getEventDataOnLoad(this.eventId).subscribe((res: any) => {
            this.eventData = res;
            this.oddspermission=this.eventData?.isAutoOdds;
            this.inplaystatus = this.inPlayMatches(this.eventData?.openDate);
            this.matchrunners = JSON.parse(this.eventData.selctionids)
          })
        }

        this.dataServe.getEventDataOnLoad2(this.eventId).subscribe((res: any) => {
          this.eventData2 = res;
          if(this.eventData2 && this.eventData2!=='OK'){
            // code for odds start
            if(this.eventData2.oddsProvider==='Tiger')
            {
              this.runnersList = res.odds[0].runners;
            }
            else if(this.eventData2.oddsProvider==='Neeraj')
            {
              this.runnersList = res.odds[0].runners;
            }
            // code for odds End
          }
        })

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
  }

  ngOnDestroy() {
    this.socket.destorySocket(this.eventId);
    if (this.oddsub) {
      this.oddsub.unsubscribe();
    }

  }

  closeBet(){
    this.showBetMsg = false;
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

  openOddBetPlace(i : any, str : any, price : any){
    clearTimeout(this.oddtimeout)
    this.getMatcBkData = true;
    this.afteroddscal = false;
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
    // this.oddtimeout = setTimeout(() => {
    //   this.afteroddscal = false;
    //   this.showOdd = null
    //   this.showBackSelect = null;
    //   this.showLaySelect = null;
    // }, 10000);
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
      let withinHrs = moment(date).subtract(15, 'minutes').format('MM/DD/YYYY HH:mm:ss');

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
    }
  }

  bookgenerate() {
    this.pnlList = [];
    for(var j = 0; j < this.matchrunners.length; j++) {
      let dt = { [this.matchrunners[j].selectionid]: 0 };
      this.pnlList.push(dt);
    }
    for(var i = 0; i < this.betOddResult.length; i++) {
      for(var j = 0; j < this.matchrunners.length; j++) {
        let selectionId = this.matchrunners[j].selectionid;
        let pnlItem = this.pnlList.find((item:any) => item.hasOwnProperty(selectionId));
        if(selectionId == this.betOddResult[i].runs) {
            pnlItem[selectionId] += this.betOddResult[i].equalGreaterBook;
        } else {
            pnlItem[selectionId] += this.betOddResult[i].belowBook;
        }
      }
    }
  }

  getOddsCalculation(result : any){
    if(result==false){
      this.beforeoddsPnlArray =[0,0,0];
      this.afteroddsPnlArray =[0,0,0];
      this.beforeoddscal = false;
      this.afteroddscal = false;
      this.showBackSelect = null;
      this.showLaySelect = null;
      this.showOdd = null;
      if(this.betOddResult){
        this.getMatcBkData = true;
      } else {
        this.getMatcBkData = false;
      }
    } else {
      let stake = result[1];
      if(result[0].sourceBetType=='Odds'){
        if(this.betOddResult?.selection1==result[0].selectionId){
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1)*stake;
          if(result[0].isBack==true){
            this.oddpnl1 = this.betOddResult.pnl1 + respnl;
            this.oddpnl2 = this.betOddResult.pnl2 - stake;
            this.oddpnl3 = this.betOddResult.pnl3 - stake;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 - respnl;
            this.oddpnl2 = this.betOddResult.pnl2 + stake;
            this.oddpnl3 = this.betOddResult.pnl3 + stake;
          }
          this.afteroddsPnlArray =[ this.oddpnl1, this.oddpnl2, this.oddpnl3];
        } else if(this.betOddResult?.selection2==result[0].selectionId){
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1)*stake;
          if(result[0].isBack==true){
            this.oddpnl1 = this.betOddResult.pnl1 - stake;
            this.oddpnl2 = this.betOddResult.pnl2 + respnl;
            this.oddpnl3 = this.betOddResult.pnl3 - stake;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 + stake;
            this.oddpnl2 = this.betOddResult.pnl2 - respnl;
            this.oddpnl3 = this.betOddResult.pnl3 + stake;
          }
          this.afteroddsPnlArray =[ this.oddpnl1, this.oddpnl2, this.oddpnl3];
        } else if(this.betOddResult?.selection3==result[0].selectionId){
          this.afteroddscal = true;
          let respnl = (result[0].odds - 1)*stake;
          if(result[0].isBack==true){
            this.oddpnl1 = this.betOddResult.pnl1 - stake;
            this.oddpnl2 = this.betOddResult.pnl2 - stake;
            this.oddpnl3 = this.betOddResult.pnl3 + respnl;
          } else {
            this.oddpnl1 = this.betOddResult.pnl1 + stake;
            this.oddpnl2 = this.betOddResult.pnl2 + stake;
            this.oddpnl3 = this.betOddResult.pnl3 - respnl;
          }
          this.afteroddsPnlArray =[ this.oddpnl1, this.oddpnl2, this.oddpnl3];
        } else {
          this.getMatcBkData = false;
          this.afteroddscal = false;
          this.beforeoddscal = true;
          if(this.matchrunnerssid[0] == result[0].selectionId){
            let respnl = (result[0].odds - 1)*stake;
            if(result[0].isBack==true){
              this.oddpnl1 = 0 + respnl;
              this.oddpnl2 = 0 - stake;
              this.oddpnl3 = 0 - stake;
            } else {
              this.oddpnl1 = 0 - respnl;
              this.oddpnl2 = 0 + stake;
              this.oddpnl3 = 0 + stake;
            }
          } else if(this.matchrunnerssid[1] == result[0].selectionId){
            let respnl = (result[0].odds - 1)*stake;
            if(result[0].isBack==true){
              this.oddpnl1 = 0 - stake;
              this.oddpnl2 = 0 + respnl;
              this.oddpnl3 = 0 - stake;
            } else {
              this.oddpnl1 = 0 + stake;
              this.oddpnl2 = 0 - respnl;
              this.oddpnl3 = 0 + stake;
            }
          } else if(this.matchrunnerssid[2] == result[0].selectionId){
            let respnl = (result[0].odds - 1)*stake;
            if(result[0].isBack==true){
              this.oddpnl1 = 0 - stake;
              this.oddpnl2 = 0 - stake;
              this.oddpnl3 = 0 + respnl;
            } else {
              this.oddpnl1 = 0 + stake;
              this.oddpnl2 = 0 + stake;
              this.oddpnl3 = 0 - respnl;
            }
          }
          this.beforeoddsPnlArray =[ this.oddpnl1, this.oddpnl2, this.oddpnl3];
        }
      }
    }
  }

  bookfilter(data:any){
    return this.pnlList.filter((item:any) => item.hasOwnProperty(data)).map((item:any) => item[data])[0] ?? null;
  }
}
