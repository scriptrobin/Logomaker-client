import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';  
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditorhomeComponent } from './editorhome/editorhome.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import {AuthGuard} from './auth/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponentComponent },
  { path: 'home', component: HomeComponentComponent }, 
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'editorhome/:id', component: EditorhomeComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'editorhome', component: EditorhomeComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'terms', component: TermsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
