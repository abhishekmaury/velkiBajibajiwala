import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatahandlerService } from '../../services/datahandler.service';

@Component({
  selector: 'app-parlay',
  imports:[CommonModule,RouterLink],
  templateUrl: './parlay.component.html',
  styleUrls: ['./parlay.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ParlayComponent {
  validateapi: any;
  cricdata: any;
  soccdata: any;
  tenndata: any;
  isLoading = false;
  marketList: any;
  // activeparle = 'Premium';
  mainTabs: any = 1;
  activeTab: any = 5;
  collpsDtl: number | null = null;
  gameList: any;
  totalCount: any;
  originalGameList: any[] = [];


  constructor(private dataServe: DatahandlerService, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getSportData();
    this.getMarketData();

    this.allMethods()
  }

  getSportData() {
    // let marketList1 = marketList || [];
    this.isLoading = true;
    let sectime = this.dataServe.getTimeStamp();
    let data = { "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    this.dataServe.verifyUser(data).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.getInPlayMatches(data).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 200) {
              let msd = this.dataServe.decryptData(error.error.text);
              this.gameList = msd.data.results;
              let tcount = this.gameList.filter((res: any) => res.isPremiumData == true)
              this.totalCount = tcount?.length
              this.originalGameList = [...this.gameList];
              if (this.mainTabs == 1) {
                if (this.activeTab == '4') {
                  this.gameList = this.gameList.filter((re: any) => {
                    return re.sportid == '4';
                  })
                } else if (this.activeTab == '2') {
                  this.gameList = this.gameList.filter((re: any) => {
                    return re.sportid == '2';
                  })
                } else if (this.activeTab == '1') {
                  this.gameList = this.gameList.filter((re: any) => {
                    return re.sportid == '1';
                  })
                }

              }
              this.isLoading = false;
              this.updateSportData()

            }
          })
        }
      }
    })
  }
  getMarketData() {
    let sectime1 = this.dataServe.getTimeStamp();

    let data1 = { "timeStamp": sectime1.timeStamp, "secretKey": sectime1.secretKey }

    this.dataServe.verifyUser(data1).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.getActiveMultiMarket(data1).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 202) {
              let msd = this.dataServe.decryptData(error.error.text);
              // this.marketList = msd.data.data;
              this.marketList = msd.data.data.map((rs: any) => rs.matchid);
              // this.getSportData()
            }
          })
        }
      }
    })
  }
  addToMultimarket(id: any) {
    this.isLoading = true;
    let sectime = this.dataServe.getTimeStamp();
    let data = { "matchId": id.marketid, "timeStamp": sectime.timeStamp, "secretKey": sectime.secretKey }

    this.dataServe.verifyUser(data).subscribe((res: any) => {
    }, (error) => {
      if (error.status == 200) {
        this.validateapi = this.dataServe.decryptData(error.error.text);
        if (this.validateapi.data.type == 'success') {
          this.dataServe.mutltiMatchUser(data).subscribe((res: any) => {
          }, (error) => {
            if (error.status == 202) {
              let msd = this.dataServe.decryptData(error.error.text);
              //console.log(msd, 'asdfasdf')
              this.getMarketData();
            } else {
              this.isLoading = false;
            }
          })
        }
      }
    })
  }
  filterBySportId(sportId: number): any[] {
    return this.originalGameList.filter((res: any) => res.sportid === sportId && res.isPremiumData == true);
  }

  updateSportData(): void {
    let cridata = this.filterBySportId(4);
    this.cricdata = cridata.sort((a, b) => a.openTimestamp - b.openTimestamp);

    let socdata = this.filterBySportId(1);
    this.soccdata = socdata.sort((a, b) => a.openTimestamp - b.openTimestamp);


    let tendata = this.filterBySportId(2);
    this.tenndata = tendata.sort((a, b) => a.openTimestamp - b.openTimestamp);

    this.gameList = this.gameList.filter((res: any) => res.isPremiumData == true)

  }
  searchpopup: boolean = false;
  openNotify: boolean = false;
  openSettingpopup: boolean = false;
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
    this.getSportData()


    this.collapseItm = true;
    this.expandedSectiongame = new Set<number>();

  }

  // collapseDetails(ind: any) {
  //   if (this.collpsDtl === ind) {
  //     this.collpsDtl = null;
  //   } else {
  //     this.collpsDtl = ind;
  //   }
  // }

  expandedSectiongame: Set<number> = new Set<number>();
  allMethods() {
    this.gameList?.forEach((_: any, index: number) => this.expandedSectiongame.add(index));
  }


  collapseItm = true;
  collapseItem() {
    this.collapseItm = !this.collapseItm
    if (this.collapseItm) {
      this.expandedSectiongame.clear();
    } else {
      this.gameList?.forEach((_: any, index: number) => this.expandedSectiongame.add(index));
    }
  }
  collapseDetails(ind: any) {
    this.collapseItm = true
    if (this.expandedSectiongame.has(ind)) {
      this.expandedSectiongame.delete(ind);
    } else {
      this.expandedSectiongame.add(ind);
    }
    this.updateAllButtonState();
  }
  updateAllButtonState(): void {
    let data = this.expandedSectiongame.size === this.gameList.length;

  }
}
