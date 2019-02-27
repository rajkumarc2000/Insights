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
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { BlockChainService } from '@insights/app/modules/blockchain/blockchain.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AssetData } from '@insights/app/modules/blockchain/blockchain.component';
import {saveAs as importedSaveAs} from "file-saver"; 

export interface AssetHistoryData {
    assetID: string;
    phase: string;
    toolstatus: string;
    toolName: string;
    basePrimeID: string;
    author: string;
    timestamp: string;
}

@Component({
    selector: 'bc-asset-details-dialog',
    templateUrl: './bc-asset-details-dialog.html',
    styleUrls: ['./bc-asset-details-dialog.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})
export class AssetDetailsDialog implements OnInit {
    displayedColumns: string[] = ['select', 'assetID', 'phase', 'toolstatus', 'toolName', 'author', 'timestamp'];;
    assetHistoryDataSource = new MatTableDataSource<AssetHistoryData>([]);
    MAX_ROWS_PER_TABLE = 10;
    assetID: string = "";
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    expandedElement: AssetHistoryData | null;
    headerArrayDisplay = [];
    masterHeader = new Map<String, String>();
    finalHeaderToShow = new Map<String, String>();
    headerSet = new Set();
    pdfData;
    displayProgressBar:boolean = false;
    pipeline = false;
    list = [];

    constructor(public dialogRef: MatDialogRef<AssetDetailsDialog>,
        @Inject(MAT_DIALOG_DATA) public parentData: any,
        private blockChainService: BlockChainService) {

    }

    ngOnInit() {
        this.assetID = this.parentData.assetID;
        this.fillMasterHeaderData();
        this.getAssetHistoryDetails();
    }

    ngAfterViewInit() {
        this.assetHistoryDataSource.sort = this.sort;
        this.assetHistoryDataSource.paginator = this.paginator;
    }

    fillMasterHeaderData() {
        this.masterHeader.set("select", "");
        this.masterHeader.set("assetID", "Asset ID");
        this.masterHeader.set("phase", "Phase");
        this.masterHeader.set("toolstatus", "Status");
        this.masterHeader.set("toolName", "Tool");
        this.masterHeader.set("author", "Owner");
        this.masterHeader.set("timestamp", "Time Stamp");
    }

    getAssetHistoryDetails() {
        this.displayProgressBar = true;
        this.blockChainService.getAssetHistory(this.parentData.basePrimeID)
            .then((data) => {
                console.log("asset history respose>>>");
                console.log(data);
                this.displayProgressBar = false;
                var historyData = data.data;                
                historyData.sort((value1,value2)=> {
                    // Ascending order
                    return(new Date(value1.timestamp).getTime() - new Date(value2.timestamp).getTime());
                });
                // Assign asset history details data sorted by timestamp in ascending order
                this.assetHistoryDataSource.data = historyData;
                this.pdfData = data;
                for (var index in historyData) {
                    var eachObject = historyData[index];
                    for (var key in eachObject) {
                        if (!this.masterHeader.has(key)) {
                            this.headerSet.add(key);
                        }
                    }
                }
                this.headerArrayDisplay = Array.from(this.headerSet);                
                this.assetHistoryDataSource.sort = this.sort;
                this.assetHistoryDataSource.paginator = this.paginator;
            });
    }

    closeAssetDetailsDialog() {
        this.dialogRef.close();
    }

    getLevel2Properties(key:string, data:AssetHistoryData) {
        let value:string = data[key];
        if (value != undefined && value !== null && value!= null && value !="null")  {
            return key + ": " + value.trim();
        } 
        return "";
    }

    exportToPdf() {        
        this.blockChainService.exportToPdf(this.pdfData)
            .subscribe((data) => {
                var pdfFileName = 'Traceability_report.pdf';
                importedSaveAs(data, pdfFileName);
            },
            error => {
                console.log(error);
                });              
    }

    applyAssetDetailsFilter(filterValue: string) {
        this.assetHistoryDataSource.filter = filterValue.trim().toLowerCase();
    }


    workflow(){
        //this.pdfData
        this.pipeline=true;
        let custMap = {};
        let fMap = {};
        let fArray = [];
        this.pdfData.data.map(x => {
            x["moddate"] = new Date(x.timestamp);
            if (custMap[x.toolName]) {
                let list = [...custMap[x.toolName]];
                list.push(x);
                custMap[x.toolName] = this.sortArray(list);

            } else {
                let lst = []
                lst.push(x)
                custMap[x.toolName] = lst
            }
        });
        console.log(custMap);

        Object.keys(custMap).forEach(parent => {
          let obj = {
              point: parent,
              child: []
          }
          custMap[parent].forEach(child =>{
            obj.child.push({point: child})
           })
           console.log(this.list);
           console.log(obj);
           this.list.push(obj);
        })
        console.log('lists', this.list);
    }
    
    sortArray(list) {
        debugger;
        return list.sort((x, y) => {
            return x.moddate - y.moddate;
        })
    }

   


}    