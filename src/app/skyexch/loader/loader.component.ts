
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
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
