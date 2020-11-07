import { Component, OnInit } from '@angular/core';  
import { Router } from '@angular/router';
import {UserService} from '../shared/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: []
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  goToEditor() {
    this.router.navigate(['/editorhome']);
  }

  userLogout() {
    this.userService.deleteToken();
    this.router.navigateByUrl('/home');
  }

}
