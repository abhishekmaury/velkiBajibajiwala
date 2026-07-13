import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MarqueeComponent implements OnInit {
  usermessage: any;
  constructor(private dataServe: DataHandlerService) { }

  exchangeStyles = [
    'assets/css/style.css',
    'assets/css/style2.css',
    'assets/css/newstyle.css'
  ];

  ngOnInit() {
    this.exchangeStyles.forEach((href, i) => {
      if (!document.getElementById(`exchange-style-${i}`)) {
        const link = document.createElement('link');
        link.id = `exchange-style-${i}`;
        link.rel = 'stylesheet';
        link.href = href;
        document.head.prepend(link);
      }
    });
  }

  ngOnDestroy() {
    this.exchangeStyles.forEach((_, i) => {
      document.getElementById(`exchange-style-${i}`)?.remove();
    });
  }
}
