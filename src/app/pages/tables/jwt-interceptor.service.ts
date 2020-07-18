import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptorService implements HttpInterceptor {

  JWTtoken;
  constructor(private authService: NbAuthService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.JWTtoken = token.getValue();
      }
    });
  }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

      let authReq = req;

      // console.log("intercept");
      if (this.JWTtoken != null) {
        authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + this.JWTtoken) });
      }
      return next.handle(authReq);
    }


}

