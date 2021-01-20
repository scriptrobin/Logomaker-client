import { Injectable } from '@angular/core';
import {HttpHandler, HttpEvent, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserService} from '../shared/user.service'; 
@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private userService:UserService, private router:Router){}
    intercept(req: HttpRequest<any>, next: HttpHandler)   {
        if(req.headers.get('noAuth')) {
            return next.handle(req.clone());
        }
        else {
            const clonedReq = req.clone({
                headers: req.headers.set("Authorization", "Bearer "+this.userService.getToken())
            });
            return next.handle(clonedReq).pipe(
                tap(
                    event=>{},
                    err=>{ 
                        if(err.errors && err.errors.auth == false) {
                            this.router.navigateByUrl('/login');
                        }
                    }
                )
            )
        }
    }
}