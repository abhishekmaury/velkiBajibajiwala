import { Injectable } from '@angular/core';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class FingerprintService {

  async getFingerprint(): Promise<any> {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result;
  }
}
