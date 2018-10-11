import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service'
import { RestEndpointService } from '../services/rest-endpoint.service'
import { RestAPIurlService } from '../services/rest-apiurl.service'
import { RestCallHandlerService } from '../services/rest-call-handler.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  self;
  logMsg: string;
  isLoginError: boolean;
  isDisabled: boolean;
  showThrobber: boolean = false;
  cookies: string;
  usernameVal: string;
  passwordVal: string;
  imageSrc: string = "";
  showDefaultImg: boolean = false;

  constructor(private loginService: LoginService, private restAPIUrlService: RestAPIurlService,
    private restEndpointService: RestEndpointService, private restCallHandlerService: RestCallHandlerService,
    private cookieService: CookieService,private router: Router) {

    var self = this;
    self.imageSrc = 'data:image/jpg;base64,';
    self.showDefaultImg = true;
    /* var restCallUrl = restAPIUrlService.getRestCallUrl("GET_LOGO_IMAGE");

    var resource = this.restCallHandlerService.get(restCallUrl, {}, {}).subscribe(function (data) {
      if (data.data.encodedString && data.data.encodedString.length > 0) {
        self.imageSrc = 'data:image/jpg;base64,' + data.data.encodedString;
      } else {
        self.showDefaultImg = true;
      }

    });
   */
}

  ngOnInit() {
  }

  public userAuthentication(username: string, password: string): void {
            if (username === ''  || password === '' ) {
                this.logMsg = '';
            } else {
                var self = this;
                this.isDisabled = true;
                this.showThrobber = true;
                var token = 'Basic ' + btoa(username + ":" + password);
                this.loginService.loginUserAuthentication(username, password)
                    .subscribe(function (data) {
                        var grafcookies = data.data;
                        if (data.status === 'SUCCESS') {
                            self.showThrobber = false;
                            var date = new Date();
                            var minutes = 30;
                            date.setTime(date.getTime() + (minutes * 60 * 1000));
                            this.cookieService.put('Authorization', token, { expires: date });
                            this.cookieService.put('DashboardSessionExpiration', new Date(new Date().getTime() + 86400 * 1000));
                            this.cookies = "";
                            for (var key in grafcookies) {
                                //this.cookies += key+ '=' +grafcookies[key];
                                this.cookieService.put(key, grafcookies[key], { expires: date });
                            }
                            //self.$cookies.put('grafanaCookies',{'grafanaOrg':grafcookies.grafanaOrg,'grafanaRole':grafcookies.grafanaRole,'grafana_remember':grafcookies.grafana_remember, 'grafana_sess':grafcookies.grafana_sess, 'grafana_user':grafcookies.grafana_user});
                            //self.$cookies.put('cookies', this.cookies);
                            self.router.navigate(['/InSights/home']);
                            var uniqueString = "grfanaLoginIframe";
                            var iframe = document.createElement("iframe");
                            iframe.id = uniqueString;
                            document.body.appendChild(iframe);
                            iframe.style.display = "none";
                            iframe.contentWindow.name = uniqueString;
                            // construct a form with hidden inputs, targeting the iframe
                            var form = document.createElement("form");
                            form.target = uniqueString;
                            //form.action = "http://localhost:3000/login";
                            form.action = self.restEndpointService.getGrafanaHost() + '/login';
                            //console.log(form.action);
                            form.method = "POST";

                            // repeat for each parameter
                            var input = document.createElement("input");
                            input.type = "hidden";
                            input.name = "user";
                            input.value = username;
                            form.appendChild(input);

                            var input1 = document.createElement("input");
                            input1.type = "hidden";
                            input1.name = "password";
                            input1.value = password;
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
