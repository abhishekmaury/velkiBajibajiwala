import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-sponser5',
  templateUrl: './sponser5.component.html',
  styleUrls: ['./sponser5.component.css']
})
export class Sponser5Component {

  customOptions: OwlOptions = {
    loop: true,
    center: true,
    margin: 30,
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
