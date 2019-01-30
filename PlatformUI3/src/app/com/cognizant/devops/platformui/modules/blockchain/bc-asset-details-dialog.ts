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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator, MatTableDataSource } from '@angular/material';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { BlockChainService } from '@insights/app/modules/blockchain/blockchain.service';

export interface AssetData {
  assetID: string;
  phase: string;
  toolStatus: string;
  toolName: string;
  basePrimeID: string;
}

@Component({
    selector: 'bc-asset-details-dialog',
    templateUrl: './bc-asset-details-dialog.html',
    styleUrls: ['./bc-asset-details-dialog.css', './../home.module.css']
})
export class AssetDetailsDialog implements OnInit {
    displayedColumns: string[] = ['select', 'phase', 'toolstatus', 'toolName', 'author','timestamp'];;
    dataSource = new MatTableDataSource<AssetData>([]);
    MAX_ROWS_PER_TABLE = 5;
    assetID:string="";

    constructor(public dialogRef: MatDialogRef<AssetDetailsDialog>,
        @Inject(MAT_DIALOG_DATA) public parentData: any,
        private blockChainService: BlockChainService) {
        
    }

    ngOnInit() {
       this.loadAssetDetailsInfo();
    }

    ngAfterViewInit() {

    }

    loadAssetDetailsInfo() {
        alert("BasePrimeID: >>" + this.parentData.basePrimeID);
    }

    closeAssetDetailsDialog() {
        this.dialogRef.close();
    }


}    