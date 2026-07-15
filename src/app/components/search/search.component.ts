import { Component, Input } from '@angular/core';
import { HandlerService } from 'src/app/services/handler.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
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
  imports:[CommonModule,FormsModule],
})
export class SearchComponent {
  isOpen = false;
  @Input() gameslist: any;
  searchName = '';
  launchUrl: any;
  showErrPopup = false;
  errMsg: any;
  constructor(private popupService: HandlerService, private dataserve : DataHandlerService, private router :Router) {

  }

  ngOnInit(): void {
    this.popupService.openRegionState$.subscribe(state => {
      this.isOpen = state;
    });
  }
  closePopup() {
    this.popupService.closeSearch();
  }
  opencasinogamesmob(data: any) {
    this.popupService.closeSearch();
    let token = localStorage.getItem('token');
    if (token) {
      this.dataserve.LaunchCasinoGames(data.image_url).subscribe(
        (response: HttpResponse<any>) => {
          if (response.status == 200) {
            const res = response.body;
            this.launchUrl = res?.launchUrl;

            window.location.href = this.launchUrl;
          } else {
            const res = response.body;
            this.showErrPopup = true;
            this.errMsg = res.message;
          }
        },
        (error: any) => {
          this.showErrPopup = true;
          this.errMsg = error.message;
        }
      );
    } else {
      this.router.navigate(['/login']);
    }
    setTimeout(() => {
      this.showErrPopup = false;
    }, 3000)
  }
  get filteredUsers() {
    if (this.searchName.trim() === '') {
      return this.gameslist
    }
    const lowerCaseQuery = this.searchName.toLowerCase();
    return this.gameslist.filter((user: any) =>
      (user.matchname?.toLowerCase().includes(lowerCaseQuery) ||
       user.name?.toLowerCase().includes(lowerCaseQuery))
    );
  }
  openMatch(sportid: any, eventid: any, iscupwinner: any, isPremiumData:any) {
    if (iscupwinner) {
      this.router.navigate(['/mob-match-cupwinner/' + sportid + '/' + eventid]);
      this.popupService.closeSearch();
    } else if (isPremiumData) {
      this.router.navigate(['/premium-parlay/' + sportid + '/' + eventid]);
      this.popupService.closeSearch();
    } else {
      this.router.navigate(['/market/' + sportid + '/' + eventid]);
      this.popupService.closeSearch();
    }
  }
}
