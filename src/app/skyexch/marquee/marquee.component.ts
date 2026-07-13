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

  ngOnInit() {

  }

}
