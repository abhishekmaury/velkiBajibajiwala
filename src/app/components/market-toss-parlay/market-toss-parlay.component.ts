import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HandlerService } from 'src/app/services/handler.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { SocketServiceService } from 'src/app/services/socket-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import 'moment-timezone';
import { GetSocketUrlService } from 'src/app/services/get-socket-url.service';
import { CommonModule } from '@angular/common';
import { BetPlaceParlayComponent } from '../bet-place-parlay/bet-place-parlay.component';
import { MainFooterComponent } from '../main-footer/main-footer.component';
import { MarqueeComponent } from '../marquee/marquee.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-market-toss-parlay',
  templateUrl: './market-toss-parlay.component.html',
  styleUrls: ['./market-toss-parlay.component.css'],
  standalone:true,
  imports:[CommonModule,BetPlaceParlayComponent,MainFooterComponent,MarqueeComponent,LoaderComponent],

})

export class MarketTossParlayComponent implements OnInit , OnDestroy {

  @ViewChild('formDataBack') formDataBack: any;
  @ViewChild('formDataLay') formDataLay: any;
  @ViewChild('socketEventOdds') formDataEvent: any;
  sub: Subscription = new Subscription();
  cricketList: any;
  eventId: any;
  eventData: any = [];
  oddsub : any;
  runnersList: any = [];
  matchrunners : any = [];
  matchrunnerssid : any = [];
  selectedRunner: any;
  loginResData: any;
  counterBet :number = 0;
  openTossInfo : boolean = false;
  hideTossBefore2hr: boolean = false;
  showhidetoss: boolean = false;
  tosscheck : any;
  eventData2 : any;
  socketEventOdds : any;
  matchData : any;
  betSuccess : any ;
  betsuccessstatus : boolean = false;
  showBetMsg : boolean = false;
  betresult : any;
  betOddResult : any;
  isback : boolean = false;
  isLay : boolean = false;
  inplay : any;
  inplaystatus : any;
  getTossBkData = false;
  tossPnlArray : any = [];
  tosssocketdata : any = [];
  validateapi : any;
  tosstimeout:any;
  betCount = 0;
  openBetSlip = false;
  tossodd = 0.95
  isLoading = true;
  gameList: any;
  isLogin: boolean = false;
  loading: boolean = true;
  webdata:any;
  jsonWebdt :any;
  jsonWeblinksdt:any;
  activeTabId = 5;

  constructor(private socket: SocketServiceService,private popupService: HandlerService, private getSocketPath : GetSocketUrlService, private dataServe: DataHandlerService, private route: Router,
              private router: ActivatedRoute) { }

  async ngOnInit() {
    await this.getSocketPath.getSocketUrl();
    this.loading = true;
    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      if(d1?.theme){
        this.jsonWebdt = JSON.parse(d1?.theme)
      }
      if(d1?.links){
        this.jsonWeblinksdt = JSON.parse(d1?.links)
      }
    }

    let token = localStorage.getItem('token');
    if (token) {
      this.isLogin = true;
      this.dataServe.betSuccessMsg.subscribe((res : any)=>{
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

    let btct = localStorage.getItem('parlayOdds')
    if(btct){
      let ndt = JSON.parse(btct)
      this.betCount=ndt.length;
    }

    this.socket.connectSocket();
    let ddt = await this.dataServe.getGameList(4).toPromise() as any[];
    let ddt1 = ddt.sort((a: any, b: any) => new Date(a.day).getTime() - new Date(b.day).getTime());
    let ddt2 = ddt1.map((item: any) => {
      item.isInplay = this.inPlayMatches(item.day);
      return item;
    });
    this.gameList = ddt2.filter((item: any) => item.isInplay === false);
    this.getOddsData(this.gameList)
    this.loading = false;
  }

  openBetpop() {
    this.popupService.openBetPopup();
  }

  datetimeconvert(data:any){
    const dateTime = new Date(data);
    const utcYear = dateTime.getUTCFullYear();
    const utcMonth = padZero(dateTime.getUTCMonth() + 1);
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
    let date = this.datetimeconvert(data);
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

  hideTossbefor2HrFun(data: any) {
    const dateTime = this.datetimeconvert(data.day);
    let withinHrs = moment(dateTime).add(210, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    let date3 = new Date()
    let date2 = moment(date3).format('YYYY-MM-DD HH:mm:ss')

    if(moment(date2).isAfter(withinHrs)) {
      return this.hideTossBefore2hr = false
    } else {
      return this.hideTossBefore2hr = true
    }
  }

  getOddsData(data: any) {
    data.forEach((ele: any) => {
      this.socket.setToss(ele?.marketid);
      this.socket.getToss(ele?.marketid);
      this.socket.getUpdate3MessageListner().subscribe((res: any) => {
        const eventId = String(res.message3.data.eventid);
        const eventData = res.message3;
        this.runnersList[eventId] = eventData;
      })
    });

    this.oddsub = this.socket.getUpdate3MessageListner().subscribe((res: any) => {
      const eventId = String(res.message3.data.eventid);
      const eventData = res.message3;
      this.runnersList[eventId] = eventData;
    })
  }

  openTossBetPlace(parlayType: any, data: any){
    let parType = localStorage.getItem('parlayType')
    if(parType=='Toss' || parType==null){

      localStorage.setItem('parlayType',parlayType)
      let localodd = localStorage.getItem('parlayOdds')
      if(localodd){
        let localodddata = JSON.parse(localodd)
        let sameEvent = localodddata.find((item:any) => item.eventId == data[0].eventId);
        if(sameEvent){
          let diffEvent = localodddata.filter((item:any) => item.eventId !== data[0].eventId);
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
      //this.dataServe.betSuccessParlay(false,'', res)
    }
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
    if (this.oddsub) {
      this.oddsub.unsubscribe();
    }
  }
}

