import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {User} from './user.model';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  SelectedUser: User = {
    fullName:'',
    email: '',
    password:''
  }
  noAuthHeader = { headers : new HttpHeaders({
    'noAuth': "true"
  }) };
  constructor(private http: HttpClient) { }

  postUser(user: User) {
    return this.http.post(environment.apiBaseUrl+'/register', user, this.noAuthHeader);
  }

  login(authcredentails) {
    return this.http.post(environment.apiBaseUrl+'/authenticate', authcredentails, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl+'/userProfile');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken(){
    localStorage.removeItem('token');
  }

  getUserPayLoad() {
    var token = localStorage.getItem('token');
    if(token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else {
      return null;
    }
  }

  isLoggedIn() {
    var userPayload = this.getUserPayLoad();
    if(userPayload){
      return userPayload.exp > Date.now()/1000;
    }
    else {
      return false;
    }
  }
}
