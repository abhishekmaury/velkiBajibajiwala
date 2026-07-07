import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-marquee',
  templateUrl: './marquee.component.html',
  styleUrls: ['./marquee.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MarqueeComponent implements AfterViewInit {

  // @HostListener('window:resize', ['$event'])
  usermessage: any;
  announcemntPopup = false;
  isLogin = false;

  @ViewChild('marqueeList') marqueeList!: ElementRef;

  constructor(private dataServe: DataHandlerService, private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    // const token = localStorage.getItem('token');

    // if (token) {
    // this.isLogin = true;

      this.dataServe.getMessageData().subscribe((res: any) => {
        this.usermessage = res?.data || [];
        this.cdr.detectChanges();
        setTimeout(() => this.setupMarquee(), 0);
      });
    // } else {
    //   this.isLogin = false;
    //   this.usermessage = [];
    // }
  }
  setupMarquee() {

    const listEl = this.marqueeList.nativeElement;
    // Duplicate content once
    if (listEl.dataset['duplicated'] !== 'true') {
      listEl.innerHTML += listEl.innerHTML;
      listEl.dataset['duplicated'] = 'true';
    }

    const contentWidth = listEl.scrollWidth / 2;
    const speed = 50; // px/sec
    const duration = contentWidth / speed;

    // reset & apply animation
    listEl.style.animation = 'none';
    void listEl.offsetWidth;
    listEl.style.animation = `scrollLeft ${duration}s linear infinite`;
  }

  clickonmarq() {
    if (!this.usermessage || this.usermessage.length === 0) {
      return;
    }
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      this.announcemntPopup = true
    } else {
      window.open('/announcement', '_blank');
    }
  }
  onMark() {
    if (!this.usermessage || this.usermessage.length === 0) {
      return;
    }
    this.announcemntPopup = !this.announcemntPopup;

  }
  closePopup() {
    this.announcemntPopup = false;
  }
}
