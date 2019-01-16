import { Component, OnInit } from '@angular/core';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { DataDictionaryService } from '@insights/app/modules/datadictionary/datadictionary.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-datadictionary',
  templateUrl: './datadictionary.component.html',
  styleUrls: ['./datadictionary.component.css','./../home.module.css']
})
export class DatadictionaryComponent implements OnInit {
  dictResponse:any;
  agentDataSource = [];
  agentNodes=[];
  displayedAgentColumns: string[];
  selectedAgent1: any;
  agent1TableData:any;
  agent2TableData:any;
  readChange: boolean = false;
  readChange2: boolean = false;
  showDetail: boolean = false;
  showDetail2: boolean = false;
  agent1Tool:any;
  agent1Category:any;
  agent2Tool:any;
  agent2Category:any;

  
  constructor(private dataDictionaryService: DataDictionaryService) { 
    this.dataDictionaryInfo();
  }

  ngOnInit() {
  }
  
  async dataDictionaryInfo() {
    try {
      // Loads Agent , Data Component and Services
      this.dictResponse = await this.dataDictionaryService.loadToolsAndCategories();
      if (this.dictResponse != null) {
        for (var key in this.dictResponse.data) {
          this.agentDataSource.push(this.dictResponse.data[key]);
        }
        
      }
    } catch (error) {
      console.log(error);
    }
  }
  async loadAgent1Info(selectedAgent1) {
    //console.log(selectedAgent1)
    //console.log(usersResponseData.length)
    let usersResponseData1 = await this.dataDictionaryService.loadToolProperties(selectedAgent1.toolName,selectedAgent1.categoryName);
    //console.log(usersResponseData)
    if (usersResponseData1.data != undefined && usersResponseData1.status == "success") {
      this.showDetail = true;
      this.agent1Tool=selectedAgent1.toolName;
      this.agent1Category=selectedAgent1.categoryName;
      this.agent1TableData = usersResponseData1.data;
      //console.log(this.agent1Category);

    } 
  }
  async loadAgent1Info2(selectedAgent2) {
    //console.log(selectedAgent2)
    let usersResponseData2 = await this.dataDictionaryService.loadToolProperties(selectedAgent2.toolName,selectedAgent2.categoryName);
    if (usersResponseData2.data != undefined && usersResponseData2.status == "success") {
      //console.log(usersResponseData.data);
      this.showDetail2 = true;
      this.agent2Tool=selectedAgent2.toolName;
      this.agent2Category=selectedAgent2.categoryName;
      this.agent2TableData = usersResponseData2.data;
    } 
  }

  async getCorrelation(data1,data2){
    //console.log(data1,data2);
    let usersResponseData3 = await this.dataDictionaryService.loadToolsRelationshipAndProperties(data1.toolName,data1.categoryName,data2.toolName,data2.categoryName);
    console.log(usersResponseData3)
    if (usersResponseData3.data != undefined && usersResponseData3.status == "success") {
      
    }
  }

}
