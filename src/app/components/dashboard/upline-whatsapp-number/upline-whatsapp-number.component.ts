import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from 'src/app/services/datahandler.service';
import { CommonModule, Location } from '@angular/common';
import { StakeSettingsComponent } from '../../stake-settings/stake-settings.component';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-upline-whatsapp-number',
  templateUrl: './upline-whatsapp-number.component.html',
  styleUrls: ['./upline-whatsapp-number.component.css'],
  standalone:true,
  imports:[StakeSettingsComponent,CommonModule,LoaderComponent],
})
export class UplineWhatsappNumberComponent implements OnInit{
  balInfo: any;
  webdata: any;
  jsonWebdt: any;
  jsonWeblinksdt: any;
  validShowing: any;
  loading=true;
  number:any;
  isCopied = false;
  isClassicTheme = false;

  constructor(private dataServe : DataHandlerService,private location: Location) { }

  ngOnInit(): void {
    this.dataServe.changeTheme$.subscribe({
      next:(f) => this.isClassicTheme = f,
    })
    this.dataServe.getBalInfo().subscribe((res : any)=>{
      this.balInfo = res;
    })

    let wData = localStorage.getItem("webData")
    if(wData){
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.jsonWebdt = JSON.parse(this.webdata.theme)
      this.jsonWeblinksdt = JSON.parse(this.webdata.links)
      this.validShowing=this.jsonWeblinksdt?.validShowing;
    }

    this.getUplineContact();
  }

  getUplineContact() {
    this.loading = true;
    this.dataServe.getUplineContact().subscribe((res: any) => {
      this.number=res;
      this.loading = false;
    });
  }

  copyToClipboard(data: string): void {
    const url = data;
    navigator.clipboard.writeText(url).then(() => {
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }

  goBack(): void {
    this.location.back();
  }
}
