/*******************************************************************************
 * Copyright 2017 Cognizant Technology Solutions
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.  You may obtain a copy
 * of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
 * License for the specific language governing permissions and limitations under
 * the License.
 ******************************************************************************/

import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { ImageHandlerService } from '@insights/common/imageHandler.service';


@Injectable()
export class InsightsInitService {

    location: Location;
    static serviceHost: String;
    static elasticSearchServiceHost: String;
    static neo4jServiceHost: String;
    static grafanaHost: String;
    configDesc = {};

    constructor(location: Location, private http: HttpClient,
        private cookieService: CookieService,private imageHandler: ImageHandlerService) {
    }

    public async initMethods(){
        const result1 = await this.loadUiServiceLocation();
        const result2 =await this.loadAgentConfigDesc();
        const result3 =await this.loadImageHandler();
    }

    private async loadAgentConfigDesc() {
        var self = this;
        var agentConfigJsonUrl = "config/configDesc.json"
        let gentConfigResponse =await this.getJSONUsingObservable(agentConfigJsonUrl).toPromise();
            //console.log(gentConfigResponse);
            self.configDesc = gentConfigResponse.desriptions;
        
    }

    private async loadUiServiceLocation() {
        var self = this;
        var uiConfigJsonUrl = "config/uiConfig.json"
        let UIConfigResponse = await this.getJSONUsingObservable(uiConfigJsonUrl).toPromise();
        //console.log(UIConfigResponse)
        InsightsInitService.serviceHost = UIConfigResponse.serviceHost;
        InsightsInitService.elasticSearchServiceHost = UIConfigResponse.elasticSearchServiceHost;
        InsightsInitService.neo4jServiceHost = UIConfigResponse.neo4jServiceHost;
        InsightsInitService.grafanaHost = UIConfigResponse.grafanaHost;
    }

    private loadImageHandler() {
        this.imageHandler.initializeImageIcons();
        this.imageHandler.addPathIconRegistry();
    }

    public getServiceHost(): String {
        if (!InsightsInitService.serviceHost) {
            InsightsInitService.serviceHost = location.protocol + "://" + location.host
        }
        return InsightsInitService.serviceHost;
    }

    public getConfigDesc() {
        return this.configDesc;
    }

    public getelasticSearchServiceHost(): String {
        if (!InsightsInitService.elasticSearchServiceHost) {
            InsightsInitService.elasticSearchServiceHost = location.protocol + "://" + location.host + ":9200";
        }
        return InsightsInitService.elasticSearchServiceHost;
    }

    public getNeo4jServiceHost(): String {
        if (!InsightsInitService.neo4jServiceHost) {
            InsightsInitService.neo4jServiceHost = location.protocol + "://" + location.host + ":7474";
        }
        return InsightsInitService.neo4jServiceHost;
    }

    public getGrafanaHost(): String {
        if (!InsightsInitService.grafanaHost) {
            InsightsInitService.grafanaHost = location.protocol + "://" + location.host + ":3000";
        }
        return InsightsInitService.grafanaHost;
    };


    public getGrafanaHost1(): Promise<any> {
        var self = this;
        var resource;
        var authToken = this.cookieService.get('Authorization');
        var defaultHeader = { 'Authorization': authToken };
        var restcallUrl = self.getServiceHost() + "/PlatformService/configure/grafanaEndPoint";
        return this.http.get(restcallUrl).toPromise();

    }

    public getJSONUsingObservable(url): Observable<any> {
        return this.http.get(url)
    }
}