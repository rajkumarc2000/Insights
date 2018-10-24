import { Injectable } from '@angular/core';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { Observable } from 'rxjs';


@Injectable()
export class LoginService {
    response: any;
    grafanaresponse: any;
    constructor(private restCallHandlerService: RestCallHandlerService, ) {
    }

    public loginUserAuthentication(username: string, password: string): Promise<any> {
        var token = 'Basic ' + btoa(username + ":" + password);
        console.log(token);
        this.response = this.restCallHandlerService.post("USER_AUTHNTICATE", {}, { 'Authorization': token })
        console.log(this.response);
        console.log(this.response.toPromise());
        return this.response.toPromise();
    }

    public loginGrafanaFromApp(username: string, password: string): Promise<any> {
        let grafanaURL = "http://"+username+":"+password+"@localhost:3000/api/org";
        console.log(grafanaURL);
        this.grafanaresponse = this.restCallHandlerService.getJSONUsingObservable(grafanaURL).toPromise();
        console.log(this.grafanaresponse)
        return this.grafanaresponse;
    }
}
