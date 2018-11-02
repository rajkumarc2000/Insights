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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, UrlSegmentGroup, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer, BrowserModule, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { GrafanaDashboardService } from '@insights/app/modules/grafana-dashboard/grafana-dashboard-service';
import { GrafanaAuthenticationService } from '@insights/common/grafana-authentication-service';
import { GrafanaDashboardMode } from '@insights/app/modules/grafana-dashboard/grafana-dashboard-model';
import { CookieService } from 'ngx-cookie-service';
import { HomeComponent } from '@insights/app/modules/home/home.component';


@Component({
    selector: 'app-grafana-dashboard',
    templateUrl: './grafana-dashboard.component.html',
    styleUrls: ['./grafana-dashboard.component.css']
})
export class GrafanaDashboardComponent implements OnInit {
    orgId: string;
    routeParameter: Observable<any>;
    dashboardUrl: SafeResourceUrl;
    iSightDashboards = [];
    dashboardTitle: string;
    selectedOrgUrl: string;
    defaultOrg: number;
    selectedApp: string;
    framesize: any;
    selectedDashboardUrl: string = '';
    selectedDashboard: GrafanaDashboardMode;
    dashboards = [];
    constructor(private route: ActivatedRoute, private router: Router,
        private sanitizer: DomSanitizer, private grafanadashboardservice: GrafanaDashboardService,
        private grafanaService: GrafanaAuthenticationService, private cookieService: CookieService, 
        private homeController: HomeComponent) {
        var self = this;
        this.framesize = window.frames.innerHeight;

        var receiveMessage = function (evt) {
            var height = parseInt(evt.data);
            if (!isNaN(height)) {
                self.framesize = (evt.data + 20);
            }
        }
        console.log(this.framesize);
        window.addEventListener('message', receiveMessage, false);

        console.log(this.framesize);
    }

    ngOnInit() {
        console.log(" In Init for grafana dashboard")
        this.route.paramMap.subscribe(async (params: ParamMap) => {
            this.orgId = params.get('id');
            console.log("orgid works " + this.orgId);
            this.selectedDashboard=undefined;
            this.dashboardUrl=undefined;
            this.dashboards=undefined;
            this.dashboardTitle=undefined;
            await this.switchOrganizations(parseInt(this.orgId));
            if (this.selectedDashboard != undefined) {
                console.log(this.selectedDashboard);
                this.selectedDashboard.iframeUrl = this.selectedDashboard.iframeUrl.replace("iSight.js", "iSight_ui3.js");
                this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedDashboard.iframeUrl);
            } else {
                this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(InsightsInitService.grafanaHost + '/dashboard/script/iSight_ui3.js?url=' + InsightsInitService.grafanaHost + '/?orgId=' + this.orgId);// 1/?orgId=3 3/d/DrPYuKJmz/dynatrace-data?orgId=
                console.log("No dashboard found,set default dashboardUrl");
            }
            console.log(this.dashboardUrl);
            this.setScrollBarPosition();
        });
    }

    setScrollBarPosition() {
        var self = this;
        console.log("In scroll function ");
        this.framesize = window.frames.innerHeight;
        var receiveMessage = function (evt) {
            var height = parseInt(evt.data);
            if (!isNaN(height)) {
                self.framesize = (evt.data + 20);
            }
        }
        console.log(this.framesize);
        window.addEventListener('message', receiveMessage, false);
        console.log(this.framesize);
        setTimeout(function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1000);
    }

    async switchOrganizations(orgId) {
        var self = this;
        self.defaultOrg = orgId;
        var switchorgResponse = await self.grafanadashboardservice.switchUserOrg(orgId);
        if (switchorgResponse != null) {
            var currentroleandorg = await self.grafanaService.getGrafanaCurrentOrgAndRole();
            if (currentroleandorg != null) {
                if (switchorgResponse.status === 'success') {
                    var dashboardslist = await this.grafanadashboardservice.searchDashboard();
                    self.parseDashboards(dashboardslist);
                }
                console.log("Role "+currentroleandorg.grafanaCurrentOrgRole);
                if (currentroleandorg.grafanaCurrentOrgRole === 'Admin') {
                    /* self.homeController.showAdminTab = true;
                     if (self.homeController.showInsightsTab) {
                         self.homeController.selectedIndex = 2;
                     } else {
                         self.homeController.selectedIndex = 1;
                     }*/

                } else {
                    /*self.homeController.showAdminTab = false;
                    if (self.homeController.showInsightsTab) {
                        self.homeController.selectedIndex = 1;
                    } else {
                        self.homeController.selectedIndex = 0;
                    }*/
                }

                self.cookieService.set('grafanaRole', currentroleandorg.grafanaCurrentOrgRole);
                self.cookieService.set('grafanaOrg', currentroleandorg.grafanaCurrentOrg);
                this.homeController.userRole=currentroleandorg.grafanaCurrentOrgRole;
                
                if (currentroleandorg.userName != undefined) {
                    this.homeController.userName=currentroleandorg.userName.replace(/['"]+/g, '');
                    //self.homeController.userName = data.userName.replace(/['"]+/g, '');
                }
                /*self.homeController.userRole = data.grafanaCurrentOrgRole;
                self.homeController.userCurrentOrg = data.grafanaCurrentOrg;
                self.grafanaService.getCurrentUserOrgs()
                    .then(function (orgdata) {
                        self.grafanaService.userCurrentOrgName = orgdata.data.filter(function (i) {
                            return i.orgId == self.grafanaService.userCurrentOrg;
                        });
                    });*/
            }
            // );


        }
        // );

    }

    async parseDashboards(dashboardslist) {
        var self = this;

        var dataArray = dashboardslist.dashboards;
        var model = [];
        if (dataArray.length > 0) {
            dataArray.forEach(element => {
                model.push(new GrafanaDashboardMode(element.title, element.id, element.url, null, element.title, false));
            });
            self.dashboards = model;
            self.setSelectedDashboard(model[0]);
            if (self.selectedDashboardUrl && self.selectedDashboardUrl.trim().length != 0) {
                var dashbmodel = new GrafanaDashboardMode(null, null, self.selectedDashboardUrl, null, null, false);
                self.setSelectedDashboard(dashbmodel);
            }
            if (self.selectedDashboard) {
                self.dashboardTitle = self.selectedDashboard.title;
            }
        } else {
            console.log("No dashboard found");
        }
    }

    private setSelectedDashboard(dashboard) {
        var self = this;
        self.selectedDashboard = dashboard;
        console.log(self.selectedDashboard);
        self.dashboardTitle = dashboard.title;
        if (dashboard.dashboardUrl) {
            console.log(dashboard.iframeUrl);
            self.selectedDashboard.iframeUrl = dashboard.iframeUrl;
            self.setScrollBarPosition();
        }
    };

}
