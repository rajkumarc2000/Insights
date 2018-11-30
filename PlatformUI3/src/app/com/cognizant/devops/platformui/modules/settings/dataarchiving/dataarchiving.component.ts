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

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataArchivingService } from '@insights/app/modules/settings/dataarchiving/dataarchiving-service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataSharedService } from '@insights/common/data-shared-service';
import { MatTable } from '@angular/material';

@Component({
  selector: 'app-dataarchiving',
  templateUrl: './dataarchiving.component.html',
  styleUrls: ['./dataarchiving.component.css']
})
export class DataArchivingComponent implements OnInit {
  fileLocation: string;
  rowLimit: string;
  backupFileFormat: string = "JSON";
  @ViewChild(MatTable) matTable: MatTable<any>;
  fileName: string;
  retention: string;
  settingsType: string;
  listView: boolean = true;
  saveView: boolean = false;
  showConfirmMessage: string;
  showThrobber: boolean;
  serviceResponseForList: any;
  datalist = [];
  settingData = {};
  nextRunTime: string;
  lastRunTime: string;
  settingJsonstring: string;
  settingJsonObj = {};
  activeFlag: string;
  lastModifiedByUser: String;
  editIconSrc = "dist/icons/svg/userOnboarding/Edit_icon_MouseOver.svg";
  showadd: boolean = false;
  dataFreq: string;
  displayedColumns = [];
  selectedRecordg: any;
  currentUserName: String;
  backupRecord = [
    { value: '10', name: '10' },
    { value: '100', name: '100' },
    { value: '1000', name: '1000' }
  ];
  dataFreqRecord = [
    { value: 'Daily', name: 'Daily' },
    { value: 'Weekly', name: 'Weekly' },
    { value: 'Monthly', name: 'Monthly' }
  ];


  constructor(private dataArchivingService: DataArchivingService, private dataShare: DataSharedService) {
    this.listData();
  }

  ngOnInit() {
    this.dataShare.currentUser.subscribe(user => this.currentUserName = user)
    console.log(this.currentUserName);
  }

  async listData() {
    var self = this;

    self.listView = true;
    self.saveView = false;

    self.datalist.length = 0;
    this.serviceResponseForList = await self.dataArchivingService.listDatapurgingdata("DATAPURGING");
    console.log(this.serviceResponseForList);
    if (this.serviceResponseForList != null) { }
    self.showThrobber = false;
    console.log(this.serviceResponseForList.status);
    if (this.serviceResponseForList.status == "success") {
      if (this.serviceResponseForList.data != undefined) {
        self.showadd = true;
        self.settingData = JSON.parse(this.serviceResponseForList.data.settingsJson);
        console.log(self.settingData);
        self.datalist.push(self.settingData);
        this.matTable.renderRows();
      } else {
        self.showadd = false;
      }
    } else {
      self.showConfirmMessage = "Something wrong with service, please try again";
    }
    console.log(this.datalist);
    this.displayedColumns = ['radio', 'DataRetentionPeriod', 'MaximumNumberOfRecords', 'Location', 'FrequencyOfDataArchival',
      'LastRuntime', 'NextRuntime', 'FileFormat'];
    setTimeout(function () {
      self.showConfirmMessage = "";
    }, 3500);
  }

  addData(): void {
    console.log("In add data");
    this.listView = false;
    this.saveView = true;
  }

  editData() {
    console.log(this.selectedRecordg)
    this.listView = false;
    this.saveView = true;
    this.retention = this.selectedRecordg['backupRetentionInDays'];
    this.rowLimit = this.selectedRecordg['rowLimit'];
    this.fileLocation = this.selectedRecordg['backupFileLocation'];
    this.backupFileFormat = this.backupFileFormat;
    this.dataFreq = this.selectedRecordg['dataArchivalFrequency'];
    this.lastRunTime = this.selectedRecordg['lastRunTime'];
    this.nextRunTime = this.selectedRecordg['nextRunTime'];
  }

  saveData() {
    console.log("In save add data");
    this.listView = false;
    this.saveView = true;
    var self = this;
    self.settingsType = "DATAPURGING";
    self.activeFlag = "Y";
    self.lastModifiedByUser = this.currentUserName;
    self.settingJsonObj = {
      "backupRetentionInDays": self.retention,
      "rowLimit": self.rowLimit,
      "backupFileLocation": self.fileLocation,
      "backupFileFormat": this.backupFileFormat,
      "dataArchivalFrequency": self.dataFreq,
      "lastRunTime": self.lastRunTime,
      "nextRunTime": ''
    }
    self.settingJsonstring = JSON.stringify(self.settingJsonObj);// encodeURIComponent()
    console.log(self.settingJsonstring);
    self.dataArchivingService.saveDatapurging(self.settingsType, self.activeFlag, self.lastModifiedByUser.toString(), self.settingJsonstring)
      .then(function (data) {
        console.log("Setting " + data);
        if (data.status == "success") {
          self.showConfirmMessage = "Settings saved successfully";
        } else {
          self.showConfirmMessage = "Failed to save settings";
        }
        self.listData();
      })
      .catch(function (data) {
        self.listView = false;
        self.saveView = true;
        self.showConfirmMessage = "Failed to save settings";
        self.listData();
      });
  }

  checkData(event, myValue, txtName) {

    if (myValue == undefined) { return '' }
    else {
      while (myValue.charAt(0) === '0') {
        myValue = myValue.substr(1);
      }
    }
    if (txtName == 'retention') { this.retention = myValue; }
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.id === o2.id && o1.name === o2.name;
  }

}
