import { Injectable } from '@angular/core';
import { RestCallHandlerService } from '../common.services/rest-call-handler.service';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class LoginService {
    response: any;
    constructor(private restCallHandlerService: RestCallHandlerService, ) {
    }

    public loginUserAuthentication(username: string, password: string): Promise<any> {

        var token = 'Basic ' + btoa(username + ":" + password);
        console.log(token)
        var restHandler = this.restCallHandlerService;
        this.response = restHandler.post("USER_AUTHNTICATE", {}, { 'Authorization': token })
        console.log(this.response);
        console.log(this.response.toPromise());
        return this.response.toPromise();
    }
}
