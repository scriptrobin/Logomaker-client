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
  userProfile;
  selectedTab='dashboard';
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.getUserProfile(); 
  }

  goToEditor() {
    this.router.navigate(['/editorhome']);
  }

  userLogout() {
    this.userService.deleteToken();
    this.router.navigateByUrl('/home');
  }

  getUserProfile() {
    this.userService.getUserProfile().subscribe((res)=> {
      this.userProfile = res["user"];
    });
  }

  changeTab(tab) {
    this.selectedTab = tab;
  }

}
