import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';  
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorhomeComponent } from './editorhome/editorhome.component';
import {AuthGuard} from './auth/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponentComponent },
  { path: 'home', component: HomeComponentComponent }, 
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  // { path: 'editorhome', component: EditorhomeComponent, canActivate: [AuthGuard]}
  { path: 'dashboard', component: DashboardComponent},
  { path: 'editorhome', component: EditorhomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
