import { Injectable, OnInit } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable, Subject, forkJoin } from 'rxjs';
import { environment } from '../environments/environment';
import { DataHandlerService } from './datahandler.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as pako from 'pako';
import * as msgpack from 'msgpack-lite';
import { GetSocketUrlService } from './get-socket-url.service';

@Injectable({
  providedIn: 'root'
})

export class SocketServiceService implements OnInit{

  private url : any;
  public url2 : any;
  public sportId : any;
  public eventId : any;
  private socket:any;
  private socket2:any;
  private message: string | undefined;
  private messageUpdated = new Subject<{ message: any,eventId:any }>();
  private message2: string | undefined;
  private messageUpdated2 = new Subject<{ message2: any }>();
  private message3: string | undefined;
  private messageUpdated3 = new Subject<{ message3: any }>();
  private message4: string | undefined;
  private messageUpdated4 = new Subject<{ message4: any }>();
  private message5: string | undefined;
  private messageUpdated5 = new Subject<{ message5: any }>();
  private m1message: string | undefined;
  private m1messageUpdated = new Subject<{ m1message: any,eventId:any }>();

  constructor(private apiService:DataHandlerService,private getSocket: GetSocketUrlService,private route:ActivatedRoute) {
    var max_socket_reconnects = 6;
   }
  ngOnInit(): void { }

  public connectSocket(){
    this.url = this.getSocket.SocketUrls;
    this.socket = io(this.url.socket, {transports: ['websocket'],secure: true,rejectUnauthorized:false,autoConnect:true,reconnection:true});
    this.socket.on("connect", async () => {
      this.socket.on("disconnect", (err:any) => {
        this.socket.on("connect",async()=>{
          const eventId = localStorage.getItem("selectedEventId");
          if(eventId){
            this.setOdds(eventId);
            this.setmOdds(eventId);
            this.setBookMaker(eventId);
            this.setToss(eventId);
            this.setFancy(eventId);
          }
        })
      });
    });
  }

  public connectSocket2(data : any){
    this.sportId = data;
    if(this.sportId==4){
      this.url2 = this.url.cricket;
    } else if(this.sportId==2){
      this.url2 = this.url.tennis;
    } else if(this.sportId==1){
      this.url2 = this.url.soccer;
    }

    this.socket2 = io(this.url2, {transports: ['websocket'],secure: true,rejectUnauthorized:false,autoConnect:true,reconnection:true});
    this.socket2.on("connect", async () => {
      this.socket2.on("disconnect", (err:any) => {
        this.socket2.on("connect",async()=>{
          const eventId = localStorage.getItem("selectedEventId");
          if(eventId){
            this.setPremiumFancy(eventId);
          }
        })
      });
    });
  }


  public setOdds = (eventId:any) => {
    if(eventId != undefined){
    this.socket?.emit('Event/Auto', eventId);
    }
  }
  public getOdds(eventId: any): void {
    this.socket?.on(`Event/Auto/${eventId}`, (message: any) => {
      const decodedMessage = this.decodeSocketMessage(message);
      if (decodedMessage) {
        this.messageUpdated.next({
          message: decodedMessage,
          eventId: eventId
        });
      }
    });
  }
  getUpdateMessageListner() {
    return this.messageUpdated.asObservable();
  }


  public setmOdds = (eventId:any) => {
    if(eventId != undefined){
    this.socket?.emit('MEvent/Auto', eventId);
    }
  }
  public getmOdds = (eventId:any) => {
    this.socket?.on('MEvent/Auto/' + eventId, (message:any) => {
      this.m1message = this.decodeSocketMessage(message);
      this.m1messageUpdated.next({
        m1message: this.m1message,
        eventId:eventId
      });
    });
  }
  getUpdateMessageM1Listner() {
    return this.m1messageUpdated.asObservable();
  }


  public setBookMaker = (eventId:any) => {
    if(eventId != undefined){
      this.socket.emit('BookM/Auto', eventId);
    }
  }
  public getBookMaker = (eventId:any) => {
    this.socket.on('BookM/Auto/' + eventId, (message:any) => {
      this.message2 = this.decodeSocketMessage(message);
      this.messageUpdated2.next({
        message2: this.message2
      });
    });
  }
  getUpdate2MessageListner() {
    return this.messageUpdated2.asObservable();
  }


  public setToss = (eventId:any) => {
    if(eventId != undefined){
    this.socket?.emit('Toss/Auto', eventId);
    }
  }
  public getToss = (eventId:any) => {
    this.socket?.on('Toss/Auto/' + eventId, (message:any) => {
      this.message3 = this.decodeSocketMessage(message);
      this.messageUpdated3.next({
        message3: this.message3
      });
    });
  }
  getUpdate3MessageListner() {
    return this.messageUpdated3.asObservable();
  }


  public setFancy = (eventId:any) => {
    if(eventId != undefined){
    this.socket.emit('Fancy/Auto', eventId);
    }
  }
  public getFancy = (eventId:any) => {
    this.socket?.on('Fancy/Auto/' + eventId, (message:any) => {
      this.message4 = this.decodeSocketMessage(message);
      this.messageUpdated4.next({
        message4: this.message4
      });
    });
  }
  getUpdateFancyListner() {
    return this.messageUpdated4.asObservable();
  }


  public setPremiumFancy = (eventId:any) => {
    this.socket2.emit('PRMFancy/Auto', eventId);
  }
  public getPremiumFancy = (eventId:any) => {
    this.socket2.on('PRMFancy/Auto/'+eventId,(message:any)=>{
      this.message5 = this.decodeSocketMessage(message);
      this.messageUpdated5.next({
        message5: this.message5
      });
    });
  }
  getUpdatePRMFancyListner() {
    return this.messageUpdated5.asObservable();
  }

   private decodeSocketMessage(message: any): any {
    try {
      const compressed = new Uint8Array(message);
      const decompressed = pako.inflate(compressed);
      const decoded = msgpack.decode(decompressed);
      return decoded;
    } catch (error) {
      console.error('Error decoding message:', error);
      return null;
    }
  }


  public destorySocket = (eventId:any) => {
    localStorage.removeItem('selectedEventId')
    this.socket?.off('Event/Auto/' + eventId);
    this.socket?.off('MEvent/Auto/' + eventId);
    this.socket?.off('BookM/Auto/' + eventId);
    this.socket?.off('Toss/Auto/' + eventId);
    this.socket?.off('Fancy/Auto/' + eventId);
    this.socket2?.off('PRMFancy/Auto/' + eventId);
    //this.socket?.emit('destroy_room',eventId);
    this.socket?.disconnect();
    this.socket2?.disconnect();
    this.socket?.close();
    this.socket2?.close();
  }

  public destroySocketMultiple = () => {
    this.socket?.disconnect();
    this.socket2?.disconnect();
    this.socket?.close();
    this.socket2?.close();
    localStorage.removeItem('selectedEventId')
  }

  public destorySocket2() {
    this.socket?.close();
    this.socket?.disconnect();
  }

}





