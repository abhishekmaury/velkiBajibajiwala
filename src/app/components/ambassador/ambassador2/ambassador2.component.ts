
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { MainFooterComponent } from '../../main-footer/main-footer.component';

@Component({
  selector: 'app-ambassador2',
  imports: [RouterLink,MainFooterComponent],
  templateUrl: './ambassador2.component.html',
  styleUrls: ['./ambassador2.component.css'],
  standalone:true
})
export class Ambassador2Component {
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
