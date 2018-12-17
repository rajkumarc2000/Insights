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
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { AgentConfigItem } from '@insights/app/modules/admin/agent-management/agent-configuration/agentConfigItem';


@Component({
  selector: 'app-agent-configuration',
  templateUrl: './agent-configuration.component.html',
  styleUrls: ['../agent-management.component.css', './../../../home.module.css']
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
  toolVersionData: any;
  showMessage: string;
  showConfig: boolean = false;
  showThrobber: boolean = false;
  editAgentDetails = {};
  headerData = [];
  updatedConfigdata = {};
  updatedConfigParamdata = {};
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
  oldSelectedVersion: string;
  receivedParam: any;
  agentConfigItems: AgentConfigItem[] = [];
  selectedAgentKey: string;
  agentConfigstatus: string;
  constructor(public config: InsightsInitService, public agentService: AgentService,
    private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    console.log(this.route.queryParams);
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.receivedParam = JSON.parse(params["agentparameter"]);
      //this.toolVersionData = JSON.parse(params["versionAndToolInfo"]);
      console.log(this.receivedParam);
      //console.log(this.toolVersionData);
      this.showThrobber = true;
      this.initializeVariable();
      this.getOsList()
      this.getOsVersionTools();
    });

  }

  initializeVariable() {
    if (this.receivedParam.type == "update") {
      this.btnValue = "Update";
      this.buttonDisableStatus = true;
      this.defaultConfigdata = {};
      console.log(this.receivedParam.detailedArr);
      if (this.receivedParam.detailedArr != null) {
        console.log(this.receivedParam.detailedArr);
        this.selectedOS = this.receivedParam.detailedArr.osVersion;
        this.selectedVersion = this.receivedParam.detailedArr.agentVersion;
        this.oldSelectedVersion = this.receivedParam.detailedArr.agentVersion;
        this.selectedTool = this.receivedParam.detailedArr.toolName;
        this.selectedAgentKey = this.receivedParam.detailedArr.agentKey;
        this.getDbAgentConfig();
      }
    } else {
      this.btnValue = "Register";
      this.selectedOS = undefined;
      this.selectedVersion = undefined
      this.selectedTool = undefined;
    }
  }

  getOsList() {
    var agentsListFromUiConfig = this.config.getAgentsOsList();
    if (agentsListFromUiConfig !== undefined) {
      this.osLists = agentsListFromUiConfig;
    }

  }

  async getOsVersionTools() {
    var self = this;
    var selversion;
    self.toolsArr = [];

    console.log(this.selectedVersion);
    this.toolVersionData = await this.agentService.getDocRootAgentVersionTools()

    console.log(this.toolVersionData);
    if (this.toolVersionData.status == "success") {
      if (this.selectedVersion) {
        this.toolsArr = this.toolVersionData.data[this.selectedVersion];
        for (var key in this.toolVersionData.data) {
          this.versionList.push(key);
        }
      } else {
        for (var key in this.toolVersionData.data) {
          this.versionList.push(key);
        }
      }
    } else {
      self.showMessage = "Problem with Docroot URL (or) Platform service. Please try again";
    }
    self.showThrobber = false;

    console.log(self.toolsArr);
  }

  versionOnChange(key, type): void {
    var self = this;
    console.log(" In version On Change " + key + " " + type);
    console.log(this.toolVersionData.data);
    if (type == "validate") {
      if (self.selectedVersion === undefined || self.selectedTool === undefined || self.selectedOS === undefined) {
        self.buttonDisableStatus = true;
      } else {
        self.buttonDisableStatus = false;
      }
    } else if (type == "Update") {
      self.showConfig = false;
      self.showMessage = "";
      console.log(key + "  " + this.selectedVersion + " " + this.oldSelectedVersion);
      //self.defaultConfigdata = JSON.parse(self.tempConfigdata);
      if (this.oldSelectedVersion == key) {
        this.getAgentConfig(key, self.selectedTool);
      } else {
        console.log(" retrivr data for another version " + key);
        self.configData = JSON.stringify(self.agentConfigItems);
        self.agentService.getDocrootAgentConfig(key, self.selectedTool)
          .then(function (vdata) {
            console.log(vdata);
            self.showConfig = true;
            self.versionChangeddata = JSON.parse(vdata.data);
            console.log(self.versionChangeddata);
            self.concatConfigelement(self.versionChangeddata);
            self.removeConfigelement(self.versionChangeddata);
            self.configLabelMerge();
          })
          .catch(function (vdata) {
            self.showMessage = "Something wrong with service, Please try again";
          });
      }
    } else {
      self.buttonDisableStatus = true;
      self.selectedTool = "";
      self.toolsArr = [];
      self.toolsArr = this.toolVersionData.data[key];
    }
  }


  async getAgentConfig(version, toolName) {
    console.log("In getAgentConfig " + version + "  " + toolName);
    var self = this;
    self.isRegisteredTool = false;
    self.checkValidation();

    if (!self.isRegisteredTool) {
      this.agentConfigItems = [];
      self.showConfig = false;
      self.showMessage = "";

      var agentConfigResponse = await self.agentService.getDocrootAgentConfig(version, toolName)
      console.log(agentConfigResponse);
      console.log(agentConfigResponse.data);

      if (agentConfigResponse.status == "success") {
        self.showConfig = true;
        self.dynamicData = JSON.stringify(self.defaultConfigdata['dynamicTemplate'], undefined, 4);
        this.defaultConfigdata = JSON.parse(agentConfigResponse.data);
        this.getconfigDataParsed(self.defaultConfigdata);
        self.configLabelMerge();
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
        if (typeof (data[configDatakey]) == 'object' && configDatakey != 'dynamicTemplate') {
          for (let configinnerDatakey of Object.keys(value)) {
            let agentConfigChild = new AgentConfigItem();
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
      console.log(this.agentConfigItems.length);
    }
  }

  getAgentConfigItems(filtername: any) {
    if (filtername == 'object') {
      return this.agentConfigItems.filter(item => (item.type == filtername && item.key != 'dynamicTemplate'));
    } else if (filtername == 'dynamicTemplate') {
      return this.agentConfigItems.filter(item => item.key == 'dynamicTemplate');
    } else {
      return this.agentConfigItems.filter(item => item.type != 'object');
    }
  }

  async getDbAgentConfig() {
    var self = this;
    self.showConfig = false;
    self.showThrobber = true;
    self.showMessage = "";
    if (this.selectedAgentKey != undefined) {
      var agentData = await self.agentService.getDbAgentConfig(this.selectedAgentKey)

      if (agentData != undefined) {
        console.log(this.selectedAgentKey + "   " + agentData);
        self.showConfig = true;
        self.showThrobber = false;
        this.defaultConfigdata = JSON.parse(agentData.data.agentJson);
        this.getconfigDataParsed(this.defaultConfigdata);
        this.configLabelMerge();
      } else {
        self.showThrobber = false;
        self.showMessage = "Something wrong with service, Please try again";
      }
    }


  }

  async saveData(actionType) {
    var self = this;
    this.agentConfigstatus = undefined;
    self.updatedConfigdata = {};
    this.updatedConfigParamdata = {};
    console.log(actionType);

    for (let configParamData of this.agentConfigItems) {
      if (configParamData.key != "dynamicTemplate" && configParamData.type == "object") {
        this.item = {};
        for (let configinnerData of configParamData.children) {
          this.item[configinnerData.key] = this.checkDatatype(configinnerData.value);
        }
        this.updatedConfigParamdata[configParamData.key] = this.item;
      } else if (configParamData.key != "dynamicTemplate" && configParamData.type != "object") {
        this.updatedConfigParamdata[configParamData.key] = this.checkDatatype(configParamData.value);
      } else if (configParamData.key == "dynamicTemplate") {
        this.updatedConfigParamdata["dynamicTemplate"] = JSON.parse(configParamData.value);
      }
    }
    console.log(this.updatedConfigParamdata);

    console.log(self.updatedConfigdata);
    if (this.updatedConfigParamdata) {

      self.configData = "";
      self.configData = JSON.stringify(self.updatedConfigParamdata);
      //console.log(this.configData)
      if (actionType == "Update") {

        var updateAgentRes = await self.agentService.updateAgent(this.selectedAgentKey, self.configData, self.selectedTool, self.selectedVersion, self.selectedOS)

        self.agentConfigstatus = updateAgentRes.status;
        //console.log(updateAgentRes);
        if (updateAgentRes.status == "success") {
          self.sendStatusMsg("updated");
          self.agentConfigstatus = "updated"
        } else {
          self.sendStatusMsg("update");
          self.agentConfigstatus = "update"
        }
      } else {

        var registerAgentRes = await self.agentService.registerAgent(self.selectedTool, self.selectedVersion, self.selectedOS, self.configData, self.trackingUploadedFileContentStr)
        self.agentConfigstatus = registerAgentRes.status;
        //console.log(registerAgentRes);
        if (registerAgentRes.status == "success") {
          self.sendStatusMsg("registered");
          self.agentConfigstatus = "registered"
        } else {
          self.sendStatusMsg("register");
          self.agentConfigstatus = "register"
        }
      }

    }
    console.log(this.agentConfigstatus)
    if (this.agentConfigstatus) {
      let navigationExtras: NavigationExtras = {
        skipLocationChange: true,
        queryParams: {
          "agentstatus": this.agentConfigstatus
        }
      };
      this.router.navigate(['InSights/Home/agentmanagement'], navigationExtras);
    }
  }

  sendStatusMsg(Msg): void {
    this.showMessage = Msg
  }

  checkDatatype(dataVal) {

    if (typeof (dataVal) == "boolean") {
      return dataVal;
    } else if (isNaN(dataVal)) {
      if (dataVal == "true") {
        this.datatypeVal = true;
        return this.datatypeVal;
      } else if (dataVal == "false") {
        this.datatypeVal = false;
        return this.datatypeVal;
      } else {
        return dataVal;
      }
    } else {
      return parseInt(dataVal);
    }
  }

  concatConfigelement(addObj): void {
    var self = this;

    for (var vkeys in addObj) {

      if (self.findDataType(vkeys, addObj) == 'object' && vkeys != "dynamicTemplate") {

        if (!self.configData.hasOwnProperty(vkeys)) {
          self.configData[vkeys] = addObj[vkeys];
        }
        for (var vkeys1 in addObj[vkeys]) {
          if (!self.configData[vkeys].hasOwnProperty(vkeys1)) {
            self.configData[vkeys][vkeys1] = addObj[vkeys][vkeys1];
          }
        }
      } else {

        if (!self.configData.hasOwnProperty(vkeys)) {
          self.configData[vkeys] = addObj[vkeys];
        }
      }

      /* for (let configParamData of this.agentConfigItems) {
       if (configParamData.key != "dynamicTemplate" && configParamData.type == "object") {
         this.item = {};
         for (let configinnerData of configParamData.children) {
           this.item[configinnerData.key] = this.checkDatatype(configinnerData.value);
         }
         this.updatedConfigParamdata[configParamData.key] = this.item;
       } else if (configParamData.key != "dynamicTemplate" && configParamData.type != "object") {
         this.updatedConfigParamdata[configParamData.key] = this.checkDatatype(configParamData.value);
       } else if (configParamData.key == "dynamicTemplate") {
         this.updatedConfigParamdata["dynamicTemplate"] = JSON.parse(configParamData.value);
       }
     }*/

    }
    console.log(self.configData);
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
    this.configDesc = InsightsInitService.configDesc;
    for (let configParamData of this.agentConfigItems) {
      if (this.configDesc.hasOwnProperty(configParamData.key)) {
        this.configAbbr[configParamData.key] = this.configDesc[configParamData.key];
      } else {
        this.configAbbr[configParamData.key] = configParamData.key;
      }
    }
    console.log(this.configAbbr);
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
