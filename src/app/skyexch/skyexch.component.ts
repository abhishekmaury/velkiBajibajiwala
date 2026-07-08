import { AfterViewInit, Component, OnDestroy, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { DataHandlerService } from '../services/datahandler.service';

@Component({
  selector: 'app-skyexch',
  templateUrl: './skyexch.component.html',
  styleUrls: ['./skyexch.component.css'],
  // encapsulation: ViewEncapsulation.Emulated
})
export class SkyexchComponent implements OnInit {
  validateapi: any;
  loggedData:any;
  userBalance:any;
  username:any;
  userLiability:any;
  updBal:any;
  refreshBtn=false
  popup : boolean = false;
  stakeArr : any;
  stake:any;
  //stake = {'stake1':'10', 'stake2':'20', 'stake3':'50', 'stake4':'100', 'stake5':'500', 'stake6':'1000'}
  editStakeContainer = true;
  editStakeHere = false;
  editStakesArr :any;
  openTv = false;
  accPopoup = false;
  oneClick = false;
  navigator = true;
  myBets=false;

  constructor(private dataserve: DataHandlerService, private authServe: AuthserviceService,private router: Router) { }
  ngOnInit(): void {

    this.dataserve.betSuccessMsg.subscribe((res)=>{
      if(res){
        this.upDateBalance()
      }
    })
    let lsData = localStorage.getItem('userData');
    if (lsData) {
      this.loggedData = JSON.parse(lsData);
      this.userBalance = this.loggedData.data.user.myBalance;
      this.username = this.loggedData.data.user.userName;
    }

    let sectime = this.dataserve.getTimeStamp();

    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    // this.dataserve.verifyUser(data).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.authServe.getUserDetails(data).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           let gms = this.dataserve.decryptData(error.error.text);
    //           this.loggedData.data.user.myBalance = gms?.data.balance
    //           this.userBalance = this.loggedData?.data?.user?.myBalance;
    //           this.userLiability = gms?.data?.liability;
    //           localStorage.setItem("userData", JSON.stringify(this.loggedData))
    //           this.updBal = true;
    //         }
    //       })

    //     }
    //   }
    // })

    let sectime2 = this.dataserve.getTimeStamp();

    let data2 = { "timeStamp": sectime2.timeStamp, "secretKey": sectime2.secretKey }

    // this.dataserve.verifyUser(data2).subscribe((res: any) => {
    // }, (error) => {
    //   if (error.status == 200) {
    //     this.validateapi = this.dataserve.decryptData(error.error.text);
    //     if (this.validateapi.data.type == 'success') {
    //       this.authServe.getUsersStake(data2).subscribe((res: any) => {
    //       }, (error) => {
    //         if (error.status == 200) {
    //           this.stake = this.dataserve.decryptData(error.error.text);
    //           localStorage.setItem("userStake", JSON.stringify(this.stake))
    //         }
    //       })

    //     }
    //   }
    // })

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigator = !(event.url.includes('/exchange/mob-bets'));
        this.openTv = event.url.includes('/exchange/mob-match')
      }
    });
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (!(target).closest('.accountPop')) {
      this.accPopoup = false;
    }
  }

  toggleMenu() {
    this.accPopoup = true;
  }
  logout() {
    this.authServe.logout()
  }
  hideAccPopup(){
    this.accPopoup = false;
  }
  fadeLoginPopup() {
    document.getElementById('set_pop')?.classList.toggle('d-block');
  }
  oneClickBet() {
      this.dataserve.changeIsOneClickBetStatus().subscribe((res: any) => {
      this.oneClick = !this.oneClick
        this.dataserve.oneClickBet(this.oneClick)
      });
  }

  closePopup() {
    document.getElementById('set_pop')?.classList.remove('d-block');
    document.getElementById('popup')?.classList.add('d-none');
  }

  closeloginpopup(){
    this.popup = false
  }

  editStake() {
    this.editStakeContainer = false
    this.editStakeHere = true
  }
  updateStakes(){
    // if(this.editStakesArr.value){
    //   this.dataServe.editStake(this.editStakesArr.value).subscribe((res : any)=>{
    //     this.stakeArr = res
    //     localStorage.setItem('updatedStake', JSON.stringify(res))
    //   })
    // }
    // this.editStakeContainer = true
    // this.editStakeHere = false
  }
  upDateBalance() {

      let sectime = this.dataserve.getTimeStamp();

      let data =  { "timeStamp":sectime.timeStamp,"secretKey":sectime.secretKey }

      // this.dataserve.verifyUser(data).subscribe((res : any)=>{
      // },(error)=>{
      //   if(error.status==200){
      //     this.validateapi = this.dataserve.decryptData(error.error.text);
      //     if(this.validateapi.data.type=='success'){
      //       this.authServe.getUserDetails(data).subscribe((res : any)=>{
      //       },(error)=>{
      //         if(error.status==200){
      //           let gms = this.dataserve.decryptData(error.error.text);
      //           this.loggedData.data.user.myBalance = gms.data.balance
      //           this.userLiability = gms.data.liability;
      //           this.userBalance = this.loggedData.data.user.myBalance;
      //           localStorage.setItem("userData", JSON.stringify(this.loggedData))

      //         }
      //       })

      //     }
      //   }
      // })
  }

  numberOnly(event: any):any {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var regex2 = new RegExp(/^[0-9]{1,4}$/);
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
       event.preventDefault();
       return false;
    }
    if(!regex2.test(key)){
      event.preventDefault();
      return false;
    }
  }

  openLiveTv(data : any){
    this.dataserve.openLiveTv(data)
  }

  openbets(){
    this.myBets=!this.myBets
  }
}
