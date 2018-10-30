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
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
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
  orgId: number;
  routeParameter: Observable<any>;
  playListUrl: SafeResourceUrl;
  constructor(private route: ActivatedRoute, private router: Router,
  private sanitizer: DomSanitizer) {
    var self = this;
      self.playListUrl = sanitizer.bypassSecurityTrustResourceUrl(InsightsInitService.grafanaHost + '/dashboard/script/iSight.js?url=' + InsightsInitService.grafanaHost + '/d/DrPYuKJmz/dynatrace-data?orgId=1');
      console.log(this.playListUrl)
      console.log(this.playListUrl);
      self.setScrollBarPosition();
  }

  ngOnInit() {
    this.routeParameter = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => params.get('id'))
    );
    console.log(this.routeParameter);
  }

  setScrollBarPosition() {
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  }

}
