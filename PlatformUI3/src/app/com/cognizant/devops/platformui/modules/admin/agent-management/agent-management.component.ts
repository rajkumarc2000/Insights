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
import { AgentService } from '@insights/app/modules/admin/agent-management/agent-management-service';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agent-management',
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.css', './../../home.module.css']
})
export class AgentManagementComponent implements OnInit {

  validationArr = {};
  showConfirmMessage: string;
  showList: boolean = false;
  showThrobber: boolean;
  showMessage: string;
  data = [];
  tableParams = [];
  buttonDisableStatus: boolean = true;
  runDisableStatus: string;
  agentListDatasource = [];
  displayedColumns: string[];
  selectedAgent: any;
  agentparameter = {};
  receivedParam: any;

  constructor(public agentService: AgentService, public router: Router,
    private route: ActivatedRoute) {

    this.getRegisteredAgents();
  }

  ngOnInit() {
    console.log(this.route.queryParams);
    this.route.queryParams.subscribe(params => {
      console.log(params["agentstatus"]);
      if (params["agentstatus"] != undefined) {
        this.receivedParam = params["agentstatus"];
        this.showConfirmMessage = this.receivedParam;
      }
    });
  }

  public async getRegisteredAgents() {

    var self = this;
    self.showList = false;
    self.showThrobber = true;
    self.buttonDisableStatus = true;
    self.runDisableStatus = "";
    let agentList = await self.agentService.loadAgentServices("DB_AGENTS_LIST");
    if (agentList != null && agentList.status == 'success') {
      this.agentListDatasource = agentList.data;
      console.log(agentList);
      this.displayedColumns = ['radio', 'OS', 'ToolCategory', 'ToolName', 'Version', 'Status'];
      setTimeout(function () {
        self.showConfirmMessage = "";
      }, 10000);
    } else {
      self.showMessage = "Something wrong with Service, Please try again.";
    }
  }
  private consolidatedArr(detailArr): void {
    var self = this;
    this.validationArr = {};
    for (var i = 0; i < detailArr.length; i++) {
      this.validationArr[i] = { "os": detailArr[i].osVersion, "version": detailArr[i].agentVersion, "tool": detailArr[i].toolName }
    }
  }

  statusEdit(element) {
    this.runDisableStatus = element.agentStatus;
    this.buttonDisableStatus = false;
  }

  agentStartStopAction(actType): void {
    var self = this;
    if (this.selectedAgent == undefined) {
      this.showConfirmMessage = "other";
      self.showMessage = "Please select Agent";
    } else {
      self.agentService.agentStartStop(this.selectedAgent.agentKey, actType)
        .then(function (data) {
          if (actType == "START") {
            if (data.status == "success") {
              self.showConfirmMessage = "started";
            } else {
              self.showConfirmMessage = "start";
            }
          } else {
            if (data.status == "success") {
              self.showConfirmMessage = "stopped";
            } else {
              self.showConfirmMessage = "stop";
            }
          }

          self.getRegisteredAgents();
        })
        .catch(function (data) {
          self.showConfirmMessage = "service_error";
          self.getRegisteredAgents();
        });
    }
  }

  addAgentData() {
    this.agentparameter = JSON.stringify({ 'type': 'new', 'detailedArr': {} });
    let navigationExtras: NavigationExtras = {
      skipLocationChange: true,
      queryParams: {
        "agentparameter": this.agentparameter
      }
    };
    this.router.navigate(['InSights/Home/agentconfiguration'], navigationExtras);
  }

  editAgent() {
    this.consolidatedArr(this.selectedAgent);
    this.agentparameter = JSON.stringify({ 'type': 'update', 'detailedArr': this.selectedAgent });
    let navigationExtras: NavigationExtras = {
      skipLocationChange: true,
      queryParams: {
        "agentparameter": this.agentparameter
      }
    };
    this.router.navigate(['InSights/Home/agentconfiguration'], navigationExtras);
  }
}
