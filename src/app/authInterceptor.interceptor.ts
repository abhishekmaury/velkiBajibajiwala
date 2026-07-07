import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthserviceService } from './services/authservice.service';

interface ApiResponse {
  type?: string;
  message?: string;
  title?: string;
}

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private authServe : AuthserviceService, private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    let userDattaa = localStorage.getItem('userData');
    if(userDattaa){
      let isChangePass = JSON.parse(userDattaa)
      const hiddenRoutes = ['change-password'];
      let dt = hiddenRoutes.includes(this.router.url)
      if(isChangePass?.ispasswordChanged == false && dt == false){
        this.router.navigate(['/change-password']);
      }
    }

    let token = localStorage.getItem('token')

    const authReq = request.clone({
      setHeaders: {
        Auth: `${token}`,
      },
    });

    return next.handle(authReq).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            const responseBody: ApiResponse = event.body;
            if (responseBody?.type === 'error' && responseBody?.message === 'Invalid Token') {
              localStorage.setItem('placebetcheck', 'false')
              this.authServe.logout();
            } else {
            }
          }
        }
      ),
    );
  }
}
