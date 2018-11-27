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

@Component({
  selector: 'app-agent-management',
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.css']
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
  editIconSrc: string = "dist/icons/svg/actionIcons/Edit_icon_disabled.svg";
  startIconSrc: string = "dist/icons/svg/actionIcons/Start_icon_Disabled.svg";
  stopIconSrc: string = "dist/icons/svg/actionIcons/Stop_icon_Disabled.svg";
  successIconSrc: string = "dist/icons/svg/ic_check_circle_24px.svg";
  errorIconSrc: string = "dist/icons/svg/ic_report_problem_24px.svg";
  deleteIconSrc: string = "dist/icons/svg/actionIcons/Delete_icon_disabled.svg";

  constructor(public agentService: AgentService) {

    this.getRegisteredAgents();
    //console.log(this.selectedAgent);
  }

  ngOnInit() {
  }

  public async getRegisteredAgents() {

    var self = this;
    self.showList = false;
    self.showThrobber = true;
    self.buttonDisableStatus = true;
    self.runDisableStatus = "";
    self.editIconSrc = "dist/icons/svg/actionIcons/Edit_icon_disabled.svg";
    self.startIconSrc = "dist/icons/svg/actionIcons/Start_icon_Disabled.svg";
    self.stopIconSrc = "dist/icons/svg/actionIcons/Stop_icon_Disabled.svg";
    self.deleteIconSrc = "dist/icons/svg/actionIcons/Delete_icon_disabled.svg";
    let agentList = await self.agentService.loadAgentServices("DB_AGENTS_LIST");
    if (agentList != null && agentList.status == 'success') {
      this.agentListDatasource = agentList.data;
      console.log(agentList);
      console.log(this.agentListDatasource);
      this.displayedColumns = ['radio', 'OS', 'ToolCategory', 'ToolName', 'Version', 'Status'];

      setTimeout(function () {
        self.showConfirmMessage = "";
      }, 5000);
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
    console.log(element)
    this.runDisableStatus = element.agentStatus;
    console.log("Status Edit " + this.runDisableStatus);
    this.buttonDisableStatus = false;
  }

  agentStartStopAction(actType): void {
    var self = this;
    console.log(this.selectedAgent);
    if (this.selectedAgent == undefined) {
      this.showConfirmMessage = "other";
      self.showMessage = "Please select Agent";
    } else {
      console.log(" agentStartStopAction " + actType + " " + this.selectedAgent.agentKey);
      self.agentService.agentStartStop(this.selectedAgent.agentKey, actType)
        .then(function (data) {
          console.log(data);
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

  }


}
