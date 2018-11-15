/*********************************************************************************
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
 *******************************************************************************/
import { Component, OnInit, Inject } from '@angular/core';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { RestAPIurlService } from '@insights/common/rest-apiurl.service'
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { HealthCheckService } from './healthcheck.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShowDetailsDialog } from './healthcheck-show-details-dialog';


@Component({
  selector: 'app-healthcheck',
  templateUrl: './healthcheck.component.html',
  styleUrls: ['./healthcheck.component.css']
})
export class HealthCheckComponent implements OnInit {

  agentsStatusResposne: any;
  dataSource = [];
  displayedColumns: string[];
  checkResponseData: boolean = true;
  showTemplateAfterLoad: boolean = false;
  agentNodes = [];
  agentToolsIcon = {};
  showContent: boolean = false;;
  showThrobber: boolean = false;
  serverStatus = [];
  dataComponentDataSource = [];
  dataComponentColumns: string[];
  serverColumns: string[];
  servicesDataSource = []
  list: string[];


  constructor(private restAPIUrlService: RestAPIurlService,
    private restCallHandlerService: RestCallHandlerService,
    private cookieService: CookieService,
    private healthCheckService: HealthCheckService,
    private router: Router,
    private dialog: MatDialog) {
    this.loadAllAgentsHealth();
  }

  ngOnInit() {
  }

  async loadAllAgentsHealth() {
    try {
      this.agentsStatusResposne = await this.restCallHandlerService.get("HEALTH_GLOBAL");
      console.log(this.agentsStatusResposne.status);
      var status: string = this.agentsStatusResposne.status;
      if (this.agentsStatusResposne.status === 'success') {
        var dataArray = this.agentsStatusResposne.data.nodes;
        if (dataArray.length === 0) {
          this.checkResponseData = false;
        }
        this.agentNodes = dataArray;
        this.showTemplateAfterLoad = true;
        for (var key in dataArray) {
          var nodesArray = dataArray[key];
          var toolIconSrc = '';
          for (var attr in nodesArray) {
            var attrValue = nodesArray['propertyMap'];
            if (attrValue.toolName != undefined) {
              // toolIconSrc = self.iconService.getIcon(attrValue.toolName);
              //this.agentToolsIcon[attrValue.toolName] = toolIconSrc;
              break;
            }
          }
        }
      } else {
        this.showContent = false;
      }
      this.displayedColumns = ['category', 'toolName', 'inSightsTimeX', 'status', 'details'];
      this.dataSource = this.agentNodes;

    } catch (error) {
      console.log(error);
    }

    // Loads Data Component and Services
    this.showThrobber = true;
    this.showContent = true;
    this.healthCheckService.loadServerHealthConfiguration()
      .then((serverData) => {
        this.showThrobber = false;
        this.showContent = !this.showThrobber;
        for (var key in serverData) {
          var element = serverData[key];
          element.serverName = key;
          if (element.type == 'Service') {
            this.servicesDataSource.push(element);
          }
          if (element.type == 'Database') {
            this.dataComponentDataSource.push(element);
          }
        }

        this.dataComponentColumns = ['serverName', 'ipAddress', 'version', 'status'];
        this.serverColumns = ['serverName', 'ipAddress', 'version', 'status', 'details'];
      })
      .catch(function (data) {
        this.showThrobber = false;
        this.showContent = false;
      });
  }

  // Displays Show Details dialog box when Details column is clicked
  showDetailsDialog(toolName: string, categoryName: string) {
    let showDetailsDialog = this.dialog.open(ShowDetailsDialog, {
      height: '100%',
      width: '100%',
      data: { toolName: toolName, categoryName: categoryName }
    });
  }

  goToSection(sectionName:string) {
    let element = document.querySelector("#"+ sectionName);
    if (element) {
      element.scrollIntoView();
    }
  }
}





