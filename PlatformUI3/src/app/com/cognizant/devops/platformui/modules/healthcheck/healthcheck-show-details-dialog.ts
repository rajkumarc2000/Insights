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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { HealthCheckService } from './healthcheck.service';


@Component({
  selector: 'healthcheck-show-details-dialog',
  templateUrl: './healthcheck-show-details-dialog.html',
  styleUrls: ['./healthcheck-show-details-dialog.css']
})
export class ShowDetailsDialog implements OnInit {
  showContent: boolean;
  showThrobber: boolean;
  checkResponseData: boolean;
  pathName:string;
  detailType:string;
  columnLength:number;
  headerArray = [];
  agentDetailedNode = [];
  headerArrayDisplay = [];
  showFeild = new Map<String, String>();
  map3={"status":'Status',"execId": "Execution Id","message": "Message","inSightsTimeX" : "Execution Time"};
  constructor(public dialogRef: MatDialogRef<ShowDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private restCallHandlerService: RestCallHandlerService,
    private healthCheckService: HealthCheckService, ) {
  }

  ngOnInit() {
    this.loadDetailsDialogInfo();
    this.detailType=this.data.detailType;
  }
  

  loadDetailsDialogInfo(): void {
    this.showThrobber = true;
    this.showContent = !this.showThrobber;
    this.checkResponseData = true;
    this.healthCheckService.loadHealthConfigurations(this.data.toolName, this.data.categoryName)
      .then((data) => {
        this.showThrobber = false;
        this.showContent = !this.showThrobber;
        var dataArray = data.data.nodes;
        this.pathName=this.data.pathName;
        if (dataArray.length === 0) {
          this.checkResponseData = false;
        }
        this.columnLength=Object.keys(this.map3).length; 
        for (var key in dataArray) {
          var dataNodes = dataArray[key];
          for (var node in dataNodes) {
            if (node == "propertyMap") {
              var obj = dataNodes[node];
              if (typeof obj["message"] !== "undefined"){
                obj["message"]=obj["message"].slice(0,100);
              }
              this.agentDetailedNode.push(obj);
              for (var attr in obj) {
                if (this.headerArray.indexOf(attr) < 0) {
                  this.headerArray.push(attr);
                  this.showSelectedField();
                }
              }
            }
          }
        }
      });

  }

  showSelectedField(): void {
    for (var val in this.headerArray) {
      if (this.headerArray[val] in this.map3  == true) {
        if (!this.showFeild.has(this.headerArray[val])) {
          this.showFeild.set(this.headerArray[val], this.map3[this.headerArray[val]]);
          this.headerArrayDisplay.push(this.headerArray[val]);
      }
      }
    }  
  }
  
  closeShowDetailsDialog(): void {
    this.dialogRef.close();
  }


}
