import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';

@Component({
  selector: 'app-sponser3',
  templateUrl: './sponser3.component.html',
  styleUrls: ['./sponser3.component.css'],
  imports:[RouterLink],
  standalone:true,
})
export class Sponser3Component {
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
