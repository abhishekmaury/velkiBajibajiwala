import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import SwiperCore, { Autoplay, Pagination, Navigation, SwiperOptions, Swiper } from 'swiper';

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-market-widget',
  templateUrl: './market-widget.component.html',
  styleUrls: ['./market-widget.component.css']
})
export class MarketWidgetComponent implements OnInit {
  @Output() closeWidget = new EventEmitter()
  @Input() gameList: any;
  bottomList = true;
  @Input() eventid: any;
  sportId : any;

  constructor(private dataServe: DataHandlerService, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.bottomList = (event.url.includes('/market'))
      }
    });
  }

  navgateMatch(list: any) {
    this.router.navigate([`/market/${list?.sportid}/${list?.marketid}`]);
    setTimeout(() => {
      window.location.reload();
    }, 100);

  }
  closeBottomList() {
    this.bottomList = false;
    this.closeWidget.emit(false);
    this.dataServe?.getMatchSportID(false)
  }
  ngAfterViewInit(): void {
    new Swiper('.swiper-container7', {
      pagination: {
        clickable: true,
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      allowTouchMove:true,
      navigation: {
        nextEl: '.custom-swiper-button-next',
        prevEl: '.custom-swiper-button-prev',
      },

      breakpoints: {
        0: {
          slidesPerView: 3,
          spaceBetween: 5,
        },
        600: {
          slidesPerView: 3,
          spaceBetween: 5,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 5,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 5,
        },
      },
    });
  }
}
