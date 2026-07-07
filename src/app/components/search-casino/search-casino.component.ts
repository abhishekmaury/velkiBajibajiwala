import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { HandlerService } from 'src/app/services/handler.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-search-casino',
  templateUrl: './search-casino.component.html',
  styleUrls: ['./search-casino.component.css'],
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
  ]
})
export class SearchCasinoComponent {
  searchName: string = '';
  searchSubject: Subject<string> = new Subject<string>();
  searchResults: any;
  private subscription: any;
  launchUrl: any;
  showErrPopup = false;
  errMsg: any;


  constructor(private popupService: HandlerService, private dataserve : DataHandlerService, private router :Router) {

    }
  ngOnInit(): void {
    // Subscribe to search changes with debounce
    this.subscription = this.searchSubject.pipe(
      debounceTime(30),              // wait 500ms after last keystroke
      distinctUntilChanged(),         // only emit if value changed
      switchMap((searchName: string) => this.dataserve.getCasinoSearchedData({ search_name: searchName })) // call your API
    ).subscribe((res: any) => {
      this.searchResults = res;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // clean up
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchName); // emit value to Subject
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
      // this.showErrPopup = false;
    }, 3000)
  }
}
