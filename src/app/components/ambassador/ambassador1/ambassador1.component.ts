
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-ambassador1',
  imports: [CarouselModule, RouterLink],
  templateUrl: './ambassador1.component.html',
  styleUrls: ['./ambassador1.component.css'],
  standalone:true,
})
export class Ambassador1Component {
  customOptions :OwlOptions= {
    loop: true,
    center: true,
    margin : 30,
    mouseDrag: true,
    touchDrag: true,
    dots: false,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 3
      },
      600: {
        items: 3
      },
      1000: {
        items: 3
      }
    }
  }
}
