import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { DataHandlerService } from '../services/datahandler.service';
@Injectable({
  providedIn: 'root',
})
export class ClassicThemeGuard implements CanActivate {
  constructor(
    private router: Router,
    private dataServe: DataHandlerService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) {
    if (
      state.url.startsWith('/exchange') &&
      !this.dataServe.isClassicTheme()
    ) {
      return this.router.createUrlTree(['/home'])
    } else if(state.url.startsWith('/sports') && this.dataServe.isClassicTheme()){
      return this.router.createUrlTree(['/home'])
    }
    return true;
  }
}
