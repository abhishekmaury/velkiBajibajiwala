import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { MainFooterComponent } from '../../main-footer/main-footer.component';

@Component({
  selector: 'app-sponser5',
  templateUrl: './sponser5.component.html',
  styleUrls: ['./sponser5.component.css'],
  imports:[RouterLink,MainFooterComponent],
  standalone:true,
})
export class Sponser5Component {
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
