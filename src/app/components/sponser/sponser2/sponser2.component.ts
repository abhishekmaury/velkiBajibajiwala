import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-sponser2',
  templateUrl: './sponser2.component.html',
  styleUrls: ['./sponser2.component.css']
})
export class Sponser2Component {

  customOptions1 :OwlOptions= {
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
