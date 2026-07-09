import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { SocketServiceService } from '../../services/socket-service.service';
import { ParlayBetPlaceComponent } from '../parlay-bet-place/parlay-bet-place.component';
import { GetSocketUrlService } from '../../services/get-socket-url.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';


@Component({
  selector: 'app-toss-parlay',
  standalone: true,
  imports:[CommonModule,ParlayBetPlaceComponent],
  templateUrl: './toss-parlay.component.html',
  styleUrls: ['./toss-parlay.component.css']
})
export class TossParlayComponent {
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
  isLogin = false;
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

  constructor(private dataServe: DataHandlerService, private socket: SocketServiceService, private getSocketPath: GetSocketUrlService,
              private route: ActivatedRoute, public sanitizer: DomSanitizer,private elRef: ElementRef,private renderer: Renderer2) {
               }

  async ngOnInit() {
    await this.getSocketPath.getSocketUrl();

    let token = localStorage.getItem('token')
    if(token){
      this.isLogin = true;
      let data = localStorage.getItem('userData')
      if (data) {
        this.loginResData = JSON.parse(data)
      }

      this.dataServe.betSuccessMsg.subscribe((res : any)=>{
        this.betSuccess = res;
        this.showBetMsg = true;
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

    this.socket.connectSocket();
    this.getMatchesList();
  }

  getMatchesList(){
    let sectimed = this.dataServe.getTimeStamp();
    let mddata = {"sportid":4,"timeStamp": sectimed.timeStamp, "secretKey": sectimed.secretKey }

    // this.dataServe.verifyUser(mddata).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataServe.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.dataServe.getUserSportMatches(mddata).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let res = this.dataServe.decryptData(error.error.text);
    //           let cricdata = res.data.results;
    //           this.cricketList = cricdata.sort((a:any, b:any) => a.openTimestamp - b.openTimestamp);
    //           this.getOddsData(this.cricketList)
    //           this.isLoading = false;
    //         }
    //       })
    //     }
    //   }
    // })
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
      this.dataServe.betSuccessParlay(false,'', res)
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

  closeBet(){
    this.showBetMsg = false
  }

  cancelBet(){
    this.counterBet = 0
  }

  openTossinfo(){
    this.openTossInfo = !this.openTossInfo
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

  toNumber(value: any): number {
    return typeof value === 'number' ? value : 0;
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

  refreshPage(){
    window.location.reload()
  }

  stopTimeout(data:any){
    if(data==true){
      clearTimeout(this.tosstimeout)
    }
  }

  mainTabs: any = 1;
  searchpopup: boolean = false;
  openNotify: boolean = false;
  openSettingpopup: boolean = false;
  activeTab: any = 5;
  changeCount(data: any) {
    this.mainTabs = data;
  }
  openSearch() {
    this.searchpopup = true;
  }
  openNotification() {
    this.openNotify = true;
  }
  openSetting() {
    this.openSettingpopup = true;
  }
  sportsTab(sportId: any) {
    this.activeTab = sportId;
  }
}
