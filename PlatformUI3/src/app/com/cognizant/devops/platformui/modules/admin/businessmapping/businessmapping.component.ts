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
  constructor(private businessMappingService: BusinessMappingService, public messageDialog: MessageDialogService) {
    this.gatToolInfo();
  }

  ngOnInit() {
    console.log(" ngOnInit ");
    this.selectedAgent = undefined;
    this.isListView = false;
    this.agentDataSource = [];
    this.selectedMappingAgent = undefined;
    this.now = new Date();//"yyyy-MM-dd'T'HH:mm:ss" 'Z'
  }

  // Loads Register Agent List
  async gatToolInfo() {
    try {
      var dictResponse = await this.businessMappingService.loadToolsAndCategories();
      console.log(dictResponse);
      if (dictResponse != null) {
        for (var key in dictResponse.data) {
          this.agentList.push(dictResponse.data[key]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getAgentMappingDetail(selectedAgent) {
    this.isEditData = false;
    this.selectedAgent = selectedAgent;
    let usersResponseData = await this.businessMappingService.getToolMapping(this.selectedAgent.toolName);
    console.log(usersResponseData);

    if (usersResponseData.status == "success") {
      if (usersResponseData.data != undefined) {
        /*var json = JSON.parse(JSON.stringify(usersResponseData.data));
        delete json.type;
        console.log(json);*/

        var invalidKeyPatternArray = ['adminuser', 'inSightsTime', 'toolCategoryName',
          'inSightsTimeX', 'toolName', 'deleted', 'id', 'type', 'bmlabel'];
        usersResponseData.data = this.removeInvalidKeys(usersResponseData.data, invalidKeyPatternArray);
        console.log(usersResponseData.data);
        for (let data of usersResponseData.data) {
          //var subData = data.map(({ adminuser, ...rest }) => rest);
          //console.log(subData);
          this.agentDataSource.push({ 'bmlabel': data.bmlabel, 'properties': data.propString });
        }
      }
    }
    this.displayedColumns = ['radio', 'mappinglabel', 'properties']
    this.isListView = true;
    this.subHeading = "Label List";
    console.log(this.agentDataSource);
    console.log(this.selectedMappingAgent);
  }

  removeInvalidKeys(jsonData, invalidKeyPatternArray) {
    var length = jsonData.length;
    for (let i = 0; i < length; i++) {
      let propString = undefined;
      console.log(Object.keys(jsonData[i]));
      for (let key of Object.keys(jsonData[i])) {
        if (invalidKeyPatternArray.indexOf(key) > -1) {
          console.log(jsonData[i][key]);
        } else {
          if (propString == undefined) {
            propString = key + " <span style='color:#FF8F1C;padding:2px' > : </span>" + jsonData[i][key];
          } else {
            propString += "" + "<br>" + key + " <span style='color:#FF8F1C;padding:2px' > : </span>" + jsonData[i][key];
          }
        }
      }
      jsonData[i]['propString'] = propString;
      /*for (let prop of invalidKeyPatternArray) {
        delete jsonData[i][prop];
      }*/
    }
    return jsonData;
  }

  async loadAgentProperties(selectedAgent) {
    try {
      let usersResponseData = await this.businessMappingService.loadToolProperties(this.selectedAgent.toolName, selectedAgent.categoryName);
      console.log(usersResponseData)
      this.displayedToolColumns = ['checkbox', 'toolproperties', 'propertyValue', 'propertyLabel'];//, 'action' 
      if (usersResponseData.data != undefined && usersResponseData.status == "success") {
        for (var key in usersResponseData.data) {
          console.log(usersResponseData.data[key]);
          let agentMappingLabel = new AgentMappingLabel(key, usersResponseData.data[key], "", "a");
          this.agentMappingLabels.push(agentMappingLabel);
        }
        console.log(this.agentMappingLabels);
        this.cacheSpan('label', d => d.id);
        this.agentPropertyDataSource = this.agentMappingLabels;
        console.log(this.agentPropertyDataSource);
        console.log(this.selection);
      } else {
        this.agentPropertyDataSource = [];
      }
      this.agentPropertyDataSource = new MatTableDataSource(this.agentPropertyDataSource);
    } catch (error) {
      console.log(error);
    }

    //this.getAgentMappingDetail(this.selectedAgent);
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
    console.log(selectedElement);
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
      //console.log(key + "  " + count);
      // Store the number of similar values that were found (the span) and skip i to the next unique row.

      this.spans[i][key] = count;
      i += count;//+
    }
  }

  getRowSpan(col, index) {
    //console.log(index + "  " + col)
    //console.log(this.spans);
    //console.log(this.spans[index] && this.spans[index][col]);
    return this.spans[index] && this.spans[index][col];
  }

  editData() {
    console.log(this.selectedMappingAgent);
    const numSelected = this.selection.selected.length
    console.log(numSelected);
    this.isListView = false;
    this.loadAgentProperties(this.selectedAgent);
    this.isEditData = false;
    this.subHeading = "Edit Label for " + this.selectedMappingAgent.bmlabel;
  }

  addAgentLabelData() {
    this.isListView = false;
    this.loadAgentProperties(this.selectedAgent);
    this.subHeading = "Add Label";
  }

  saveData() {
    console.log(this.selectedAgent);
    console.log(this.selection);
    const numSelected = this.selection.selected.length
    console.log(numSelected);
    if (numSelected == 0 || this.label == undefined) {
      this.messageDialog.showApplicationsMessage("Please select atleast one Tool Property and label", "WARN");
    } else {
      var title = "Save Label";
      var dialogmessage = "Are you sure you want to save your changes?";
      const dialogRef = this.messageDialog.showConfirmationMessage(title, dialogmessage, "", "ALERT", "30%");
      dialogRef.afterClosed().subscribe(result => {
        //console.log('The dialog was closed  ' + result);
        if (result == 'yes') {
          var selectedData = this.selection.selected;
          selectedData.forEach(
            row => {
              console.log(row);
              let agentMappingLabelSelected = new AgentMappingLabel(row.id, row.key, row.value, this.label);
              this.selectedAgentMappingLabels.push(agentMappingLabelSelected);
              this.agentPropertyList[row.key] = row.value;
            }
          );
          console.log(this.label);
          console.log(this.selectedAgentMappingLabels);

          this.agentPropertyList['toolName'] = this.selectedAgent.toolName;
          this.agentPropertyList['toolCategoryName'] = this.selectedAgent.toolCategoryName;
          this.agentPropertyList['bmlabel'] = this.label;
          this.agentPropertyList['adminuser'] = 'admin';
          this.agentPropertyList['inSightsTimeX'] = this.now;
          this.agentPropertyList['inSightsTime'] = this.now.getTime();
          var agentBMparameter = JSON.stringify(this.agentPropertyList
          );//'properties'
          console.log(agentBMparameter);
          var saveResponse = this.businessMappingService.saveToolMapping(agentBMparameter);
          if (saveResponse.status = "success") {
            this.messageDialog.showApplicationsMessage("Label save Successfully ", "SUCCESS");
          } else {
            this.messageDialog.showApplicationsMessage("Unable to save label " + saveResponse.message, "ERROR");
          }
        } else {
          this.selectedAgentMappingLabels = [];
          this.label = undefined;
        }
        this.getAgentMappingDetail(this.selectedAgent);
      });
    }
  }


}
