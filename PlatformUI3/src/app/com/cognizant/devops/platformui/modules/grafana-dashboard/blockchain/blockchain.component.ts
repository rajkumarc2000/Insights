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
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BlockChainService } from '@insights/app/modules/grafana-dashboard/blockchain/blockchain.service';
import { DatePipe } from '@angular/common'
import { BehaviorSubject } from 'rxjs';
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

export interface AssetData {
  assetID: string;
  phase: string;
  toolStatus: string;
  toolName: string;
}

const ELEMENT_DATA: AssetData[] = [
  { "assetID": "CH2", "phase": "Plan", "toolStatus": "Done", "toolName": "JIRA" },
  { "assetID": "TE1", "phase": "Build", "toolStatus": "Success", "toolName": "GIT" },
  { "assetID": "PK1", "phase": "Plan", "toolStatus": "Done", "toolName": "SCM" }
];


@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css', './../../home.module.css']
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
  selectedOption: string;
  startDateFormatted: string;
  endDateFormatted: string;
  assetID: string = "";  
  startDateInput:Date;
  endDateInput:Date;

  constructor(private blockChainService: BlockChainService, private datepipe: DatePipe) {
    this.yesterday.setDate(this.today.getDate() - 1);
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log(" inside after view init Sorting set");
    this.dataSource.paginator = this.paginator;
  }

  //Method gets invoked when search button is clicked
  searchAllAssets() {
    if (this.selectedOption === undefined) {
      alert("Please select a search criteria >>" + this.selectedOption);
      return;
    }
    if (this.selectedOption == "searchByDates") {
      //alert("Search by Date Ranges >>");
      let dateCompareResult: number = this.compareDate(this.startDateInput, this.endDateInput);
      if (dateCompareResult == 1 ) {
        alert ("Start date cannot be greater than end date..");
        return;
      }
      this.blockChainService.getAllAssets(this.startDate, this.endDate)
        .then((data) => {
          console.log("server result >>");
          console.log(data);
          this.dataSource.data = data.data;
          console.log("assets >>");
          //console.log(assets);
          console.log(ELEMENT_DATA);
          //this.dataSource.data = assets;
          //this.dataSource.data = ELEMENT_DATA;
          this.displayedColumns = ['select', 'assetID', 'toolName', 'phase', 'toolStatus'];
          this.showSearchResult = true;
          //console.log("datasource data length: >>"+ this.dataSource.data.length);
          this.dataSource.sort = this.sort;
          console.log("after datasurce set Sorting set");
          this.dataSource.paginator = this.paginator;
        });
    } else if (this.selectedOption == "searchByAssetId") {
      //alert("Search by Input Asset ID selected >>" + this.assetID);
      if (this.assetID !== undefined && this.assetID !== "") {
         this.blockChainService.getAssetInfo(this.assetID)
        .then((data) => {
          console.log("server result >>");
          console.log(data);
          this.dataSource.data = data.data;
          console.log("assets >>");          
          this.displayedColumns = ['select', 'assetID', 'toolName', 'phase', 'toolStatus'];
          this.showSearchResult = true;          
          this.dataSource.sort = this.sort;          
          this.dataSource.paginator = this.paginator;
        }); 
      }
      
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
    this.startDate = this.datepipe.transform(this.startDateInput,'yyyy-MM-dd');
    this.startDateFormatted = this.datepipe.transform(this.startDateInput, 'MM/dd/yyyy');
    //alert("Start Date: >>" + this.startDateFormatted)
  }

  getEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.endDateInput = event.value;
    this.endDate = this.datepipe.transform(this.endDateInput,'yyyy-MM-dd');
    this.endDateFormatted = this.datepipe.transform(this.endDateInput, 'MM/dd/yyyy');
    //alert("End Date: >>" + this.endDateFormatted)
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

}
