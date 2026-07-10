import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MainFooterComponent } from '../../main-footer/main-footer.component';
import Swiper from 'swiper';

@Component({
  selector: 'app-sponser2',
  templateUrl: './sponser2.component.html',
  styleUrls: ['./sponser2.component.css'],
  imports:[RouterLink,MainFooterComponent],
  standalone:true,
})
export class Sponser2Component {
  ngAfterViewInit() {
    new Swiper('.swiper-container', {
      slidesPerView: 2.84,
      centeredSlides: true,
      spaceBetween: 10,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
      pagination: {
        clickable: true,
      },
      navigation: {
        nextEl: '.custom-swiper-button-next',
        prevEl: '.custom-swiper-button-prev',
      },
    });
  }
}
