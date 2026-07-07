import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthserviceService } from '../services/authservice.service';

interface ApiResponse {
  type?: string;
  message?: string;
  title?: string;
}

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {

  constructor(private authServe :AuthserviceService ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

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

            // Check if the response body has a type property with value 'error'
            if (responseBody?.type === 'error' && responseBody?.message === 'Invalid Token') {
              localStorage.setItem('placebetcheck', 'false')
              this.authServe.logout();
            } else {
            }
          }
        }
      ),

    );

    // return next.handle(authReq);
  }
}
