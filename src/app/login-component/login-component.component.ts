import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { UserService } from '../shared/user.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
  providers: [UserService]
})
export class LoginComponentComponent implements OnInit {
   emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   model = {
     email:'',
     password: ''
   }
   validMail;
   showLogIn = false;
   showRegister = false;
   aletMsg = 'Invalid Email address';
   selectedTab = "login";
  constructor(public userService: UserService, private router:Router) { }
  ngOnInit(): void {
    if(this.userService.isLoggedIn()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  showLoginorRegister(type) {
    this.model = {
      email:'',
      password: ''
    }
    this.showRegister = false; 
    this.validMail = null;
    this.aletMsg = 'Invalid Email address';
    this.selectedTab = type;
  }

  onRegister(form: NgForm) {
    this.validMail =  this.emailRegex.test(this.userService.SelectedUser.email);
    if(this.validMail) {
      this.userService.postUser(this.userService.SelectedUser).subscribe((res)=> {
        this.showRegister = true; 
        this.userService.SelectedUser.email = '';
        this.userService.SelectedUser.password = '';
        this.userService.SelectedUser.fullName = '';
      }, (err)=> {
        this.validMail = false;
        this.aletMsg=err.error[0]; 
      }); 
    }
    else {
      this.aletMsg = 'Invalid Email address';
    }
  }

  doLogin() {
    this.validMail =  this.emailRegex.test(this.model.email);
    if(this.validMail) {
      this.userService.login(this.model).subscribe((res) =>{
        this.showLogIn = true;
        this.userService.setToken(res['token']); 
        this.router.navigateByUrl('/dashboard');
      }, (err) =>{
        this.validMail = false;
        this.aletMsg = err.error.message;
      });
    }
  }

  

}
