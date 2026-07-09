import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('500ms', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class LeagueComponent implements OnInit {
  popularMatch = false
  inPlayM = false
  activeTabId = 4;
  sportid = '4';
  seriesData: any;
  gameList: any;
  innerList: any;
  seariesName: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing = 'true';
  isloading = true;

  constructor(private dataserve: DataHandlerService, private route: Router) { }

  ngOnInit(): void {
    // this.isloading = true;

    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(d1?.theme)
      this.jsonWeblinksdt = JSON.parse(d1?.links)
      this.validShowing = this.jsonWeblinksdt.validShowing;
    }
    this.dataserve.getGameList(this.sportid).subscribe((res: any) => {
      this.gameList = res;
      setTimeout(() => {
        this.isloading = false;

      }, 1000);
      this.organizedData()
    })
  }
  organizedData() {
    this.seriesData = this.dataserve.getOrganizedDataBySeriesname(this.gameList);
  }
  onPopular() {
    this.popularMatch = !this.popularMatch
  }
  innerMatches(data: any) {
    this.isloading = true;
    this.seariesName = data?.seriesname;
    this.innerList = data?.matches;
    this.popularMatch = !this.popularMatch
    setTimeout(() => {
      this.isloading = false;
    }, 700);
  }

  setActiveTab(tabId: number) {
    this.isloading = true;
    this.activeTabId = tabId;
    this.dataserve.getGameList(tabId).subscribe((res: any) => {
      this.gameList = res;
      this.isloading = false;
      this.organizedData()
    })
  }

  inPlayMatches(data: any) {
    let date = data;
    let withinHrs = moment(date).format('MM/DD/YYYY HH:mm:ss');
    let date3 = new Date();
    let currentDate = moment(date3).tz('Asia/Kolkata').format('MM/DD/YYYY HH:mm:ss');

    if (moment(currentDate).isAfter(withinHrs)) {
      this.inPlayM = true
      return this.inPlayM;
    } else {
      this.inPlayM = false
      return this.inPlayM;
    }
  }

  openMatch(sportid: any, eventid: any, iscupwinner: any) {
    if (iscupwinner) {
      this.route.navigate(['/mob-match-cupwinner/' + sportid + '/' + eventid]);
    } else {
      this.route.navigate(['/market/' + sportid + '/' + eventid]);
    }
  }

}
