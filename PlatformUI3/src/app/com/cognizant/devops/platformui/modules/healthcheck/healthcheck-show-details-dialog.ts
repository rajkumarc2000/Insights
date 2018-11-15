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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { HealthCheckService } from './healthcheck.service';


@Component({
    selector: 'healthcheck-show-details-dialog',
    templateUrl: './healthcheck-show-details-dialog.html',
  })
  export class ShowDetailsDialog implements OnInit  {
    showContent: boolean;  
    showThrobber: boolean;	
    checkResponseData: boolean;
    headerArray = [];
    agentDetailedNode = [];    
    showFieldVal = [];
    headerArrayDisplay = [];
    
    constructor(public dialogRef: MatDialogRef<ShowDetailsDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private restCallHandlerService: RestCallHandlerService,                
                private healthCheckService:HealthCheckService,) {
       //this.loadDetailsDialogInfo();          
     }
    
    ngOnInit() {
        this.loadDetailsDialogInfo();
    }                
    
    loadDetailsDialogInfo(): void {
      this.showThrobber = true;
      this.showContent = !this.showThrobber;
      this.checkResponseData = true;
      this.healthCheckService.loadHealthConfigurations(this.data.toolName, this.data.categoryName)
        .then((data)=> {
          this.showThrobber = false;
          this.showContent = !this.showThrobber;
          var dataArray = data.data.nodes;
          if (dataArray.length === 0) {
            this.checkResponseData = false;
          }
          this.showFieldVal = ['type', 'uuid', 'status', 'execId', 'inSightsTimeX'];
          for (var key in dataArray) {
            var dataNodes = dataArray[key];
            for (var node in dataNodes) {
              if (node == "propertyMap") {
                var obj = dataNodes[node];
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
        for (var key in this.showFieldVal) {
          for (var val in this.headerArray) {
            if (this.showFieldVal[key] === this.headerArray[val]) {
              if (this.headerArrayDisplay.indexOf(this.showFieldVal[key]) < 0) {
                this.headerArrayDisplay.push(this.showFieldVal[key]);
              }
            }
          }
        }
    }
      


    closeShowDetailsDialog(): void {
      this.dialogRef.close();
    }

   
  }
  