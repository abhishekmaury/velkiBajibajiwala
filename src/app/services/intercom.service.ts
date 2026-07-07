import { Injectable } from '@angular/core';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class IntercomService {

  boot(userId: string, userHash: string, anonymous_id:any) {
    if(userId!=''){
    window.intercomSettings = {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'qmraeqj3',
      user_id: userId,
      user_hash: userHash,
      anonymous_id : anonymous_id,
      hide_default_launcher: true
    };
  } else {
     window.intercomSettings = {
      api_base: 'https://api-iam.intercom.io',
      app_id: 'qmraeqj3',
      anonymous_id : anonymous_id,
      hide_default_launcher: true
    };
  }
    window.Intercom('boot', window.intercomSettings);
  }

  update(data: any) {
    window.Intercom('update', data);
  }

  shutdown() {
    window.Intercom('shutdown');
  }
}
