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
   // accordian_icon = "plus_icon";

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
        this.blockChainService.getAssetHistory(this.parentData.basePrimeID)
            .then((data) => {
                console.log("asset history respose>>>");
                console.log(data);
                this.assetHistoryDataSource.data = data.data;
                var historyData = data.data;
                for (var index in historyData) {
                    var eachObject = historyData[index];
                    for (var key in eachObject) {
                        if (!this.masterHeader.has(key)) {
                            this.headerSet.add(key);
                        }

                    }

                }
                ///console.log("header set size: >>"+ this.headerSet.size);
                this.headerArrayDisplay = Array.from(this.headerSet);
                //console.log("header array display size: >>"+ this.headerArrayDisplay.length);
                this.assetHistoryDataSource.sort = this.sort;
                this.assetHistoryDataSource.paginator = this.paginator;
            });
    }

    closeAssetDetailsDialog() {
        this.dialogRef.close();
    }

    /* toggleIcon(row: AssetHistoryData) {
        console.log("selected row: >>");
        console.log(row);
        console.log("this.expandedElement :>>");
        console.log(this.expandedElement);
        if (this.expandedElement === row) {
            this.accordian_icon = 'minus_icon';
        } else {
            this.accordian_icon = 'plus_icon';
        }
    } */


}    