import { Injectable } from '@angular/core';
import { DataHandlerService } from './datahandler.service';

@Injectable({
  providedIn: 'root'
})
export class GetSocketUrlService {
  config : any;

  constructor(private dataHandler : DataHandlerService) { }

  getSocketUrl(): Promise<void> {
    return new Promise((resolve) => {
      this.dataHandler.getSocketPath().subscribe({
        next: (res: any) => {
          this.config = res;
          resolve();
        },
        error: () => resolve()
      });
    });
  }

  get SocketUrls(): string {
    return this.config
  }
}
