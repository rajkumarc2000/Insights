import { Injectable } from '@angular/core';
import { RestCallHandlerService } from '../services/rest-call-handler.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LoginService {
    response: any;
    constructor(private restCallHandlerService: RestCallHandlerService, ) {
        //this.loginUserAuthentication('admin', 'admin');
    }

    public loginUserAuthentication(username: string, password: string): Promise<any> {

        var token = 'Basic ' + btoa(username + ":" + password);
        console.log(token)
        var restHandler = this.restCallHandlerService;
        this.response = restHandler.post("USER_AUTHNTICATE", {}, { 'Authorization': token })
        console.log(this.response);
        console.log(this.response.toPromise());
       /* if (this.response) {
            return;
        } else {
            return restHandler.post("USER_AUTHNTICATE", {}, { 'Authorization': token }).toPromise();
        }*/
        return this.response.toPromise();
    }
}
