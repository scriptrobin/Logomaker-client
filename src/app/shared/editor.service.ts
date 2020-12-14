import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {environment} from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class commonService{
    noAuthHeader = { headers : new HttpHeaders({
        'noAuth': "true"
    }) };
    constructor(private http: HttpClient) { }

    postReq(url, data) {
        return this.http.post(environment.apiBaseUrl+url, data);
    }
}

