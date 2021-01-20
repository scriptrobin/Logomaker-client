import { Component, OnInit } from '@angular/core'; 
import emailjs, { init } from 'emailjs-com';


@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css', '../../assets/css/mobster.css']
})
export class HomeComponentComponent implements OnInit {
  Fullname;
  message;
  email;
  showAlert=false;
  showLoader=false;
  constructor() { }

  ngOnInit(): void {
    init("user_mGmCbS0Q2MsY74b1MkNGP");
  }

  sendEmail() { 
    const templateParams = {
      from_name: this.Fullname,
      to_name: this.email,
      message: this.message,
      reply_to: this.email
  };
  this.showAlert = false;
  this.showLoader=true;
  emailjs.send('service_58uagrn','template_cr340f5', templateParams)
      .then((response) => {
        this.showAlert = true;
        this.showLoader= false;
         setTimeout(()=> {
          this.showAlert = false;
         }, 1000);
         console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
         console.log('FAILED...', err);
      });
    }
}
