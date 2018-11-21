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
import { HealthCheckService } from '@insights/app/modules/healthcheck/healthcheck.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ShowDetailsDialog } from '@insights/app/modules/healthcheck/healthcheck-show-details-dialog';


@Component({
  selector: 'app-healthcheck',
  templateUrl: './healthcheck.component.html',
  styleUrls: ['./healthcheck.component.css']
})
export class HealthCheckComponent implements OnInit {

  agentsStatusResposne: any;
  agentNodes = [];
  agentToolsIcon = {};
  showContent: boolean = false;;
  showThrobber: boolean = false;
  serverStatus = [];
  displayedAgentColumns: string[];
  dataComponentColumns: string[];
  servicesColumns: string[];
  agentDataSource = [];
  dataComponentDataSource = [];
  servicesDataSource = [];
  healthResponse: any;


  constructor(private healthCheckService: HealthCheckService, private dialog: MatDialog) {
    this.loadAllHealthCheckInfo();
  }

  ngOnInit() {
    //this.loadAllHealthCheckInfo();
  }

 async loadAllHealthCheckInfo() {
    try {
      // Loads Agent , Data Component and Services
      this.showThrobber = true;
      this.showContent = !this.showThrobber;
      this.healthResponse = await this.healthCheckService.loadServerHealthConfiguration();
      if (this.healthResponse != null) {
        console.log(this.healthResponse);
        this.showThrobber = false;
        this.showContent = !this.showThrobber;
        for (var key in this.healthResponse) {
          var element = this.healthResponse[key];
          element.serverName = key;
          if (element.type == 'Service') {
            this.servicesDataSource.push(element);
          } else if (element.type == 'Database') {
            this.dataComponentDataSource.push(element);
          } else if (element.type == 'Agents') {
            this.agentNodes = element.agentNodes;
            this.agentDataSource = this.agentNodes;
          }
        }
        /*
        setTimeout(function () {
          this.showContent = false;
        }, 5000);
        */
        this.displayedAgentColumns = ['category', 'toolName', 'inSightsTimeX', 'status', 'details'];
        this.dataComponentColumns = ['serverName', 'ipAddress', 'version', 'status'];
        this.servicesColumns = ['serverName', 'ipAddress', 'version', 'status', 'details'];

      }
      console.log(this.agentDataSource);
      console.log(this.dataComponentDataSource);
      console.log(this.servicesDataSource);
    } catch (error) {
      this.showContent = false;
      console.log(error);
    }
  }

  // Displays Show Details dialog box when Details column is clicked
  showDetailsDialog(toolName: string, categoryName: string) {
    let showDetailsDialog = this.dialog.open(ShowDetailsDialog, {
      panelClass: 'healthcheck-show-details-dialog-container',
      height: '500px',
      width: '900px',
      data: { toolName: toolName, categoryName: categoryName }
    });
  }

  //Transfers focus of Heath Check page as per User's selection
  goToSection(source:string,target:string) {
    // Changes the selected section color in the title
    this.changeSelectedSectionColor(source);
    let element = document.querySelector("#"+ target);
    if (element) {
      element.scrollIntoView();
    }
  }

  // Changes the selected section color in the title
  changeSelectedSectionColor(source:string) {    
    if (source=='agentTxt') {
      document.getElementById(source).style.color = "#00B140";
      document.getElementById('dataCompTxt').style.color = "#0033A0";
      document.getElementById('servicesTxt').style.color = "#0033A0";
    } else if (source=='dataCompTxt') {
      document.getElementById(source).style.color = "#00B140";
      document.getElementById('agentTxt').style.color = "#0033A0";
      document.getElementById('servicesTxt').style.color = "#0033A0";
    } else if(source=='servicesTxt') {
      document.getElementById(source).style.color = "#00B140";
      document.getElementById('dataCompTxt').style.color = "#0033A0";
      document.getElementById('agentTxt').style.color = "#0033A0";
    }   

  }

  //When user clicks on Back to Top button, it scrolls to Health Check page
  goToHealthCheckTitle() {
    let element = document.querySelector("#healthCheckTitle");
    if (element) {
      element.scrollIntoView();
    }
  }

}





