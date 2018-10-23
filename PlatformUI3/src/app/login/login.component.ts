import { Component, OnInit } from '@angular/core';
import { LoginService } from '@insights/app/login/login.service'
import { AppConfig } from '@insights/common/app.config'
import { RestAPIurlService } from '@insights/common/rest-apiurl.service'
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


export interface ILoginComponent {
  createAndValidateForm(): void;
  userAuthentication(): void;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, ILoginComponent {

  self;
  logMsg: string;
  isLoginError: boolean;
  isDisabled: boolean;
  showThrobber: boolean = false;
  cookies: string;
  username: string;
  password: string;
  imageSrc: string = "";
  resourceImage: any;
  loginForm: FormGroup;
  imageAlt: String = "";

  constructor(private loginService: LoginService, private restAPIUrlService: RestAPIurlService,
    private config: AppConfig, private restCallHandlerService: RestCallHandlerService,
    private cookieService: CookieService, private router: Router) {
    this.getAsyncData();

  }

  ngOnInit() {
    this.createAndValidateForm();
  }

  public createAndValidateForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  async getAsyncData() {
    try {
      var restCallUrl = this.restAPIUrlService.getRestCallUrl("GET_LOGO_IMAGE");
      console.log(restCallUrl);
      this.resourceImage = await this.restCallHandlerService.getJSON(restCallUrl);
      console.log(this.resourceImage)
      //console.log(this.resourceImage.data.encodedString.length)
      if (this.resourceImage.data.encodedString.length > 0) {
        this.imageSrc = 'data:image/jpg;base64,' + this.resourceImage.data.encodedString;
      } else {
        this.imageSrc = '/icons/svg/landingPage/CognizantLogo.svg';
        this.imageAlt = 'Cognizant log';
      }
    } catch (error) {
      console.log(error);
    }
  }

  public userAuthentication(): void {
    console.log(this.loginForm.value);
    console.log(this.loginForm.value.username + ' ' + this.loginForm.value.password);
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;
    if (this.username === '' || this.password === '') {
      this.logMsg = '';
    } else {
      var self = this;
      this.isDisabled = true;
      this.showThrobber = true;
      var token = 'Basic ' + btoa(this.username + ":" + this.password);
      this.loginService.loginUserAuthentication(this.username, this.password)
        .then((data) => {
          var grafcookies = data.data;
          if (data.status === 'SUCCESS') {
            self.showThrobber = false;
            var date = new Date();
            var dateDashboardSessionExpiration = new Date(new Date().getTime() + 86400 * 1000);
            var minutes = 30;
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            this.cookieService.set('Authorization', token, date);
            this.cookieService.set('DashboardSessionExpiration', dateDashboardSessionExpiration.toString());
            this.cookies = "";
            for (var key in grafcookies) {
              //this.cookies += key+ '=' +grafcookies[key];
              this.cookieService.set(key, grafcookies[key], date);
            }
            //self.$cookies.put('grafanaCookies',{'grafanaOrg':grafcookies.grafanaOrg,'grafanaRole':grafcookies.grafanaRole,'grafana_remember':grafcookies.grafana_remember, 'grafana_sess':grafcookies.grafana_sess, 'grafana_user':grafcookies.grafana_user});
            //self.$cookies.put('cookies', this.cookies);
            self.router.navigate(['/InSights/Home']);
            var uniqueString = "grfanaLoginIframe";
            var iframe = document.createElement("iframe");
            iframe.id = uniqueString;
            document.body.appendChild(iframe);
            iframe.style.display = "none";
            iframe.contentWindow.name = uniqueString;
            // construct a form with hidden inputs, targeting the iframe
            var form = document.createElement("form");
            form.target = uniqueString;
            form.action = "http://localhost:3000/login";
            //form.action = self.restEndpointService.getGrafanaHost() + '/login';
            //console.log(form.action);
            form.method = "POST";

            // repeat for each parameter
            var input = document.createElement("input");
            input.type = "hidden";
            input.name = "user";
            input.value = this.username;
            form.appendChild(input);

            var input1 = document.createElement("input");
            input1.type = "hidden";
            input1.name = "password";
            input1.value = this.password;
            form.appendChild(input1);

            var input2 = document.createElement("input");
            input2.type = "hidden";
            input2.name = "email";
            input2.value = '';
            form.appendChild(input2);

            document.body.appendChild(form);
            form.submit();
          } else if (data.error.message) {
            self.showThrobber = false;
            self.isLoginError = true;
            self.logMsg = data.error.message;
            self.isDisabled = false;
          }
        });
    }
  }

}
