import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AppConfig {

    location: Location;
    static serviceHost: String;
    static elasticSearchServiceHost: String;
    static neo4jServiceHost: String;
    static grafanaHost: String;
    configDesc = {};

    constructor(location: Location, private http: HttpClient, private cookieService: CookieService) {
        this.loadUiServiceLocation();
        this.loadAgentConfigDesc();
    }

    public loadAgentConfigDesc(): void {
        var self = this;
        var agentConfigJsonUrl = "config/configDesc.json"
        this.getJSONUsingObservable(agentConfigJsonUrl).subscribe(data => {
            //console.log(data)
            self.configDesc = data.desriptions;
        });
    }

    public async loadUiServiceLocation() {
        var self = this;
        var uiConfigJsonUrl = "config/uiConfig.json"
        let UIConfigResponse = await this.getJSONUsingObservable(uiConfigJsonUrl).toPromise();
        //subscribe(data => {
            console.log(UIConfigResponse)
            AppConfig.serviceHost = UIConfigResponse.serviceHost;
            AppConfig.elasticSearchServiceHost = UIConfigResponse.elasticSearchServiceHost;
            AppConfig.neo4jServiceHost = UIConfigResponse.neo4jServiceHost;
            AppConfig.grafanaHost = UIConfigResponse.grafanaHost;
       // });
        console.log(AppConfig.serviceHost);
        console.log(location.host)
    }

    public getServiceHost(): String {
        if (!AppConfig.serviceHost) {
            AppConfig.serviceHost = location.protocol + "://" + location.host
        }
        return AppConfig.serviceHost;
    }

    public getConfigDesc() {
        return this.configDesc;
    }

    public getelasticSearchServiceHost(): String {
        if (!AppConfig.elasticSearchServiceHost) {
            AppConfig.elasticSearchServiceHost = location.protocol + "://" + location.host + ":9200";
        }
        return AppConfig.elasticSearchServiceHost;
    }

    public getNeo4jServiceHost(): String {
        if (!AppConfig.neo4jServiceHost) {
            AppConfig.neo4jServiceHost = location.protocol + "://" + location.host + ":7474";
        }
        return AppConfig.neo4jServiceHost;
    }

    public getGrafanaHost(): String {
        if (!AppConfig.grafanaHost) {
            AppConfig.grafanaHost = location.protocol + "://" + location.host + ":3000";
        }
        return AppConfig.grafanaHost;
    };


    public getGrafanaHost1(): Promise<any> {
        var self = this;
        var resource;
        var authToken = this.cookieService.get('Authorization');
        var defaultHeader = { 'Authorization': authToken };
        var restcallUrl = location.protocol + "://" + "localhost:3000" + "/PlatformService/configure/grafanaEndPoint"; location.host

        /* this.http.get(restcallUrl).subscribe(data => {
             console.log(data);
             resource = data;
         });;*/
        return this.http.get(restcallUrl).toPromise();

    }

    public getJSONUsingObservable(url): Observable<any> {
		return this.http.get(url)
	}
}