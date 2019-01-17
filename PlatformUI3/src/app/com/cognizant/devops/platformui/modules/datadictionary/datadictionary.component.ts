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
  selectedAgent2: any;
  agent1TableData:any;
  agent2TableData:any;
  readChange: boolean = false;
  readChange2: boolean = false;
  showDetail: boolean = false;
  noShowDetail: boolean=false;
  noShowDetail2: boolean=false;
  showDetail2: boolean = false;
  showDetail3: boolean = false;
  noShowDetailCorr:boolean = false;
  agent1Tool:any;
  agent1Category:any;
  agent2Tool:any;
  agent2Category:any;
  corrprop:any;
  corrData:any;

  
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
    this.agent1Tool=selectedAgent1.toolName;
    this.agent1Category=selectedAgent1.categoryName;
    if (usersResponseData1.data != undefined && usersResponseData1.status == "success") {
      this.showDetail = true;
      this.noShowDetail = false;
      this.agent1TableData = usersResponseData1.data;
      //console.log(this.agent1Category);

    } else {
      this.noShowDetail = true;
      this.showDetail = false;
    }
  }
  async loadAgent1Info2(selectedAgent2) {
    //console.log(selectedAgent2)
    let usersResponseData2 = await this.dataDictionaryService.loadToolProperties(selectedAgent2.toolName,selectedAgent2.categoryName);
    this.agent2Tool=selectedAgent2.toolName;
    this.agent2Category=selectedAgent2.categoryName;
    if (usersResponseData2.data != undefined && usersResponseData2.status == "success") {
      //console.log(usersResponseData.data);
      this.showDetail2 = true;
      this.noShowDetail2=false;
      this.agent2TableData = usersResponseData2.data;
    } else{
      this.noShowDetail2=true;
      this.showDetail2=false;
    }
  }

  async getCorrelation(data1,data2){
    //console.log(data1,data2);
    let usersResponseData3 = await this.dataDictionaryService.loadToolsRelationshipAndProperties(data1.toolName,data1.categoryName,data2.toolName,data2.categoryName);
    if (usersResponseData3.data != undefined && usersResponseData3.status == "success") {
      console.log(usersResponseData3)
      if (usersResponseData3.data["relationName"] != undefined){
        this.showDetail3 = true;
        this.noShowDetailCorr=false;
        this.corrprop=usersResponseData3.data["relationName"];
        if (usersResponseData3.data["properties"] != undefined){
          this.corrData=usersResponseData3.data["properties"];
          console.log(this.corrData)
        }
      
      } 
    }else{
      this.noShowDetailCorr=true;
      this.showDetail3=false;
    }

  }
}
