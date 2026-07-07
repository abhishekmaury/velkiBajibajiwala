import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
@Injectable({
   providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {
   constructor(private router: Router) { }
   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      if (localStorage.getItem('token') != undefined) {
      return true;
      }
   this.router.navigate(['/home']);
return false;
}

}
