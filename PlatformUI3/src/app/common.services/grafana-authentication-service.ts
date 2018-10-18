import { Injectable } from '@angular/core';
import { RestCallHandlerService } from '../common.services/rest-call-handler.service';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

/*export interface IAuthenticationService {
    getAuthentication(authToken: string, msg: string): void;
    validateSession(): void;
    logout(): Promise<any>;
    getGrafanaCurrentOrgAndRole(): Promise<any>;
    getCurrentUserOrgs(): Promise<any>
}
 implements IAuthenticationService
*/
@Injectable()
export class GrafanaAuthenticationService {
    response: any;
    location: Location;
    constructor(location: Location, private router: Router,
        private cookieService: CookieService, private restCallHandlerService: RestCallHandlerService
    ) {


    }

    public getAuthentication(authToken: string, msg: string): void {
        if (authToken === undefined) {
            this.router.navigate(['/login']);
        } else {
            var msg = "auth token exists";
        }
    }

    public validateSession(): void {
        var authToken = this.cookieService.get('Authorization');
        console.log(authToken)
        if (authToken === undefined) {
            this.cookieService.delete('Authorization');
            this.router.navigate(['/login']);
        } else {
            var dashboardSessionExpirationTime = this.cookieService.get('DashboardSessionExpiration');
            var date = new Date();
            console.log(dashboardSessionExpirationTime)
            if (new Date(dashboardSessionExpirationTime) > date) {
                var minutes = 30;
                console.log("Inside validateSession");
                date.setTime(date.getTime() + (minutes * 60 * 1000));
                this.cookieService.set('Authorization', authToken, date);
            } else {
                this.cookieService.delete('Authorization');
                this.router.navigate(['/login']);
            }
        }
    }

    public logout(): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("LOGOUT");
    }

    public getGrafanaCurrentOrgAndRole(): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("GRAPANA_CURRENT_ROLE_ORG");
    }

    public getCurrentUserOrgs(): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("ACCESS_GROUP_MANAGEMENT_GET_CURRENT_USER_ORGS");
    }
}
