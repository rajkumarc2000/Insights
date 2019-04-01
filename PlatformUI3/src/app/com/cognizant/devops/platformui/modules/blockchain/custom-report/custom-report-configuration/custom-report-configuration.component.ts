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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, NavigationExtras } from '@angular/router';
import { MessageDialogService } from '@insights/app/modules/application-dialog/message-dialog-service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { QueryBuilderService } from '@insights/app/modules/blockchain/custom-report/custom-report-service';
import { saveAs as importedSaveAs} from "file-saver"; 

@Component({
  selector: 'app-custom-reportconfiguration',
  templateUrl: './custom-report-configuration.component.html',
  styleUrls: ['../custom-report.component.css', './../../../home.module.css']
})
export class CustomReportConfigComponent implements OnInit {
  receivedParam: any;
  showThrobber: boolean = false;
  subTitleName: string;
  subTitleInfoText: string;
  btnValue: string;
  queryForm: FormGroup;
  frequencyList = ['Daily', 'Weekly', 'Fortnightly', 'Monthly'];
  queryConfigstatusCode;
  queryConfigstatus;
  selectedFile: File = null;
  showFile: boolean = false;

  ngOnInit() {
    console.log("compoenntconfig --");

    this.route.queryParams.subscribe(params => {
      this.receivedParam = JSON.parse(params["reportparam"]);

      this.showThrobber = true;
      this.initializeVariable();
    });
  }

  ngAfterViewInit() {
  }


  constructor(private router: Router, private route: ActivatedRoute,
    public messageDialog: MessageDialogService, private formBuilder: FormBuilder,
    public queryBuilderService: QueryBuilderService) {
    console.log("compoenntconfig cccc--");
    this.queryForm = this.formBuilder.group({
      reportname: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      subscribers: ['', [Validators.required, Validators.email]],
      query: ['', [Validators.required]],
      queryPath : ['']
    })
  }

  get formValues() { return this.queryForm.controls; }

  initializeVariable() {
    console.log('in initva');
    if (this.receivedParam.type == "update") {
      this.showThrobber = false;
      console.log('in update', this.receivedParam);
      const { data } = this.receivedParam;
      const datas = {
        reportname: data.reportName,
        frequency: data.frequency,
        subscribers: data.subscribers,
        queryPath : data.querypath
      }
      console.log('update', datas);
      this.queryForm.patchValue(datas);
      this.btnValue = "Update";
      this.subTitleName = "Update Query"
      this.subTitleInfoText = "(You may edit the Query builder from the main page after adding)";
    } else if (this.receivedParam.type == "add") {
      this.showThrobber = false;
      this.btnValue = "add";
      this.subTitleName = "Build Query"
      this.subTitleInfoText = "(You may edit the Query builder from the main page after adding)";
    }
  }

  editFile() {
    this.showFile = !this.showFile;
    console.log('edit')
  }

  openFile() {
    window.open(this.queryForm.get('query').value, '_blank');
  }


  onFileChanged(event) {
    this.selectedFile = <File>event.target.files[0];
    console.log(this.selectedFile);
  }

  async saveData(actionType) {
    let result;
    const fd = new FormData();
    fd.append('json', this.selectedFile, this.selectedFile.name);
    if (actionType == 'add') {
        console.log('add');
        console.log('inside add', this.queryForm.value);
        let upload = await this.queryBuilderService.uploadFile(fd);
        if (upload.status == "success") {
            result = await this.queryBuilderService.saveOrUpdateQuery(this.queryForm.value,this.selectedFile.name);
            console.log('result --', result);
            this.queryConfigstatus = "Query Added Successfully"
        } else {
            console.log('some issue in upload, Please check the permission');
            this.messageDialog.showApplicationsMessage("Error uploading File", "ERROR");
        }
    } else {
      console.log('update');
      console.log('inside update', this.queryForm.value);
      let upload = await this.queryBuilderService.uploadFile(fd);
      if (upload.status == "success") {
        result = await this.queryBuilderService.saveOrUpdateQuery(this.queryForm.value,this.selectedFile.name);
        console.log('result --', result);
        this.queryConfigstatus = "Query Updated Successfully"
      } else {
        console.log('some issue in upload, Please check the permission');
        this.messageDialog.showApplicationsMessage("Error uploading File", "ERROR");
      }
    }

    if (result.status == "success") {
        this.queryConfigstatusCode = "SUCCESS";
        let navigationExtras: NavigationExtras = {
             skipLocationChange: true,
             queryParams: {
                   "querystatus": this.queryConfigstatus,
                   "queryConfigstatusCode": this.queryConfigstatusCode
              }
        };
        this.router.navigate(['InSights/Home/querybuilder'], navigationExtras);
    } else {
        this.queryConfigstatus = "DB Operation Failed!"
        this.queryConfigstatusCode = "ERROR";
        this.messageDialog.showApplicationsMessage(this.queryConfigstatus, "ERROR");
    }
  }

  cancelChange(actionType) {
    var title = "Cancel";
    var dialogmessage = "Are you sure you want to discard your changes?";
    const dialogRef = this.messageDialog.showConfirmationMessage(title, dialogmessage, "", "ALERT", "30%");
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed  ' + result);
      if (result == 'yes') {
        let navigationExtras: NavigationExtras = {
          skipLocationChange: true,
          queryParams: {
            "agentstatus": undefined,
            "agentConfigstatusCode": ""
          }
        };
        this.router.navigate(['InSights/Home/querybuilder'], navigationExtras);
      }
    });
  }


  downloadFile(filepath) {
    this.queryBuilderService.downloadFile(filepath).subscribe((data) => {
      console.log(data);
      importedSaveAs(data);
    },
    error => {
      console.log(error);
      this.messageDialog.showApplicationsMessage("Error downloading File", "ERROR");
    });
  }

}