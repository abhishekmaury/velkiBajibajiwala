import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { HandlerService } from 'src/app/services/handler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bet-place',
  templateUrl: './bet-place.component.html',
  styleUrls: ['./bet-place.component.css'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms ease-in-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ],
  standalone:true,
  imports:[CommonModule]
})

export class BetPlaceComponent implements OnInit{
  @Input() clsClr : any
  @Input() data : any
  @Input() updOddsBack : any
  @Input() updOddsLay : any
  @Input() socketEventData : any
  @Input() isInplay : any;
  @Input() minLimit : any;
  @Input() maxLimit : any;
  @Input() lowLiquidity : any;
  @Input() totalMatched : any;
  @Output() betResult = new EventEmitter()
  @Output() stopTimer = new EventEmitter()
  closeBet = true;
  counterBet :any ;
  loginResData: any;
  stakeArr : any;
  loading: boolean = false;
  successBet: boolean = false;
  failedBet: boolean = false;
  profit : any[] = []
  oddminStake : any;
  oddmaxStake : any;
  oddsLimit : any;
  inplay : any;
  selectedodds : any;
  oddsPnlArray : any[] = []
  bmPnlArray : any[] = []
  fancyLiability : any[] = [];
  jsonWebdt: any;
  webdata: any;
  limitData: any = null;

  stake = {'stake1':'10', 'stake2':'20', 'stake3':'50', 'stake4':'100', 'stake5':'500', 'stake6':'1000'};
  numPadArr = [1,2,3,4,5,6,7,8,9,0,'00','.']
  stakeNumPad = [1,2,3,4,5,6,7,8,9,'',0,]
  enableBtn = false;
  isBack=false
  isOpen = false;
  st: any;
  @ViewChild('betComponent') betComponent!: ElementRef;
  stakesetting = false;
  stakeFocusnum = 1;

  constructor( private router : Router, private dataServe: DataHandlerService,private popupService:HandlerService){}

  ngOnChanges() {
    if (!this.limitData && this.socketEventData?.markets?.length) {
      this.limitData = this.socketEventData.markets[0].limit[0];
    }
  }

  ngOnInit(): void {
    this.popupService.popupBetstate$.subscribe(state => {
      this.isOpen = state;
    });

    this.profit.push(this.data)

    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
    }

    let data1 = localStorage.getItem('updatedStake');
    let data = localStorage.getItem('userData');
    if(data1){
      this.loginResData = JSON.parse(data1);
      this.stakeArr = this.loginResData;
    }else if(data){
      this.loginResData = JSON.parse(data);
      this.stakeArr = this.loginResData.stake;
    }else{
      this.stakeArr = this.stake;
    }

    if(this.data[0].sourceBetType==='Odds') {
      if(this.minLimit == undefined && this.maxLimit == undefined){
        this.dataServe.getEventDataOnLoadnew(this.socketEventData?.eventId).subscribe((res: any) => {
          this.lowLiquidity = res?.lowLiquidity;
          if(res.limits!='NONE' && res.limits?.commonOddsLimit?.limitProvider=='Website'){
            if(this.isInplay == true){
              this.minLimit = res.limits?.commonOddsLimit?.minLimit;
              this.maxLimit = res.limits?.commonOddsLimit?.maxLimit;
            } else {
              this.minLimit = res.limits?.commonOddsLimit?.preminLimit;
              this.maxLimit = res.limits?.commonOddsLimit?.premaxLimit;
            }
          } else {
            if(res.limits=='NONE' || res.limits?.commonOddsLimit?.limitProvider=='Central'){
              if(this.isInplay == true){
                this.minLimit = this.socketEventData?.markets[0].limit[0].minStake;
                this.maxLimit =this.socketEventData?.markets[0].limit[0].maxStake;
              } else {
                this.minLimit = this.socketEventData?.markets[0].limit[0].preMinStake;
                this.maxLimit = this.socketEventData?.markets[0].limit[0].preMaxStake;
              }
            }
          }
        });
      }
    }
  }

  addStakValue(val : any, tr:any){
    this.enableBtn = tr
     const numVal = Number(val);
    const numCounter = Number(this.counterBet) || 0; // fallback if undefined

    this.counterBet = numCounter + numVal;
    this.oddsbetCalculation(this.counterBet)
    return this.counterBet
  }

  cancelBet(){
    this.closeBet = false
    this.counterBet = 0
    this.betResult.emit(this.closeBet)
    return this.counterBet
  }
  minusCounter(tr:any){
    if(this.counterBet > 0){
      this.counterBet -= 5;
      this.oddsbetCalculation(this.counterBet)
      return this.counterBet
    }else if(this.counterBet){
      this.counterBet = 0;
      this.oddsbetCalculation(this.counterBet)
      return this.counterBet
    }
  }
  plusCounter(tr:any){
    this.enableBtn = tr
    if(this.counterBet == undefined){
      this.counterBet = 10
      this.oddsbetCalculation(this.counterBet)
      return this.counterBet
    }
    this.counterBet += 5;
    this.oddsbetCalculation(this.counterBet)
    return this.counterBet
  }
  addStaticVal1(num : any, tr:any){
    this.enableBtn = tr
    if(this.counterBet == undefined){
      this.counterBet = num
      this.oddsbetCalculation(+this.counterBet)
      return this.counterBet
    }else{
      this.counterBet = `${this.counterBet}${num}`
      this.oddsbetCalculation(+this.counterBet)
      return this.counterBet
    }
  }
  deleteLastNum(){
    this.counterBet = +this.counterBet.toString().slice(0, -1);
    this.oddsbetCalculation(this.counterBet)
  }

  oddsbetCalculation(stakes :any) {
    this.data.push(stakes)
    this.betResult.emit(this.data)
    this.data.pop()
  }

  placeBetFunc(){
    this.loading = true;
    this.stopTimer.emit(this.loading)
    let token = localStorage.getItem('token')
    if(token){

    this.selectedodds = this.data[0].odds;

    let betcheck =  localStorage.getItem('placebetcheck')
    if(betcheck=='false' || betcheck==null){

      if(this.data[0].sourceBetType==='Odds'){

        if(this.totalMatched>this.lowLiquidity){

          if(this.socketEventData.status==true){

            if((this.socketEventData.markets[0].marketName=='Match Odds') && (this.socketEventData.markets[0].status==true)){

              this.oddsLimit = this.socketEventData.markets[0].limit[0].oddsLimit;
              this.oddminStake = this.minLimit;
              this.oddmaxStake = this.maxLimit;

              if((this.oddminStake<=this.counterBet) && (this.oddmaxStake>=this.counterBet)){

                if(this.oddsLimit>=this.selectedodds)
                {
                  if(this.data[0].isBack==true){

                    if((this.updOddsBack>=this.data[0].odds) && ((this.updOddsBack-this.data[0].odds)<=0.05)){

                      if(this.data[0].odds){
                        localStorage.setItem('placebetcheck', 'true')
                        this.dataServe.placeMatchOddsBet(this.data[0],this.counterBet).subscribe((res: any) => {
                          if(res.type === 'success'){
                            this.closeBet = false;
                            this.successBet = true;
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                          }else{
                            this.closeBet = false;
                            this.loading = false;
                            this.successBet = false
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                          }
                          localStorage.setItem('placebetcheck', 'false')
                        }, (error) => {
                          if (error.status == 429) {
                            this.closeBet = false;
                            this.loading = false;
                            this.successBet = false;
                            let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                          } else {
                            this.closeBet = false;
                            this.loading = false;
                            this.successBet = false;
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                          }
                          localStorage.setItem('placebetcheck', 'false')
                        })
                      } else {
                        this.closeBet = false;
                        this.loading = false;
                        this.successBet = false;
                        let res = {"type":"error","message":"Something went wrong","title":"Oops..."};

                        this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                      }
                    } else {

                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)

                    }

                  } else {

                    if((this.updOddsLay<=this.data[0].odds) && (this.data[0].odds-this.updOddsLay)<=0.05){

                      if(this.data[0].odds){
                        localStorage.setItem('placebetcheck', 'true')
                        this.dataServe.placeMatchOddsBet(this.data[0],this.counterBet).subscribe((res: any) => {
                          if(res.type === 'success'){
                            this.closeBet = false;
                            this.successBet = true;
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                          }else{
                            this.closeBet = false;
                            this.loading = false;
                            this.successBet = false
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                          }
                          localStorage.setItem('placebetcheck', 'false')
                        }, (error) => {
                          if (error.status == 429) {
                            this.closeBet = false;
                            this.loading = false;
                            this.successBet = false;
                            let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                          } else {
                            this.closeBet = false;
                            this.loading = false;
                            this.successBet = false;
                            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                          }
                          localStorage.setItem('placebetcheck', 'false')
                        })
                      } else {
                        this.closeBet = false;
                        this.loading = false;
                        this.successBet = false;
                        let res = {"type":"error","message":"Something went wrong","title":"Oops..."};

                        this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                      }

                    } else {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    }
                  }
                } else {
                  this.closeBet = false;
                  this.loading = false;
                  this.successBet = false;
                  let res = {"type":"error","message":"Max odds limit is "+this.oddsLimit,"title":"Oops..."};

                  this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                }

              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = {"type":"error","message":"Stake limit is between "+this.oddminStake+" to "+this.oddmaxStake,"title":"Oops..."};

                this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = {"type":"error","message":"Market ID is Inactive","title":"Oops..."};

              this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
            }

          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = {"type":"error","message":"Match is Inactive","title":"Oops..."};

            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
          }
        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = {"type":"error","message":"Low Liquidity Game","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }
      } else if(this.data[0].sourceBetType==='BooKMaker'){

        if(this.socketEventData.status==true){

          if((this.socketEventData.markets[0].marketName=='Bookmaker') && (this.socketEventData.markets[0].status==true)){

            this.oddsLimit = this.socketEventData.markets[0].limit[0].oddsLimit;
            this.selectedodds=(this.data[0].odds/100);

            this.oddminStake = this.minLimit;
            this.oddmaxStake = this.maxLimit;

            if((this.oddminStake<=this.counterBet) && (this.oddmaxStake>=this.counterBet)){

              if(this.oddsLimit>=this.selectedodds){

                if(this.data[0].isBack==true){
                  // if((this.updOddsBack>=this.data[0].odds) && ((this.updOddsBack-this.data[0].odds)<=0.05)){
                  if (this.data?.[0]) {
                    this.data[0].odds = this.updOddsBack;
                  }
                    if(this.data[0].odds){
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.placeBookMakerBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }else{
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    } else {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = {"type":"error","message":"Something went wrong","title":"Oops..."};

                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    }

                  // } else {
                  //   this.closeBet = false;
                  //   this.loading = false;
                  //   this.successBet = false;
                  //   let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                  //   this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  // }

                } else {

                  // if((this.updOddsLay<=this.data[0].odds) && (this.data[0].odds-this.updOddsLay)<=0.05){
                   if (this.data?.[0]) {
                    this.data[0].odds = this.updOddsLay;
                  }
                    if(this.data[0].odds){
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.placeBookMakerBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    } else {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = {"type":"error","message":"Something went wrong","title":"Oops..."};

                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    }

                  // } else {
                  //   this.closeBet = false;
                  //   this.loading = false;
                  //   this.successBet = false;
                  //   let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                  //   this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  // }
                }
              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = {"type":"error","message":"Max odds limit is "+(this.oddsLimit*100),"title":"Oops..."};

                this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = {"type":"error","message":"Stake limit is between "+this.oddminStake+" to "+this.oddmaxStake,"title":"Oops..."};

              this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
            }
          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = {"type":"error","message":"Market ID is Inactive","title":"Oops..."};

            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
          }

        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = {"type":"error","message":"Match is Inactive","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }

      } else if(this.data[0].sourceBetType==='Toss'){

        if(this.socketEventData.status==true){

          if((this.socketEventData.markets[0].marketName=='Toss') && (this.socketEventData.markets[0].status==true)){

            this.oddsLimit = this.socketEventData.markets[0].limit[0].oddsLimit;

            this.oddminStake = this.minLimit;
            this.oddmaxStake = this.maxLimit;

            if((this.oddminStake<=this.counterBet) && (this.oddmaxStake>=this.counterBet)){

              if(this.oddsLimit>=this.selectedodds)
              {
                if(this.data[0].isBack==true){
                  if(this.data[0].odds){
                    localStorage.setItem('placebetcheck', 'true')
                    this.dataServe.setTossMatchBet(this.data[0],this.counterBet).subscribe((res: any) => {
                      if(res.type === 'success'){
                        this.closeBet = false;
                        this.successBet = true;
                        this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                      }else{
                        this.closeBet = false;
                        this.loading = false;
                        this.successBet = false
                        this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                      }
                      localStorage.setItem('placebetcheck', 'false')
                    }, (error) => {
                      if (error.status == 429) {
                        this.closeBet = false;
                        this.loading = false;
                        this.successBet = false;
                        let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                        this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                      } else {
                        this.closeBet = false;
                        this.loading = false;
                        this.successBet = false;
                        this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                      }
                      localStorage.setItem('placebetcheck', 'false')
                    })
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = {"type":"error","message":"Something went wrong","title":"Oops..."};

                    this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  }
                }
              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = {"type":"error","message":"Max odds limit is "+this.oddsLimit,"title":"Oops..."};

                this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = {"type":"error","message":"Stake limit is between "+this.oddminStake+" to "+this.oddmaxStake,"title":"Oops..."};

              this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
            }

          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = {"type":"error","message":"Market ID is Inactive","title":"Oops..."};

            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
          }

        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = {"type":"error","message":"Match is Inactive","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }

      } else if(this.data[0].sourceBetType==='Fancy'){

        if(this.socketEventData.status==true){

          if((this.socketEventData.markets[0].marketName=='Fancy') && (this.socketEventData.markets[0].status==true)){

            this.oddsLimit = this.socketEventData.markets[0].limit[0].oddsLimit;

            this.oddminStake = this.minLimit;
            this.oddmaxStake = this.maxLimit;

            if((this.oddminStake<=this.counterBet) && (this.oddmaxStake>=this.counterBet)){

              if(this.oddsLimit>=this.data[0].selectionName)
              {
                if(this.data[0].isBack==true){

                  if(this.updOddsBack==this.data[0].selectionName){
                    if(this.data[0].sourceBetType==='Fancy'){
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.placeFancyMatchBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }else{
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    }
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                    this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  }

                } else {
                  if(this.updOddsLay==this.data[0].selectionName){
                    if(this.data[0].sourceBetType==='Fancy'){
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.placeFancyMatchBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }else{
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    }
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                    this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  }
                }
              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = {"type":"error","message":"Max odds limit is "+this.oddsLimit,"title":"Oops..."};

                this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = {"type":"error","message":"Stake limit is between "+this.oddminStake+" to "+this.oddmaxStake,"title":"Oops..."};

              this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
            }

          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = {"type":"error","message":"Market ID is Inactive","title":"Oops..."};

            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
          }

        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = {"type":"error","message":"Match is Inactive","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }
      } else if(this.data[0].sourceBetType==='Fancy1'){
        if(this.socketEventData.status==true){

          if((this.socketEventData.markets[0].marketName=='Fancy') && (this.socketEventData.markets[0].status==true)){

            this.oddsLimit = (this.socketEventData.markets[0].limit[0].oddsLimit/10);

            this.oddminStake = this.minLimit;
            this.oddmaxStake = this.maxLimit;

            if((this.oddminStake<=this.counterBet) && (this.oddmaxStake>=this.counterBet)){

              if(this.oddsLimit>=(this.selectedodds-1))
              {
                if(this.data[0].isBack==true){

                  if(this.updOddsBack==this.data[0].odds){
                    if(this.data[0].sourceBetType==='Fancy1'){
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.setFancy1MatchBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }else{
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    }
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                    this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  }

                } else {

                  if(this.updOddsLay==this.data[0].odds){
                    if(this.data[0].sourceBetType==='Fancy1'){
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.setFancy1MatchBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }else{
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    }
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                    this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  }
                }
              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = {"type":"error","message":"Max odds limit is "+this.oddsLimit,"title":"Oops..."};

                this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = {"type":"error","message":"Stake limit is between "+this.oddminStake+" to "+this.oddmaxStake,"title":"Oops..."};

              this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
            }

          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = {"type":"error","message":"Market ID is Inactive","title":"Oops..."};

            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
          }

        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = {"type":"error","message":"Match is Inactive","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }
      } else if(this.data[0].sourceBetType==='Premium'){

        if(this.socketEventData.status==true){

          if((this.socketEventData.markets[0].marketName=='Premium Fancy') && (this.socketEventData.markets[0].status==true)){

            this.oddsLimit = this.socketEventData.markets[0].limit[0].oddsLimit;

            if(this.isInplay == true){
              this.oddminStake = this.socketEventData.markets[0].limit[0].minStake;
              this.oddmaxStake = this.socketEventData.markets[0].limit[0].maxStake;
            } else {
              this.oddminStake = this.socketEventData.markets[0].limit[0].preMinStake;
              this.oddmaxStake = this.socketEventData.markets[0].limit[0].preMaxStake;
            }

            if((this.oddminStake<=this.counterBet) && (this.oddmaxStake>=this.counterBet)){

              if(this.oddsLimit>=this.selectedodds)
              {
                if(this.updOddsBack==this.data[0].odds){
                  localStorage.setItem('placebetcheck', 'true')
                  this.dataServe.setPremiumMatchBet(this.data[0],this.counterBet).subscribe((res: any) => {
                    if(res.type === 'success'){
                      this.closeBet = false;
                      this.successBet = true;
                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    }else{
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false
                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    }
                    localStorage.setItem('placebetcheck', 'false')
                  }, (error) => {
                    if (error.status == 429) {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    } else {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                    }
                    localStorage.setItem('placebetcheck', 'false')
                  })
                } else {
                  this.closeBet = false;
                  this.loading = false;
                  this.successBet = false;
                  let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                  this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                }
              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = {"type":"error","message":"Max odds limit is "+this.oddsLimit,"title":"Oops..."};

                this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = {"type":"error","message":"Stake limit is between "+this.oddminStake+" to "+this.oddmaxStake,"title":"Oops..."};

              this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
            }

          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = {"type":"error","message":"Betting not available on this market","title":"Oops..."};

            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
          }

        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = {"type":"error","message":"Betting not available on this market","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }

      } else if(this.data[0].sourceBetType==='Other'){

        let afterSocketEveDt = this.socketEventData.markets.filter((dt:any)=>{
          if(dt.marketName==this.data[0].marketName){
            return dt;
          }
        })

        if(this.socketEventData.status==true){

          if(afterSocketEveDt[0].status==true){

            this.oddsLimit = afterSocketEveDt[0].limit[0].oddsLimit;

            this.oddminStake = this.minLimit;
            this.oddmaxStake = this.maxLimit;

            if((this.oddminStake<=this.counterBet) && (this.oddmaxStake>=this.counterBet)){

              if(this.oddsLimit>=this.selectedodds)
              {
                if(this.data[0].isBack==true){

                  if((this.updOddsBack>=this.data[0].odds) && ((this.updOddsBack-this.data[0].odds)<=0.05)){

                    if(this.data[0].odds) {
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.setOtherMarketBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }else{
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    } else {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = {"type":"error","message":"Something went wrong","title":"Oops..."};

                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    }
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                    this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  }
                } else {

                  if((this.updOddsLay<=this.data[0].odds) && (this.data[0].odds-this.updOddsLay)<=0.05){

                    if(this.data[0].odds){
                      localStorage.setItem('placebetcheck', 'true')
                      this.dataServe.setOtherMarketBet(this.data[0],this.counterBet).subscribe((res: any) => {
                        if(res.type === 'success'){
                          this.closeBet = false;
                          this.successBet = true;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }else{
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      }, (error) => {
                        if (error.status == 429) {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                        } else {
                          this.closeBet = false;
                          this.loading = false;
                          this.successBet = false;
                          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, error.error)
                        }
                        localStorage.setItem('placebetcheck', 'false')
                      })
                    } else {
                      this.closeBet = false;
                      this.loading = false;
                      this.successBet = false;
                      let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                    }
                  } else {
                    this.closeBet = false;
                    this.loading = false;
                    this.successBet = false;
                    let res = {"type":"error","message":"Odds Changed, Bet can't be placed","title":"Oops..."};

                    this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
                  }
                }
              } else {
                this.closeBet = false;
                this.loading = false;
                this.successBet = false;
                let res = {"type":"error","message":"Max odds limit is "+this.oddsLimit,"title":"Oops..."};

                this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
              }

            } else {
              this.closeBet = false;
              this.loading = false;
              this.successBet = false;
              let res = {"type":"error","message":"Stake limit is between "+this.oddminStake+" to "+this.oddmaxStake,"title":"Oops..."};

              this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
            }

          } else {
            this.closeBet = false;
            this.loading = false;
            this.successBet = false;
            let res = {"type":"error","message":"Market ID is Inactive","title":"Oops..."};

            this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
          }

        } else {
          this.closeBet = false;
          this.loading = false;
          this.successBet = false;
          let res = {"type":"error","message":"Match is Inactive","title":"Oops..."};

          this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
        }

      }
    } else {
      this.closeBet = false;
      this.loading = false;
      this.successBet = false;
      let res = {"type":"error","message":"Rapid Bets are not allowed","title":"Oops..."};
      this.dataServe.betSuccess(this.successBet,this.data[0],this.counterBet, res)
    }

    }else{
      this.router.navigate(['/login'])
    }
  }

  closePopup() {
    this.popupService.closeBetPopup();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.betComponent.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  openStakeSetting(){
    this.stakesetting = true
  }
  closeStake(){
    this.stakesetting = false
    let data1 = localStorage.getItem('updatedStake');
    let data = localStorage.getItem('userData');
    if(data1){
      this.loginResData = JSON.parse(data1);
      this.stakeArr = this.loginResData;
    }else if(data){
      this.loginResData = JSON.parse(data);
      this.stakeArr = this.loginResData.stake;
    }else{
      this.stakeArr = this.stake;
    }
  }
  stakeFocus(index : any){
    this.stakeFocusnum = index;
  }
  numpadnum(num : any){
    if(this.stakeFocusnum == 1){
      this.stakeArr.stake1 = `${this.stakeArr.stake1}${num}`
    }else if(this.stakeFocusnum == 2){
      this.stakeArr.stake2 = `${this.stakeArr.stake2}${num}`
    }else if(this.stakeFocusnum == 3){
      this.stakeArr.stake3 = `${this.stakeArr.stake3}${num}`
    }else if(this.stakeFocusnum == 4){
      this.stakeArr.stake4 = `${this.stakeArr.stake4}${num}`
    }
  }
  deleteLastNumStake(){
     if(this.stakeFocusnum == 1){
      this.stakeArr.stake1 = +this.stakeArr.stake1.toString().slice(0, -1);
    }else if(this.stakeFocusnum == 2){
      this.stakeArr.stake2 = +this.stakeArr.stake2.toString().slice(0, -1);
    }else if(this.stakeFocusnum == 3){
      this.stakeArr.stake3 = +this.stakeArr.stake3.toString().slice(0, -1);
    }else if(this.stakeFocusnum == 4){
      this.stakeArr.stake4 = +this.stakeArr.stake4.toString().slice(0, -1);
    }

  }

  updateStake(){
    let data ={
      stake1 : this.stakeArr.stake1,
      stake2 : this.stakeArr.stake2,
      stake3 : this.stakeArr.stake3,
      stake4 : this.stakeArr.stake4,
    }
    this.dataServe.editStake(data).subscribe((res : any)=>{
      // console.log(res);
      if(res){
        this.stakeArr = res;
        localStorage.setItem('updatedStake', JSON.stringify(res));
        this.stakesetting = false
      }

    })
  }
}

