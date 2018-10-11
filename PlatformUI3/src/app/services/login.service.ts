import { Injectable } from '@angular/core';
import { RestCallHandlerService } from '../services/rest-call-handler.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LoginService {

    constructor(private restCallHandlerService: RestCallHandlerService, ) {
        this.loginUserAuthentication('admin', 'admin');
    }

    public loginUserAuthentication(username: string, password: string): Observable<any> {
        var token = 'Basic ' + btoa(username + ":" + password);
        console.log(token)
        var restHandler = this.restCallHandlerService;
        var dataresponse = restHandler.post("USER_AUTHNTICATE", {}, { 'Authorization': token });
        var strResourceString = JSON.stringify(dataresponse);
        console.log(strResourceString);
        return dataresponse;
    }
}
