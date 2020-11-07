import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module'; 
import { AppComponent } from './app.component'; 
import { LoginComponentComponent } from './login-component/login-component.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 
import { DropdownModule } from 'angular-bootstrap-md';
import { EditorhomeComponent } from './editorhome/editorhome.component';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import {AuthGuard} from './auth/auth.guard';
import {AuthInterceptor} from './auth/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent, 
    LoginComponentComponent, HomeComponentComponent, DashboardComponent, EditorhomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ColorPickerModule,
    HttpClientModule,
    DropdownModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
