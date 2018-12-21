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
import { Component, OnInit,ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-blockchain',
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css','./../../home.module.css']
})
export class BlockChainComponent implements OnInit {

  today = new Date();
  yesterday = new Date();
  maxDateValue:any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);
  MAX_ROWS_PER_TABLE = 5;
  startDate : Date = new Date();
  endDate: Date = new Date();
  constructor() {
    this.yesterday.setDate(this.today.getDate()-1);
    console.log("Yesterday's date:>>>" + this.yesterday);
    

  }  

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    console.log("Sorting set");
    this.dataSource.paginator = this.paginator;
  }

  searchAllAssets() {
     let result: number = this.compareDate(this.startDate, this.endDate); 
     alert("Result >>" + result);
    
  }

  getStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
      this.startDate = event.value;
      //alert("Start Date: >>" + this.startDate)
  }

  getEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
      this.endDate = event.value;
      //alert("End Date: >>" + this.endDate)
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

  /** Whether the number of selected elements matches the total number of rows. */
  /* isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }*/

  /** Selects all rows if they are not all selected; otherwise clear selection. */
 /* masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  } */

}
