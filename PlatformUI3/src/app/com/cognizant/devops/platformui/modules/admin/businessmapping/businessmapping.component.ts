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
import { Component, OnInit, Injectable } from '@angular/core';
import { BusinessMappingService } from './businessmapping.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { AgentMappingLabel } from '@insights/app/modules/admin/businessmapping/agentMappingLabel';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material';
import { MessageDialogService } from '@insights/app/modules/application-dialog/message-dialog-service';


@Component({
  selector: 'app-businessmapping',
  templateUrl: './businessmapping.component.html',
  styleUrls: ['./businessmapping.component.css', './../../home.module.css']
})
export class BusinessMappingComponent implements OnInit {

  selectedAgent: any;
  agentMappingLabels: AgentMappingLabel[] = [];
  agentDataSource: any = [];
  agentList: any = [];
  agentPropertyDataSource: any = [];
  displayedToolColumns: any = [];
  displayedColumns: any = [];
  selection: any = new SelectionModel(true, []);
  spans = [];
  isEditData = false;
  isListView = false;
  label: String = undefined;
  agentPropertyList = {};
  selectedAgentMappingLabels: AgentMappingLabel[] = [];
  selectedMappingAgent: any = undefined;
  subHeading: String = "";
  now: any;
  masterToolPropertiesData: any;
  actionType: any;
  extraKeyPatternArray = ['adminuser', 'inSightsTime', 'categoryName',
    'inSightsTimeX', 'toolName', 'deleted', 'id', 'type', 'businessmappinglabel', 'uuid'];
  additionalProperties = ['inSightsTime', 'categoryName', 'inSightsTimeX', 'toolName',
    'uuid', 'type', 'businessmappinglabel', 'propertiesString', 'id', 'deleted', 'adminuser'];
  constructor(private businessMappingService: BusinessMappingService, public messageDialog: MessageDialogService) {
    this.gatToolInfo();
  }

  ngOnInit() {
    //console.log(" ngOnInit ");
    this.selectedAgent = undefined;
    this.isListView = false;
    this.agentDataSource = [];
    this.selectedMappingAgent = undefined;
    this.now = new Date();
  }

  // Loads Register Agent List
  async gatToolInfo() {
    try {
      var dictResponse = await this.businessMappingService.loadToolsAndCategories();
      //console.log(dictResponse);
      if (dictResponse != null) {
        for (var key in dictResponse.data) {
          this.agentList.push(dictResponse.data[key]);
        }
      }
    } catch (error) {
      //console.log(error);
    }
  }

  getAgentMappingDetail(selectedAgent) {
    this.masterToolPropertiesData = undefined;
    this.selectedAgent = selectedAgent;
    var self = this;
    this.businessMappingService.loadToolProperties(this.selectedAgent.toolName, selectedAgent.categoryName)
      .then(function (data) {
        //console.log(data);
        self.masterToolPropertiesData = data;
      });
    this.displayAgentMappingDetail()
  }

  displayAgentMappingDetail() {
    var self = this;
    self.isEditData = false;
    var agentDataSourceArray = [];
    self.businessMappingService.getToolMapping(this.selectedAgent.toolName)
      .then(function (usersMappingResponseData) {
        //console.log(usersMappingResponseData);
        if (usersMappingResponseData.status == "success") {
          if (usersMappingResponseData.data != undefined) {
            usersMappingResponseData.data = self.clubProperties(usersMappingResponseData.data);
            //console.log(usersMappingResponseData.data);
            agentDataSourceArray = usersMappingResponseData.data;
          }
        } else {
          self.messageDialog.showApplicationsMessage("Something went wrong with service,Please try again ", "WARN");
        }
        //console.log(agentDataSourceArray);
        self.displayedColumns = ['radio', 'mappinglabel', 'properties']
        self.isListView = true;
        self.subHeading = "Label List";
        self.agentDataSource = new MatTableDataSource(agentDataSourceArray);
        //console.log(self.agentDataSource);
        //console.log(self.selectedMappingAgent);
      });
  }

  clubProperties(jsonData) {
    var length = jsonData.length;
    for (let i = 0; i < length; i++) {
      let propString = undefined;
      ////console.log(Object.keys(jsonData[i]));
      for (let key of Object.keys(jsonData[i])) {
        if (this.extraKeyPatternArray.indexOf(key) > -1) {
          ////console.log(jsonData[i][key]);
        } else {
          if (propString == undefined) {
            propString = key + " <span style='color:#FF8F1C;padding:2px' > : </span>" + jsonData[i][key];
          } else {
            propString += "" + "<br>" + key + " <span style='color:#FF8F1C;padding:2px' > : </span>" + jsonData[i][key];
          }
        }
      }
      jsonData[i]['propertiesString'] = propString;
    }
    return jsonData;
  }

  async loadAgentProperties(selectedAgent) {
    try {
      this.agentPropertyDataSource = [];
      this.agentMappingLabels = [];
      //console.log(this.masterToolPropertiesData)
      this.displayedToolColumns = ['checkbox', 'toolproperties', 'propertyValue', 'propertyLabel'];
      if (this.masterToolPropertiesData.data != undefined && this.masterToolPropertiesData.status == "success") {
        if (this.actionType == 'edit') {
          var existingKeys = Object.keys(this.selectedMappingAgent);
          for (let key of existingKeys) {
            ////console.log(this.masterToolPropertiesData.data[key]);
            let agentMappingLabel;
            if (this.additionalProperties.indexOf(key) > -1) {
              agentMappingLabel = new AgentMappingLabel(key, key, this.selectedMappingAgent[key], "a", false);
            } else {
              agentMappingLabel = new AgentMappingLabel(key, key, this.selectedMappingAgent[key], "a", true);
            }
            this.agentMappingLabels.push(agentMappingLabel);
          }
          for (let masterData of this.masterToolPropertiesData.data) {
            //console.log(masterData);
            if (existingKeys.indexOf(masterData) == -1) {
              let agentMappingLabel = new AgentMappingLabel(masterData, masterData, "", "a", true);
              this.agentMappingLabels.push(agentMappingLabel);
            }
          }
          this.label = this.selectedMappingAgent.businessmappinglabel;
        } else if (this.actionType == "add") {
          for (var key in this.masterToolPropertiesData.data) {
            ////console.log(this.masterToolPropertiesData.data[key]);
            let agentMappingLabel;
            if (this.additionalProperties.indexOf(this.masterToolPropertiesData.data[key]) > -1) {
              agentMappingLabel = new AgentMappingLabel(key, this.masterToolPropertiesData.data[key], "", "a", false);
            } else {
              agentMappingLabel = new AgentMappingLabel(key, this.masterToolPropertiesData.data[key], "", "a", true);
            }
            this.agentMappingLabels.push(agentMappingLabel);
          }
        }
        //console.log(this.agentMappingLabels);
        this.cacheSpan('label', d => d.id);
        this.agentPropertyDataSource = this.agentMappingLabels;
      } else {
        this.agentPropertyDataSource = [];
      }
      this.agentPropertyDataSource = new MatTableDataSource(this.agentPropertyDataSource);
    } catch (error) {
      console.log(error);
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.agentPropertyDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. readChange*/
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.agentPropertyDataSource.data.forEach(row => this.selection.select(row));
  }

  statusEdit(selectedElement) {
    this.isListView = true;
    this.isEditData = true;
  }

  cacheSpan(key, accessor) {
    for (let i = 0; i < this.agentMappingLabels.length;) {
      let currentValue = accessor(this.agentMappingLabels[i].label);
      let count = 1;
      // Iterate through the remaining rows to see how many match the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.agentMappingLabels.length; j++) {
        if (currentValue != accessor(this.agentMappingLabels[j].label)) {
          break;
        }
        count++;
      }
      if (!this.spans[i]) {
        this.spans[i] = {};
      }
      ////console.log(key + "  " + count);
      // Store the number of similar values that were found (the span) and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;//+
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }

  editData() {
    console.log(this.selectedAgent + "    " + this.actionType);
    console.log(this.selectedMappingAgent);
    const numSelected = this.selection.selected.length
    this.isListView = false;
    this.actionType = "edit"
    this.loadAgentProperties(this.selectedAgent);
    this.isEditData = false;
    this.subHeading = "Edit Label for " + this.selectedMappingAgent.bmlabel;
  }

  addAgentLabelData() {
    this.isListView = false;
    this.actionType = "add"
    this.loadAgentProperties(this.selectedAgent);
    this.subHeading = "Add Label";
  }

  saveData() {
    console.log(this.selectedAgent + "    " + this.actionType);
    console.log(this.selectedMappingAgent);
    var self = this;
    var agentBMparameter;
    this.agentPropertyList = {};
    //console.log(this.selection);
    const numSelected = this.selection.selected.length
    //console.log(numSelected);
    if (numSelected == 0 || this.label == undefined) {
      this.messageDialog.showApplicationsMessage("Please select atleast one Tool Property and label", "WARN");
    } else {
      var title = "Save Label";
      //Validate Label
      var selectedData = this.selection.selected;
      selectedData.forEach(
        row => {
          let agentMappingLabelSelected = new AgentMappingLabel(row.id, row.key, row.value, this.label, true);
          this.selectedAgentMappingLabels.push(agentMappingLabelSelected);
          this.agentPropertyList[row.key] = row.value;
        }
      );
      var dialogmessage = "Are you sure you want to save your changes?";
      const dialogRef = this.messageDialog.showConfirmationMessage(title, dialogmessage, "", "ALERT", "30%");
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'yes') {
          if (this.actionType == "add") {
            this.agentPropertyList['toolName'] = this.selectedAgent.toolName;
            this.agentPropertyList['categoryName'] = this.selectedAgent.toolCategoryName;
            this.agentPropertyList['businessmappinglabel'] = this.label;
            this.agentPropertyList['adminuser'] = 'admin';
            this.agentPropertyList['inSightsTimeX'] = this.now;
            this.agentPropertyList['inSightsTime'] = this.now.getTime();
            agentBMparameter = JSON.stringify(this.agentPropertyList);
            //console.log(agentBMparameter);
            this.businessMappingService.saveToolMapping(agentBMparameter)
              .then(function (saveResponsedata) {
                if (saveResponsedata.status = "success") {
                  self.messageDialog.showApplicationsMessage("Label save Successfully ", "SUCCESS");
                } else {
                  self.messageDialog.showApplicationsMessage("Unable to save label " + saveResponsedata.message, "ERROR");
                }
                self.displayAgentMappingDetail();
              });
          } else if (this.actionType == "edit") {
            //console.log(this.agentPropertyDataSource.data);
            for (let selectedData of this.agentPropertyDataSource.data) {
              this.agentPropertyList[selectedData.key] = selectedData.value;
            }
            agentBMparameter = JSON.stringify(this.agentPropertyList);
            //console.log(agentBMparameter);
            this.businessMappingService.editToolMapping(agentBMparameter)
              .then(function (editResponsedata) {
                if (editResponsedata.status = "success") {
                  self.messageDialog.showApplicationsMessage("Label save Successfully ", "SUCCESS");
                } else {
                  self.messageDialog.showApplicationsMessage("Unable to save label " + editResponsedata.message, "ERROR");
                }
                self.displayAgentMappingDetail();
              });
          }
        } else {
          self.selectedAgentMappingLabels = [];
          self.label = undefined;
          self.displayAgentMappingDetail();
        }
      });
    }
  }


}
