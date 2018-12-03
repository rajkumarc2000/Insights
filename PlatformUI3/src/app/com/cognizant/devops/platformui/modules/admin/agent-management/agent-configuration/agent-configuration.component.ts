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
import { Component, OnInit, PipeTransform, Pipe } from '@angular/core';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { AgentService } from '@insights/app/modules/admin/agent-management/agent-management-service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AgentConfigItem } from '@insights/app/modules/admin/agent-management/agent-configuration/agentConfigItem';

@Component({
  selector: 'app-agent-configuration',
  templateUrl: './agent-configuration.component.html',
  styleUrls: ['../agent-management.component.css']
})
export class AgentConfigurationComponent implements OnInit {
  datatypeVal: boolean;
  validationArr = {};
  osLists = {};
  configDesc = {};
  configAbbr = [];
  selectedOS: string;
  versionList = [];
  toolsArr = [];
  response = {};
  showMessage: string;
  showConfig: boolean = false;
  showThrobber: boolean = false;
  editAgentDetails = {};
  headerData = [];
  updatedConfigdata = {};
  configData: string;
  item = {};
  defaultConfigdata = {};
  tempConfigdata: string;
  versionChangeddata = {};
  uploadedFile: File;
  isTypeError: string = "";
  files = [];
  fileUploadSuccessMessage: boolean = false;
  trackingUploadedFileContentStr: string = "";
  showTrackingJsonUploadButton: boolean;
  buttonDisableStatus: boolean = true;
  isRegisteredTool: boolean = false;
  btnValue: string;
  dynamicData: string;
  selectedTool: string;
  selectedVersion: string;
  receivedParam: any;
  agentConfigItems: AgentConfigItem[] = [];
  constructor(public config: InsightsInitService, public agentService: AgentService,
    private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    /*this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.receivedParam = params.get('param');
      //console.log(this.receivedParam);
    });*/
    this.route.queryParams.subscribe(params => {
      //console.log(params)
      this.receivedParam = JSON.parse(params["agentparameter"]);
      //console.log(this.receivedParam);
      this.showThrobber = true;
      this.initializeVariable();
      this.getOsList()
      this.getOsVersionTools("");
    });

  }

  initializeVariable() {
    //console.log(this.receivedParam.type);
    if (this.receivedParam.type == "update") {
      /*this.getDbAgentConfig(self.editAgentDetails['agentid']);*/
      this.btnValue = "Update";
      this.buttonDisableStatus = true;
    } else {
      this.btnValue = "Register";
      /*this.validationArr = self.editAgentDetails['detailedArr'];*/
    }
  }

  getOsList() {
    //console.log(this.config.getAgentsOsList());
    var agentsListFromUiConfig = this.config.getAgentsOsList();
    if (agentsListFromUiConfig !== undefined) {
      this.osLists = agentsListFromUiConfig;
    }
    //this.selectedOS = "";
  }



  getOsVersionTools(Selversion): void {

    var self = this;
    self.toolsArr = [];
    self.agentService.getDocRootAgentVersionTools()
      .then(function (data) {
        //console.log(data);
        if (data.status == "success") {
          self.response = data.data;
          if (Selversion) {
            self.toolsArr = self.response[Selversion];
          } else {
            for (var key in self.response) {
              self.versionList.push(key);
            }
          }
        } else {
          self.showMessage = "Problem with Docroot URL (or) Platform service. Please try again";
        }
        self.showThrobber = false;
      })
      .catch(function (data) {
        self.showMessage = "Something wrong with service, Please try again";
      });
    //console.log(self.toolsArr);
  }

  versionOnChange(key, type): void {
    var self = this;
    //console.log(" In version On Change " + key + " " + type);
    //console.log(self.response);
    if (type == "validate") {
      if (self.selectedVersion === undefined || self.selectedTool === undefined || self.selectedOS === undefined) {
        self.buttonDisableStatus = true;
      } else {
        self.buttonDisableStatus = false;
      }
      //self.buttonDisableStatus = false;
    } else if (type == "Update") {
      self.showConfig = false;
      //self.showThrobber = true;
      self.showMessage = "";
      self.defaultConfigdata = JSON.parse(self.tempConfigdata);
      self.agentService.getDocrootAgentConfig(key, self.selectedTool)
        .then(function (vdata) {
          self.showConfig = true;
          //self.showThrobber = false;
          self.versionChangeddata = JSON.parse(vdata.data);
          self.concatConfigelement(self.versionChangeddata);
          self.removeConfigelement(self.versionChangeddata);
          self.configLabelMerge();
        })
        .catch(function (vdata) {
          //self.showThrobber = false;
          self.showMessage = "Something wrong with service, Please try again";
        });
    } else {
      self.buttonDisableStatus = true;
      self.selectedTool = "";
      self.toolsArr = [];
      self.toolsArr = self.response[key];
    }
    //console.log(self.toolsArr);
  }


  async getDocRootAgentConfig(version, toolName) {
    //console.log("In getDocRootAgentConfig");
    var self = this;
    self.isRegisteredTool = false;
    self.checkValidation();

    if (!self.isRegisteredTool) {
      this.agentConfigItems = [];
      self.showConfig = false;
      //self.showThrobber = true;
      self.showMessage = "";

      var agentConfigResponse = await self.agentService.getDocrootAgentConfig(version, toolName)
      console.log(agentConfigResponse);
      //console.log(agentConfigResponse.data);

      if (agentConfigResponse.status == "success") {
        self.showConfig = true;
        self.defaultConfigdata = JSON.parse(agentConfigResponse.data);
        self.dynamicData = JSON.stringify(self.defaultConfigdata['dynamicTemplate'], undefined, 4);
        self.configLabelMerge();
        //console.log(typeof (agentConfigResponse.data));
        //console.log(self.defaultConfigdata);
        //console.log(typeof (self.defaultConfigdata));
        this.getconfigDataParsed(self.defaultConfigdata);
        if (self.selectedOS === undefined || self.dynamicData == '') {
          self.buttonDisableStatus = true;
        } else {
          self.buttonDisableStatus = false;
        }

      } else {
        self.buttonDisableStatus = true;
        self.showMessage = "Something wrong with service, Please try again";
      }
    } else {
      self.buttonDisableStatus = true;
      self.showConfig = false;
      self.showMessage = toolName.charAt(0).toUpperCase() + toolName.slice(1) + " agent is already registered, Please select other tool.";
    }
  }

  getconfigDataParsed(data) {
    if (data != undefined) {
      for (let configDatakey of Object.keys(data)) {
        let agentConfig = new AgentConfigItem();
        let agentConfigChilds: AgentConfigItem[] = []
        let value = data[configDatakey];
        //console.log(configDatakey + "," + typeof (value) + " , " + value)
        if (typeof (data[configDatakey]) == 'object' && configDatakey != 'dynamicTemplate') {
          for (let configinnerDatakey of Object.keys(value)) {
            let agentConfigChild = new AgentConfigItem();
            //console.log("    " + configinnerDatakey + "," + typeof (value[configinnerDatakey]) + " , " + value[configinnerDatakey])
            agentConfigChild.setData(configinnerDatakey, value[configinnerDatakey], typeof (value[configinnerDatakey]))
            agentConfigChilds.push(agentConfigChild);
          }
          agentConfig.setData(configDatakey, value, typeof (value), agentConfigChilds);
        } else if (configDatakey == 'dynamicTemplate') {
          agentConfig.setData(configDatakey, JSON.stringify(value, undefined, 4), typeof (value));
        } else {
          agentConfig.setData(configDatakey, value, typeof (value));
        }
        this.agentConfigItems.push(agentConfig);
      }
      //console.log(this.agentConfigItems);
      console.log(this.agentConfigItems.length);
    }
  }

  getAgentConfigItems(filtername: any) {
    if (filtername == 'object') { //&&
      return this.agentConfigItems.filter(item => (item.type == filtername && item.key != 'dynamicTemplate'));
    } else if (filtername == 'dynamicTemplate') {
      return this.agentConfigItems.filter(item => item.key == 'dynamicTemplate');
    } else {
      return this.agentConfigItems.filter(item => item.type != 'object');
    }
  }

  saveData(actionType) {
    var self = this;
    self.updatedConfigdata = {};

    for (var key in self.defaultConfigdata) {

      if (key != "dynamicTemplate" && self.findDataType(key, self.defaultConfigdata) == "object") {

        self.item = {};

        for (var value in self.defaultConfigdata[key]) {
          self.item[value] = self.checkDatatype(self.defaultConfigdata[key][value]);
        }

        self.updatedConfigdata[key] = self.item;

        if (key == "communication" && self.dynamicData != "") {
          self.updatedConfigdata["dynamicTemplate"] = JSON.parse(self.dynamicData);
        }

      } else if (key != "dynamicTemplate") {
        self.updatedConfigdata[key] = self.checkDatatype(self.defaultConfigdata[key]);
      }
    }

    if (self.updatedConfigdata) {

      self.configData = "";
      self.configData = encodeURIComponent(JSON.stringify(self.updatedConfigdata));

      if (actionType == "Update") {

        self.agentService.updateAgent(self.editAgentDetails['agentid'], self.configData, self.selectedTool, self.selectedVersion, self.selectedOS)
          .then(function (data) {

            if (data.status == "success") {
              self.sendStatusMsg("updated");
            } else {
              self.sendStatusMsg("update");
            }
          })
          .catch(function (data) {
            self.sendStatusMsg("service_error");
          });


      } else {

        self.agentService.registerAgent(self.selectedTool, self.selectedVersion, self.selectedOS, self.configData, self.trackingUploadedFileContentStr)
          .then(function (data) {
            //console.log(data);
            if (data.status == "success") {
              self.sendStatusMsg("registered");
            } else {
              self.sendStatusMsg("register");
            }
          })
          .catch(function (data) {
            self.sendStatusMsg("service_error");
          });

      }

    }
  }

  sendStatusMsg(Msg): void {
    this.showMessage = Msg
  }

  checkDatatype(dataVal) {

    if (typeof (dataVal) == "boolean") { return dataVal; }
    else if (isNaN(dataVal)) {

      if (dataVal == "true") { this.datatypeVal = true; return this.datatypeVal; }
      else if (dataVal == "false") { this.datatypeVal = false; return this.datatypeVal; }
      else { return dataVal; }

    }
    else {
      return parseInt(dataVal);
    }
  }

  concatConfigelement(addObj): void {
    var self = this;

    for (var vkeys in addObj) {

      if (self.findDataType(vkeys, addObj) == 'object' && vkeys != "dynamicTemplate") {

        if (!self.defaultConfigdata.hasOwnProperty(vkeys)) {
          self.defaultConfigdata[vkeys] = addObj[vkeys];
        }
        for (var vkeys1 in addObj[vkeys]) {
          if (!self.defaultConfigdata[vkeys].hasOwnProperty(vkeys1)) {
            self.defaultConfigdata[vkeys][vkeys1] = addObj[vkeys][vkeys1];
          }
        }
      } else {

        if (!self.defaultConfigdata.hasOwnProperty(vkeys)) {
          self.defaultConfigdata[vkeys] = addObj[vkeys];
        }
      }

    }
  }

  removeConfigelement(remObj): void {
    var self = this;

    for (var dkeys in self.defaultConfigdata) {

      if (self.findDataType(dkeys, self.defaultConfigdata) == 'object' && dkeys != "dynamicTemplate") {

        if (!remObj.hasOwnProperty(dkeys)) {
          delete self.defaultConfigdata[dkeys];
        }

        for (var dkeys1 in self.defaultConfigdata[dkeys]) {
          if (!remObj[dkeys].hasOwnProperty(dkeys1)) {
            delete self.defaultConfigdata[dkeys][dkeys1];
          }
        }

      } else {
        if (!remObj.hasOwnProperty(dkeys)) {
          delete self.defaultConfigdata[dkeys];
        }
      }
    }
  }
  configLabelMerge(): void {

    var self = this;
    self.configDesc = InsightsInitService.configDesc;
    //console.log(self.configDesc);
    for (var key in self.defaultConfigdata) {
      if (self.configDesc.hasOwnProperty(key)) {
        self.configAbbr[key] = self.configDesc[key];
      } else {
        self.configAbbr[key] = key;
      }
    }
  }
  findDataType(key, arr): string {
    return typeof (arr[key]);
  }

  checkValidation(): void {
    var self = this;
    for (var key in self.validationArr) {
      if (self.validationArr[key]['tool'] == self.selectedTool) {
        self.isRegisteredTool = true;
        self.selectedTool = "";
      }
    }
  }
}
