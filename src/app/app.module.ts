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
import { AdsenseModule } from 'ng2-adsense';
import { ContactComponent } from './contact/contact.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [
    AppComponent, 
    LoginComponentComponent, HomeComponentComponent, DashboardComponent, EditorhomeComponent, ContactComponent, PrivacyComponent, TermsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ColorPickerModule,
    HttpClientModule,
    DropdownModule.forRoot(),
    AdsenseModule.forRoot({adClient: 'ca-pub-1805027111363232'}),
    NgbModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
