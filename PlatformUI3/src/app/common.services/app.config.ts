import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { RestCallHandlerService } from '../common.services/rest-call-handler.service';
import { ImageHandlerService  } from '../common.services/imageHandler.service';

@Injectable()
export class AppConfig {

    location: Location;
    serviceHost: String;
    elasticSearchServiceHost: String;
    neo4jServiceHost: String;
    grafanaHost: String;
    configDesc = {};

    constructor(location: Location, private http: HttpClient, private cookieService: CookieService, 
    private restHandler: RestCallHandlerService,private imageIconRegistory : ImageHandlerService) {
        this.loadUiServiceLocation();
        this.loadAgentConfigDesc();
    }

    public loadAgentConfigDesc(): void {
        var self = this;
        var agentConfigJsonUrl = "config/configDesc.json"
        this.restHandler.getJSONUsingObservable(agentConfigJsonUrl).subscribe(data => {
            //console.log(data)
            self.configDesc = data.desriptions;
        });
    }

    public loadUiServiceLocation(): void {
        var self = this;
        var uiConfigJsonUrl = "config/uiConfig.json"
        this.restHandler.getJSONUsingObservable(uiConfigJsonUrl).subscribe(data => {
            //console.log(data)
            self.serviceHost = data.serviceHost;
            self.elasticSearchServiceHost = data.elasticSearchServiceHost;
            self.neo4jServiceHost = data.neo4jServiceHost;
            self.grafanaHost = data.grafanaHost;
        });
        console.log(location.host)
    }

    public getServiceHost(): String {
        if (!this.serviceHost) {
            this.serviceHost = location.protocol + "://" + location.host
        }
        return this.serviceHost;
    }

    public getConfigDesc() {
        return this.configDesc;
    }

    public getelasticSearchServiceHost(): String {
        if (!this.elasticSearchServiceHost) {
            this.elasticSearchServiceHost = location.protocol + "://" + location.host + ":9200";
        }
        return this.elasticSearchServiceHost;
    }

    public getNeo4jServiceHost(): String {
        if (!this.neo4jServiceHost) {
            this.neo4jServiceHost = location.protocol + "://" + location.host + ":7474";
        }
        return this.neo4jServiceHost;
    }

    public getGrafanaHost(): String {
        if (!this.grafanaHost) {
            this.grafanaHost = location.protocol + "://" + location.host + ":3000";
        }
        return this.grafanaHost;
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
}