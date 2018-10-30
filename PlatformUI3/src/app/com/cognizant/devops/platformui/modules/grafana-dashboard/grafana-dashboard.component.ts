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
import { Router, ActivatedRoute, ParamMap,UrlSegmentGroup,UrlSegment,UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer, BrowserModule, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { InsightsInitService } from '@insights/common/insights-initservice';

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
  constructor(private route: ActivatedRoute, private router: Router,
  private sanitizer: DomSanitizer) {
    var self = this;
      self.dashboardUrl = sanitizer.bypassSecurityTrustResourceUrl(InsightsInitService.grafanaHost + '/dashboard/script/iSight.js?url=' + InsightsInitService.grafanaHost + '/d/DrPYuKJmz/dynatrace-data?orgId=1');
      console.log(this.dashboardUrl)
      console.log(this.dashboardUrl);
      self.setScrollBarPosition();
  }

  ngOnInit() {
    
    var urlSanpshot=this.route.snapshot['_routerState'].url;
    console.log(urlSanpshot);
    const tree: UrlTree = this.router.parseUrl(urlSanpshot);
    const g: UrlSegmentGroup = tree.root.children["primary"];
    const s: UrlSegment[] = g.segments;
    console.log(s);
    if(s[s.length-1]!=undefined){
      this.orgId=s[s.length-1].path;
    }
  }

  setScrollBarPosition() {
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  }

  /*switchOrganizations(orgId): void {
            var self = this;
            self.defaultOrg = orgId;
            self.checkStyle(orgId);
            self.dashboardService
                .switchUserOrg(orgId)
                .then(function (selOrgStatus) {
                    self.$rootScope.refreshDashboard = new Date();
                    if (selOrgStatus.status === 'success') {
                        self.getDashboards();
                    }
                    self.authenticationService.getGrafanaCurrentOrgAndRole()
                        .then(function (data) {
                            if (data.grafanaCurrentOrgRole === 'Admin') {
                                self.homeController.showAdminTab = true;
                                if (self.homeController.showInsightsTab) {
                                    self.homeController.selectedIndex = 2;
                                } else {
                                    self.homeController.selectedIndex = 1;
                                }

                            } else {
                                self.homeController.showAdminTab = false;
                                if (self.homeController.showInsightsTab) {
                                    self.homeController.selectedIndex = 1;
                                } else {
                                    self.homeController.selectedIndex = 0;
                                }
                            }

                            self.$cookies.put('grafanaRole', data.grafanaCurrentOrgRole);
                            self.$cookies.put('grafanaOrg', data.grafanaCurrentOrg);
                            if (data.userName != undefined) {
                                self.homeController.userName = data.userName.replace(/['"]+/g, '');
                            }
                            self.homeController.userRole = data.grafanaCurrentOrgRole;
                            self.homeController.userCurrentOrg = data.grafanaCurrentOrg;
                            self.authenticationService.getCurrentUserOrgs()
                                .then(function (orgdata) {
                                    self.homeController.userCurrentOrgName = orgdata.data.filter(function (i) {
                                        return i.orgId == self.homeController.userCurrentOrg;
                                    });
                                });
                        });



                });

        }

        checkStyle(orgId: number): string {
            if (orgId == this.defaultOrg) {
                return "background-color: #f1f1f1";
            } else {
                return "";
            }
        }

        getDashboards() {
            var self = this;
            this.elasticSearchService
                .loadKibanaIndex()
                .then(function (dashboardData) {
                    var dataArray = dashboardData.dashboards;
                    var model = [];
                    dataArray.forEach(element => {
                        model.push(new DashboardModel(element.title, element.id, element.url, null, element.title, false));
                    });
                    self.dashboards = model;
                    self.setSelectedDashboard(model[0]);
                    if (self.homeController.selectedDashboardUrl && self.homeController.selectedDashboardUrl.trim().length != 0) {
                        var dashbmodel = new DashboardModel(null, null, self.homeController.selectedDashboardUrl, null, null, false);
                        self.setSelectedDashboard(dashbmodel);
                    }
                    if (self.selectedDashboard) {
                        self.dashboardTitle = self.selectedDashboard.title;
                    }
                });
            this.homeController.templateName = 'dashboards';
        }*/

}
