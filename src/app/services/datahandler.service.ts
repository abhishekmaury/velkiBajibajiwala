import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import * as CryptoJS from 'crypto-js';
import { BehaviorSubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { IntercomService } from './intercom.service';

@Injectable({
  providedIn: 'root',
})

export class DataHandlerService implements OnInit {
  baseUrl = `https://ag.9xbet9.live/api-V2`;
  // baseUrl = `https://ag.${window.location.hostname}/api-V2`;
  secretKey = environment.secretKey;
  sendLoggedData: BehaviorSubject<any> = new BehaviorSubject('abc')
  sendLoggedData1 = new Subject<any>()
  emitRouteActive = new Subject<any>()
  sendLoggedData2 = new Subject<any>()
  sendLoggedData3 = new Subject<any>()
  sendSportidToWidget = new Subject<any>()
  logoutTimer = new Subject<any>()
  openLTV = new Subject<any>()
  oneClickB = new Subject<any>()
  betSuccessMsg = new Subject<any>()
  private countListenter = new Subject<any>();
  usersData: any;
  loginFlag: any;
  eventData: any;
  sessionTimeout: any;
  domain: any;

  base64DecodedString = environment.base64DecodedString
  encodedKey = CryptoJS.enc.Base64.parse(this.base64DecodedString);

  base64EncodedString = environment.base64EncodedString
  decodedKey = CryptoJS.enc.Base64.parse(this.base64EncodedString);
  
  private themeFlag = new Subject<any>();
  public changeTheme$ = this.themeFlag.asObservable();

  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService,private intercom: IntercomService) { }

  ngOnInit(): void {
  }
  getdomain() {
    let dname = window.location.hostname;
    return dname;
  }
  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    this.intercom.shutdown();
    this.router.navigate(['/home'])
  }

  token: any = localStorage.getItem("token")
  getGameCount() {
    return this.http.post(`${this.baseUrl}/getGamesCount`, {})
  }

  getGameListener() {
    return this.countListenter.asObservable();
  }

  getGameList(id: any) {
    return this.http.post(`${this.baseUrl}/getGamesList`, {
      sportId: id,
    });
  }

  getTodayGames() {
    return this.http.post(`${this.baseUrl}/getTodayGames`, {})
  }

  getTomorrowGames() {
    return this.http.post(`${this.baseUrl}/getTomorrowGames`, {})
  }

  getInPlayGames() {
    return this.http.post(`${this.baseUrl}/getInPlayGames`, {})
  }

  validateLogin(obj: any) {
    return this.http.post(`${this.baseUrl}/validateLogin`, obj).subscribe({
      next: (res: any) => {
      if (res.type !== 'error') {
        this.sendLoggedData.next(res)
        localStorage.setItem('loginTime', new Date().getTime().toString());
        localStorage.setItem('token', res.password)
        localStorage.setItem('userData', JSON.stringify(res))

        if (!res?.ispasswordChanged) {
          this.router.navigate(['/change-password'])
        } else if (res?.loginStamp == null || res?.loginStamp == 0) {
          // let ddt = this.decodejwt(res.password)
          // let dontshowagn = localStorage.getItem('DoNotShowAnnouncement');
          // if (dontshowagn === 'yes') {
             this.router.navigate(['/home'])
          // } else {
          //this.router.navigate(['/annoucement'])
          //}
        } else {
          // let ddt = this.decodejwt(res.password)
          // let dontshowagn = localStorage.getItem('DoNotShowAnnouncement');
          // if (dontshowagn === 'yes') {
          this.router.navigate(['/home'])
          // }
        }

        let dataa = this.decodejwt(res?.password)
        const date = new Date(dataa.exp * 1000);
        let convertedDate = this.formatDate(date);
        let expTkn = new Date(convertedDate)
        let checkExpToken = expTkn.getTime()
        this.init(checkExpToken)
        setTimeout(() => {
          window.location.reload()
        }, 100);
      } else {
        this.sendLoggedData2.next(res.message)
      }
    } , error: (err: any) => {
        if (err?.error?.message) {
          this.sendLoggedData2.next(err.error.message);
        } else {
          this.sendLoggedData2.next('Something went wrong. Please try again.');
        }
      }
    })
  }
  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  init(data: any) {
    this.sessionTimeout = data;
    const loginTimeStr = localStorage.getItem('loginTime');
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - loginTime;

      if (elapsedTime >= this.sessionTimeout) {
        // Logout if session expired
        this.logout();
        window.location.reload()
      } else {
        // Start timer to check session expiration
        setTimeout(() => this.checkSession(), this.sessionTimeout - elapsedTime);
      }
    }
  }

  private checkSession() {
    const loginTimeStr = localStorage.getItem('loginTime');
    if (loginTimeStr) {
      const loginTime = parseInt(loginTimeStr, 10);
      const currentTime = new Date().getTime();
      const elapsedTime = currentTime - loginTime;

      if (elapsedTime >= this.sessionTimeout) {
        // Logout if session expired
        this.logout();
        window.location.reload()

      } else {
        // Restart timer
        setTimeout(() => this.checkSession(), this.sessionTimeout - elapsedTime);
      }
    }
  }

  isLoggedIn() {
    return this.http.post(`${this.baseUrl}/isLoginValid`, {})
  }

  getBalInfo() {
    return this.http.post(`${this.baseUrl}/getUserBalanceExpo`, {});
  }
  getAccountStmt(pNo: any) {
    return this.http.post(`${this.baseUrl}/getBalanceOverView`, {
      "pageNo": pNo
    })
  }

  getActivityLog(pNo: any) {
    return this.http.post(`${this.baseUrl}/getAccountLogs`, {
      "pageNo": pNo
    })
  }

  getEventDataOnLoad(eventid: any) {
    return this.http.post(`${this.baseUrl}/getEventData`, {
      eventid: eventid,
    });
  }

  getEventDataOnLoadnew(eventid: any) {
    return this.http.post(`${this.baseUrl}/getEventDataOnLoad`, {
      eventid: eventid,
    });
  }

  getEventDataOnLoad2(eventid: any) {
    return this.http.post(`${this.baseUrl}/getPreLoadData?eventId=${eventid}`, {
    });
  }

  addToMultmarketList(eventId: any) {
    return this.http.post(`${this.baseUrl}/setMatchAsMultiMarket`, {
      eventid: eventId,
    });
  }

  getUserWiseMultiMarket() {
    return this.http.post(`${this.baseUrl}/getUserWiseMultiMarket`, {});
  }

  getUplineContact() {
    return this.http.post(`${this.baseUrl}/getUplineContact`, {});
  }

  getUserP2PStatus() {
    return this.http.post(`${this.baseUrl}/getUserP2PStatus`, {});
  }

  TransferP2P(walletId: any, amount: any, remark: any) {
    const payload = {
      walletId,
      amount,
      remark
    };
    return this.http.post(`${this.baseUrl}/TransferP2P`, payload, { observe: 'response' })
  }

  getUserP2PLogs(pageNo: any) {
    return this.http.post(`${this.baseUrl}/getUserP2PLogs?pageNo=${pageNo}`, {})
  }

  getUserBets() {
    return this.http.post(`${this.baseUrl}/getUserBets`, {});
  }

  changeYourPassword(obj: any) {
    return this.http.post(`${this.baseUrl}/changeLoginOwnPassword`, obj)
  }

  getBetHistory(obj: any) {
    return this.http.post(`${this.baseUrl}/getUsersBetHistory`, JSON.stringify(obj))
  }

  getListForResult(obj: any) {
    return this.http.post(`${this.baseUrl}/getListForResult?startDate=${obj.startDate}&endDate=${obj.endDate}&sportId=${obj.sportId}`, {})
  }

  getUserOwnProfitLoss(obj: any) {
    return this.http.post(`${this.baseUrl}/getUserOwnProfitLoss`, obj)
  }

  getUserBetsBySourceId(obj: any) {
    return this.http.post(`${this.baseUrl}/getUserBetsBySourceId`, obj)
  }

  getWebsiteData() {
    return this.http.post(`${this.baseUrl}/getWebsiteData`, {});
  }

  placeMatchOddsBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/placeMatchOddsBet`, {
      isBack: data.isBack,
      odds: data.odds,
      selectionId: Number(data.selectionId),
      selectionName: data.selectionName,
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId)
    });
  }

  setTossMatchBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/setTossMatchBet`, {
      isBack: data.isBack,
      odds: data.odds,
      selectionId: Number(data.selectionId),
      selectionName: data.selectionName,
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId),
      ipAddress: '182.69.177.136'
    });
  }

  placeBookMakerBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/placeBookMakerBet`, {
      isBack: data.isBack,
      odds: data.odds,
      selectionId: Number(data.selectionId),
      selectionName: data.selectionName,
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId)
    });

  }

  placeFancyMatchBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/placeFancyMatchBet`, {
      isBack: data.isBack,
      odds: Number(data.odds),
      priceValue: Number(data.selectionName),
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId),
      provider: data.fancyprovider.toLowerCase()
    });
  }

  setFancy1MatchBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/setFancy1MatchBet`, {
      isBack: data.isBack,
      odds: Number(data.odds),
      priceValue: Number(data.selectionName),
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId),
      provider: data.fancyprovider.toLowerCase()
    });
  }

  setPremiumMatchBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/setPremiumMatchBet`, {
      isBack: data.isBack,
      odds: Number(data.odds),
      selectionId: Number(data.selectionId),
      selectionName: data.selectionName,
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId),
      ipAddress: '182.69.177.136'
    });
  }

  setOtherMarketBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/setOtherMarketBet`, {
      isBack: data.isBack,
      odds: data.odds,
      selectionId: Number(data.selectionId),
      selectionName: data.selectionName,
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId),
      ipAddress: '182.69.177.136'
    });
  }

  setWinnerBet(data: any, stake: any) {
    return this.http.post(`${this.baseUrl}/setWinnerBet`, {
      isBack: data.isBack,
      odds: data.odds,
      selectionId: Number(data.selectionId),
      selectionName: data.selectionName,
      stake: Number(stake),
      matchName: data.matchName,
      eventId: data.eventId,
      sourceId: data.sourceId,
      sourceBetType: data.sourceBetType,
      sportId: Number(data.sportId)
    });
  }

  placeParlayBets(betlist: any, stake: any) {
    return this.http.post(`${this.baseUrl}/placeParlayBets`, {
      stake: Number(stake),
      betsList: betlist,
    });
  }

  getUserMatchBookData(eventid: any, type: any) {
    return this.http.post(`${this.baseUrl}/getUserMatchBookData`, {
      eventid: eventid,
      type: type
    })
  }

  getUserFancyBookData(eventid: any) {
    return this.http.post(`${this.baseUrl}/getUserFancyBookData`, {
      eventid: eventid
    })
  }

  getListBookData(sourceId: any) {
    return this.http.post(`${this.baseUrl}/getListBookData`, {
      fancyid: sourceId
    })
  }

  getPremiumFancyBook(eventid: any) {
    return this.http.post(`${this.baseUrl}/getPremiumFancyBook?eventid=${eventid}`, {
    })
  }

  editStake(editStkObj: any) {
    return this.http.post(`${this.baseUrl}/editStakes`, editStkObj)
  }

  getActiveLiabUserWise() {
    return this.http.post(`${this.baseUrl}/getActiveLiabUserWise`, {})
  }

  getActiveBetsUserWise(sourceId: any) {
    return this.http.post(`${this.baseUrl}/getActiveBetsUserWise?sourceId=${sourceId}`, {})
  }

  getUserUnmatchedBets() {
    return this.http.post(`${this.baseUrl}/getUserUnmatchedBets`, {})
  }

  getUnmatchedBetsUserWise(sourceId: any) {
    return this.http.post(`${this.baseUrl}/getUnmatchedBetsUserWise?sourceId=${sourceId}`, {})
  }

  LaunchAWCLobby() {
    return this.http.post(`${this.baseUrl}/AELOBBY`, {})
  }

  LaunchAWCGames(platform: any, gameType: any, gameCode: any) {
    return this.http.post(`${this.baseUrl}/LaunchAWCGames`, {
      platform: platform,
      gameType: gameType,
      gameCode: gameCode
    })
  }

  LaunchIntGames(gameId: any, gameCode: any) {
    return this.http.post(`${this.baseUrl}/LaunchIntGames`, {
      gameId: gameId,
      gameCode: gameCode
    })
  }

  LaunchCasinoGames(data: any) {
    return this.http.post(`${this.baseUrl}${data}`, {}, { observe: 'response' })
  }

  getMessageData() {
    return this.http.post(`${this.baseUrl}/getMessageData`, {})
  }

  changeIsOneClickBetStatus() {
    return this.http.post(`${this.baseUrl}/changeIsOneClickBetStatus`, {})
  }

  getUserOneClickBet() {
    return this.http.post(`${this.baseUrl}/getUserOneClickBet`, {})
  }

  isActiveOneClickBet() {
    return this.http.post(`${this.baseUrl}/isActiveOneClickBet`, {})
  }

  saveOneClickBetData(data: any) {
    return this.http.post(`${this.baseUrl}/saveOneClickBetData`, data)
  }

  getSocketPath(){
    return this.http.post(`${this.baseUrl}/getUserSocketDetails`, {})
  }

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }
  decrypt(textToDecrypt: string) {
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }
  getloggedData(data: any) {
    this.usersData = data
    this.sendLoggedData.next(this.usersData);
  }
  getEventData(data: any) {
    this.eventData = data
    this.sendLoggedData.next(this.eventData);
  }
  getloginFlag(data: any) {
    this.loginFlag = data;
    this.sendLoggedData1.next(this.loginFlag)
  }
  openLiveTv(data: any) {
    this.openLTV.next(data)
  }
  oneClickBet(data: any) {
    this.oneClickB.next(data)
  }
  betSuccess(data: any, alldata: any, stake: any, msg: any) {
    let dataArr = [];
    dataArr.push(data, alldata, stake, msg)
    this.betSuccessMsg.next(dataArr)
  }
  betSuccessParlay(data: any, stake: any, msg: any) {
    let dataArr = [];
    dataArr.push(data, stake, msg)
    this.betSuccessMsg.next(dataArr)
  }
  getOrganizedDataBySeriesname(gameList: any[]): { seriesname: string, matches: any[] }[] {
    const organizedData: { seriesname: string, matches: any[] }[] = [];
    const seriesMap = new Map<string, any[]>();

    gameList.forEach(item => {
      if (!seriesMap.has(item.seriesname)) {
        seriesMap.set(item.seriesname, []);
      }
      seriesMap.get(item.seriesname)?.push(item);
    });

    seriesMap.forEach((matches, seriesname) => {
      organizedData.push({ seriesname, matches });
    });

    return organizedData;
  }
  updateFavicon(faviconUrl: any) {
    // const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    // const faviconElement: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
    // if (favicon) {
    //   favicon.href = faviconUrl;
    // }
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = faviconUrl;
    document.getElementsByTagName('head')[0].appendChild(link);

  }
  decodejwt(token: string): any {
    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      return null;
    }
  }

  getCasinoData(data: any) {
    return this.http.post(`https://designapi.ctfcgames.com/api/v1/casino/all-data`, data)
  }

  getProviderData(data: any) {
    return this.http.post(`https://designapi.ctfcgames.com/api/v1/casino/all-provider`, data)
  }

  getLiveData(data: any) {
    return this.http.post(`https://designapi.ctfcgames.com/api/v1/casino/type-images`, data)
  }

  decryptData(_0x5277x7: any) {
    const _0x5277x9 = CryptoJS.AES.decrypt(_0x5277x7, this.decodedKey, { mode: CryptoJS.mode.ECB });
    const _0x5277xa = _0x5277x9.toString(CryptoJS.enc.Utf8);
    return { data: JSON.parse(_0x5277xa) };
  }

  decryptData1(_0x5277x7: any) {
    const _0x5277x9 = CryptoJS.AES.decrypt(_0x5277x7, this.decodedKey, { mode: CryptoJS.mode.ECB });
    const _0x5277xa = _0x5277x9.toString(CryptoJS.enc.Utf8);
    return { data: _0x5277xa };
  }

  encryptData(requestData: any) {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(requestData),
      this.encodedKey,
      { mode: CryptoJS.mode.ECB }
    );
    return { data: encryptedData.ciphertext.toString(CryptoJS.enc.Base64) };
  }

  getTimeStamp() {
    let resp = {
      timeStamp: new Date().getTime().toString(),
      secretKey: this.randomString()
    }
    return resp;
  }

  randomString() {
    var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return [...Array(10)].reduce(a => a + p[~~(Math.random() * p.length)], '');
  }

  getParlayById(sourceId: any) {
    return this.http.post(`${this.baseUrl}/getParlayById?parlayId=${sourceId}`, {})
  }
  getMatchSportID(sportid: any) {
    this.sendSportidToWidget.next(sportid)
  }

  updateOwnProfileDetails(data: any) {
    return this.http.post(`${this.baseUrl}/updateOwnProfileDetails`, data)
  }

  loadMethodNumbers(data: any) {
    return this.http.post(`${this.baseUrl}/loadMethodNumbers`, data)
  }

  loadManualDWChannels(data: any) {
    return this.http.post(`${this.baseUrl}/loadManualDWChannels`, data)
  }

  createManualDepositRequest(data: any) {
    return this.http.post(`${this.baseUrl}/createManualDepositRequest`, data)
  }
  createManualWithdrawRequest(data: any) {
    return this.http.post(`${this.baseUrl}/createManualWithdrawRequest`, data, { observe: 'response' });
  }
  updateManualUserTransDetails(data: any) {
    return this.http.post(`${this.baseUrl}/updateManualUserTransDetails`, data)
  }

  getUserMatchListBookData(type: any) {
    return this.http.post(`${this.baseUrl}/getUserMatchListBookData`,
      { type: type }
    )
  }

  getCasinoSearchedData(data: any) {
    return this.http.post(`https://designapi.ctfcgames.com/api/v1/casino/search-casino`, data)
  }

  launchPremium(gameId: any, gameCode: any) {
    return this.http.post<any>(
      `${this.baseUrl}/launchPremium/${gameId}/${gameCode}`,
      {},
      { observe: 'response' }
    );
  }
  getReferralDetails() {
    return this.http.post(`${this.baseUrl}/getReferralDetails`, {})
  }
  getUserRefUsers() {
    return this.http.post(`${this.baseUrl}/getUserRefUsers`, {})
  }
  getUserCurrentRefPL() {
    return this.http.post(`${this.baseUrl}/getUserCurrentRefPL`, {})
  }
  getUserRebateData(data: any) {
    return this.http.post(`${this.baseUrl}/getUserRebateData`, data)
  }
  getIntercomData() {
    return this.http.post(`${this.baseUrl}/getChatToken`, {})
  }
  getThemeFlag(data : any){
    this.themeFlag.next(data)
  }
}

