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

@Component({
  selector: 'app-businessmapping',
  templateUrl: './businessmapping.component.html',
  styleUrls: ['./businessmapping.component.css', './../../home.module.css']
})
export class BusinessMappingComponent implements OnInit {

  selectedAgent: any;
  agentMappingLabels: AgentMappingLabel[] = [];
  agentDataSource: any = [];
  agentPropertyDataSource: any = [];
  displayedColumns: any = [];
  selection: any = new SelectionModel(true, []);
  spans = [];
  isEditData = true;
  label: String = "";
  selectedAgentMappingLabels: AgentMappingLabel[] = [];
  constructor(private businessMappingService: BusinessMappingService) {
    this.gatToolInfo();
  }

  ngOnInit() {
  }

  // Loads Register Agent List
  async gatToolInfo() {
    try {
      var dictResponse = await this.businessMappingService.loadToolsAndCategories();
      console.log(dictResponse);
      if (dictResponse != null) {
        for (var key in dictResponse.data) {
          this.agentDataSource.push(dictResponse.data[key]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async loadAgentProperties(selectedAgent1) {
    try {
      let usersResponseData = await this.businessMappingService.loadToolProperties(selectedAgent1.toolName, selectedAgent1.categoryName);
      console.log(usersResponseData)
      this.displayedColumns = ['checkbox', 'toolproperties', 'propertyValue', 'propertyLabel'];//, 'action' 
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
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.agentPropertyDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.agentPropertyDataSource.data.forEach(row => this.selection.select(row));
  }

  statusEdit(selectedElement) {
    console.log(selectedElement);
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
    const numSelected = this.selection.selected.length
    console.log(numSelected);

  }

  saveData() {
    console.log(this.selection);
    const numSelected = this.selection.selected.length
    console.log(numSelected);
    var selectedData = this.selection.selected;
    selectedData.forEach(
      row => {
        console.log(row);
        let agentMappingLabelSelected = new AgentMappingLabel(row.id, row.key, row.value, this.label);
        this.selectedAgentMappingLabels.push(agentMappingLabelSelected);
      }
    );
    console.log(this.label);
    console.log(this.selectedAgentMappingLabels);
  }


}
