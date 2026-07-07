import { Component, HostListener, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthserviceService } from 'src/app/services/authservice.service';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { trimValidator } from 'src/app/services/trim.validator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('slideInOut', [
      state('closed', style({
        transform: 'translateX(-100%)',
        opacity: 0,
        zIndex: -10
      })),
      state('open', style({
        transform: 'translateX(0)',
        opacity: 1,
        zIndex: 50
      })),
      transition('closed => open', [
        style({ display: 'block' }),
        animate('0.3s ease-in-out')
      ]),
      transition('open => closed', [
        animate('0.3s ease-in-out', style({ opacity: 0 })),
        style({ display: 'none' }),
      ])
    ])
  ]
})

export class HeaderComponent implements OnInit{
  @Input('countData') countData : any;
  menu = false
  isMarketRoute = false;
  userName: any;
  // currentBets: any;
  gameCount: any;
  loginData: any;
  errMsg: string = '';
  loginResData: any;
  balInfo: any;
  expoInfo: any;
  oneClick: boolean = false;
  showpwrd: boolean = false;
  loggedIn: boolean = false;
  validationCode: any;
  checkInterval: any;
  isLogin = false
  intervalSubscription: any;
  refreshBtn = false
  popup: boolean = false;
  showHeader: boolean = true;
  launchUrl: any;
  openTv = false;
  accPopoup = false;
  hideDeskHeader = true;
  webdata: any;
  img: any;
  yellow = 'yellow'
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  isMobile: boolean = false;
  isRefreshing = false

  constructor(
    private dataServe: DataHandlerService,
    private location: Location,
    private authService: AuthserviceService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.isMarketRoute =
    this.router.url.includes('/market') ||
    this.router.url.includes('/mob-match-cupwinner') ||
    this.router.url.includes('/premium-parlay');

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMarketRoute = event.url.includes('/market') || event.url.includes('/mob-match-cupwinner') || event.url.includes('/premium-parlay');
        this.menu = false
      }
    });

    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.img = this.webdata?.imageData?.headers?.[0]?.logo?.replace(' ', '%20')
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing=this.jsonWeblinksdt?.validShowing;
    }

    let data = localStorage.getItem('userData');
    if (data) {
      this.loginResData = JSON.parse(data);
      this.balInfo = this.loginResData.myBalance;
      this.expoInfo = this.loginResData.exposureLimit;
      this.userName = this.loginResData.userid;
    }
    this.dataServe.betSuccessMsg.subscribe((res) => {
      if (res[0] == true) {
        this.upDateBalance()
      }
    })

    this.authService.sendLoggedData2.subscribe((re: any) => {
      this.errMsg = re
    })

    const validToken = localStorage.getItem('token');
    if (validToken !== null) {
      this.loggedIn = true;
      //  this.dataServe.getActiveLiabUserWise().subscribe((res:a ny)=>{
      //   this.currentBets = res?.length || 0
      //  })
    } else {
      this.loggedIn = false;
    }
  }
  singupLink(){
    window.open(this.jsonWeblinksdt?.signupContent, '_blank');
  }

  openMenu() {
    this.menu = !this.menu
  }
  close() {
    this.menu = false
  }

  goBack(): void {
    window.history.back();
  }

  showpwd() {
    this.showpwrd = !this.showpwrd
  }

  ngAfterViewInit() {
    const validToken = localStorage.getItem('token');
    if (validToken !== null) {
      this.upDateBalance();
    }
  }


  logout() {
    this.authService.sendLoggedData1.subscribe((res: any) => {
      this.loggedIn = res;
    })

    this.authService.logout()
  }


  upDateBalance() {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    this.dataServe.getBalInfo().subscribe((res: any) => {
      this.balInfo = res.balance;
      this.expoInfo = res.expo;
      this.refreshBtn = true;
      setTimeout(() => {
        this.refreshBtn = false;
        this.isRefreshing = false;
      }, 500);
    }, () => {
      this.isRefreshing = false;
    });
  }


  numberOnly(event: any):any {
    var regex = new RegExp("^[a-zA-Z0-9]+$");
    var regex2 = new RegExp(/^[0-9]{1,4}$/);
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
    if (!regex2.test(key)) {
      event.preventDefault();
      return false;
    }
  }

  openSignup(url: string | undefined) {
    if (url) window.location.href = url;
  }
}


