import { AfterViewInit, Component, OnDestroy, OnInit, HostListener, ViewEncapsulation } from '@angular/core';
import { AuthserviceService } from '../services/authservice.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from './footer/footer.component';
import { MyBetsComponent } from './my-bets/my-bets.component';
import { DataHandlerService } from '../services/datahandler.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skyexch',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, MyBetsComponent],
  templateUrl: './skyexch.component.html',
  styleUrls: ['./skyexch.component.css'],
  // encapsulation: ViewEncapsulation.Emulated
})
export class SkyexchComponent implements OnInit {
  validateapi: any;
  loggedData: any;
  userBalance: any;
  username: any;
  userLiability: any;
  updBal: any;
  refreshBtn = false
  popup: boolean = false;
  stakeArr: any;
  stake: any;
  //stake = {'stake1':'10', 'stake2':'20', 'stake3':'50', 'stake4':'100', 'stake5':'500', 'stake6':'1000'}
  editStakeContainer = true;
  editStakeHere = false;
  editStakesArr: any;
  openTv = false;
  accPopoup = false;
  oneClick = false;
  navigator = true;
  myBets = false;

  constructor(private dataserve: DataHandlerService, private authServe: AuthserviceService, private router: Router) { }
  ngOnInit(): void {

    
  }

  openbets() {
    this.myBets = !this.myBets
  }
}
