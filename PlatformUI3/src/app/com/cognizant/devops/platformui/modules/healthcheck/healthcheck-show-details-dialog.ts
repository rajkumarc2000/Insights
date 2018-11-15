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
  