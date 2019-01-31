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
import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator,MatDialog } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BlockChainService } from '@insights/app/modules/blockchain/blockchain.service';
import { DatePipe } from '@angular/common'
import { BehaviorSubject } from 'rxjs';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MessageDialogService } from '@insights/app/modules/application-dialog/message-dialog-service';
import { MatRadioChange, MatInput } from '@angular/material';
import { AssetDetailsDialog } from '@insights/app/modules/blockchain/bc-asset-details-dialog';

export interface AssetData {
  assetID: string;
  phase: string;
  toolStatus: string;
  toolName: string;
  basePrimeID: string;
}



@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css', './../home.module.css']
})
export class BlockChainComponent implements OnInit {
  today = new Date();
  yesterday = new Date();
  maxDateValue: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[];
  dataSource = new MatTableDataSource<AssetData>([]);
  MAX_ROWS_PER_TABLE = 5;
  startDate: string;
  endDate: string;
  showSearchResult = false;
  selectedOption: string = "searchByDates";
  startDateFormatted: string;
  endDateFormatted: string;
  assetID: string = "";
  startDateInput: Date;
  endDateInput: Date;
  searchCriteria: string = "";
  searchResultNotFoundMsg: string = "";
  noSearchResultFlag: boolean = false;
  @ViewChild('startDateMatInput', { read: MatInput }) startDateMatInput: MatInput;
  @ViewChild('endDateMatInput', { read: MatInput }) endDateMatInput: MatInput;
  @ViewChild('assetIdInput', { read: MatInput }) assetIdInput: MatInput;
  selectedBasePrimeID:string = "";
  selectedAssetID:string = "";




  constructor(private blockChainService: BlockChainService, private datepipe: DatePipe, 
              private messageDialog: MessageDialogService,private dialog: MatDialog) {
    this.yesterday.setDate(this.today.getDate() - 1);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  //Method gets invoked when search button is clicked
  searchAllAssets() {
    this.searchCriteria = "";
    /*if (this.selectedOption === undefined) {      
      this.messageDialog.showApplicationsMessage("Please select a search criteria.","ERROR");
      return;
    }*/
    if (this.selectedOption == "searchByDates") {
      if (this.startDateInput === undefined || this.endDateInput === undefined) {
        this.messageDialog.showApplicationsMessage("Please select both start date and end date first.", "ERROR");
        return;
      }
      let dateCompareResult: number = this.compareDate(this.startDateInput, this.endDateInput);
      if (dateCompareResult == 1) {
        this.messageDialog.showApplicationsMessage("Start date cannot be greater than end date.", "ERROR");
        return;
      }
      this.blockChainService.getAllAssets(this.startDate, this.endDate)
        .then((data) => {
          console.log(" date range server response >>");
          console.log(data.status);
          console.log(data.message);
          if (data.status === "failure") {
            console.log("inside failure loop");
            this.noSearchResultFlag = true;
            this.showSearchResult = false;
            this.searchCriteria = this.startDateFormatted + " to " + this.endDateFormatted;
            this.searchResultNotFoundMsg = data.message;
            console.log("result not found msg>>" + this.searchResultNotFoundMsg);
          } else {
            console.log(" success server response >>");
            console.log(data);
            this.dataSource.data = data.data;
            this.displayedColumns = ['select', 'assetID', 'toolName', 'phase', 'toolStatus'];
            this.showSearchResult = true;
            this.noSearchResultFlag = false;
            this.searchCriteria = this.startDateFormatted + " to " + this.endDateFormatted;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
          }

        });
    } else if (this.selectedOption == "searchByAssetId") {
      if (this.assetID === undefined || this.assetID === "") {
        this.messageDialog.showApplicationsMessage("Please provide Input Asset ID.", "ERROR");
        return;
      } else {
        this.blockChainService.getAssetInfo(encodeURIComponent(this.assetID))
          .then((data) => {
            console.log(" assetId server response >>");
            console.log(data);
            if (data.status === "failure") {
              this.noSearchResultFlag = true;
              this.showSearchResult = false;
              this.searchCriteria = this.assetID;
              this.searchResultNotFoundMsg = data.message;
              console.log("result not found msg>>" + this.searchResultNotFoundMsg);
            } else {
              console.log("server response >>");
              console.log(data);
              this.dataSource.data = data.data;
              this.displayedColumns = ['select', 'assetID', 'toolName', 'phase', 'toolStatus'];
              this.showSearchResult = true;
              this.noSearchResultFlag = false;
              this.searchCriteria = this.assetID;
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            }
          });
      }
    }

  }

  //When radio button selection changes to select search criteria
  searchCriteriaChange($event: MatRadioChange) {    
    if ($event.value == "searchByDates") {
      this.assetIdInput.value = '';
      this.assetID = "";
    } else if ($event.value == "searchByAssetId") {
      this.startDateMatInput.value = '';
      this.endDateMatInput.value = '';
      this.startDateInput = undefined;
      this.endDateInput = undefined;
    }
  }
  //Checks whether start date is greater than end date and if yes throws error message
  validateDateRange() {
    let dateCompareResult: number = this.compareDate(this.startDateInput, this.endDateInput);
    if (dateCompareResult == 1) {
      this.messageDialog.showApplicationsMessage("Start date cannot be greater than end date.", "ERROR");
      return;
    }
  }

  //Sets value in assetID property from user's input
  getAssetID(assetIdInput: string) {
    if (assetIdInput) {
      this.assetID = assetIdInput;
    } else {
      this.assetID = "";
    }
  }

  getStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.startDateInput = event.value;
    this.startDate = this.datepipe.transform(this.startDateInput, 'yyyy-MM-dd');
    this.startDateFormatted = this.datepipe.transform(this.startDateInput, 'MM/dd/yyyy');
    this.validateDateRange();    
  }

  getEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDateInput = event.value;
    this.endDate = this.datepipe.transform(this.endDateInput, 'yyyy-MM-dd');
    this.endDateFormatted = this.datepipe.transform(this.endDateInput, 'MM/dd/yyyy');
    this.validateDateRange();    
  }

  /* 
  * Compares two Date objects and returns e number value that represents 
  * the result:
  * 0 if the two dates are equal.
  * 1 if the first date is greater than second.
  * -1 if the first date is less than second.
  * @param date1 First date object to compare.
  * @param date2 Second date object to compare.
  */
  compareDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    let d1 = new Date(date1); let d2 = new Date(date2);

    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;

    // Check if the first is less than second
    if (d1 < d2) return -1;
  }

  //Displays Asset Details Dialog box
  showAssetDetailsDialog() {    
    let showDetailsDialog = this.dialog.open(AssetDetailsDialog, {
      panelClass: 'AssetDetailsDialog',
      height: '500px',
      width: '900px',
      data: { basePrimeID:this.selectedBasePrimeID, assetID: this.selectedAssetID},
    });
  }

  populateBasePrimeID($event:MatRadioChange, assetID:string) {      
    this.selectedBasePrimeID = $event.value;   
    this.selectedAssetID = assetID;
  }

}
