import { Component, OnInit } from '@angular/core';
import { RelationshipBuilderService } from '@insights/app/modules/relationship-builder/relationship-builder.service';
import { ShowJsonDialog } from '@insights/app/modules/relationship-builder/show-correlationjson';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-relationship-builder',
  templateUrl: './relationship-builder.component.html',
  styleUrls: ['./relationship-builder.component.css', './../home.module.css']
})
export class RelationshipBuilderComponent implements OnInit {
  selectedDummyAgent: any = undefined;
  updatedDatasource = [];
  isbuttonenabled: boolean = false;
  dictResponse: any;
  corelationResponse: any;
  corelationResponseMaster: any;
  dataComponentColumns: string[];
  agentDataSource = [];
  corrprop = [];
  servicesDataSource = [];
  agentNodes = [];
  displayedAgentColumns: string[];
  selectedAgent1: any;
  isListView = false;
  isEditData = false;
  selectedAgent2: any;
  agent1TableData: any;
  agent2TableData: any;
  readChange: boolean = false;
  readChange2: boolean = false;
  showDetail: boolean = false;
  noShowDetail: boolean = false;
  noShowDetail2: boolean = false;
  showDetail2: boolean = false;
  showDetail3: boolean = false;
  noShowDetailCorr: boolean = false;
  relationPropertiesSize: boolean = false;
  showNoToolsSelectedForCorrelation: boolean = false;
  buttonOn: boolean = false;
  clicked: boolean = false;
  startToolNullPropertiesMessage = ""
  endToolNullPropertiesMessage = ""
  agent1Tool: any;
  agent1Category: any;
  agent2Tool: any;
  agent2Category: any;
  public data: any;
  corrData: any;
  selectedMappingAgent: any;
  selectedMappingAgent2: any;


  relData: any;
  relationDataSource = [];

  constructor(private relationshipBuilderService: RelationshipBuilderService, private dialog: MatDialog) {
    this.dataDictionaryInfo();
    this.getCorrelation();
  }

  ngOnInit() {
  }

  async dataDictionaryInfo() {
    try {
      // Loads Agent , Data Component and Services
      this.dictResponse = await this.relationshipBuilderService.loadToolsAndCategories();
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
    try {
      this.noShowDetail = true;
      this.clicked = false;
      this.buttonOn = false;
      let usersResponseData1 = await this.relationshipBuilderService.loadToolProperties(selectedAgent1.toolName, selectedAgent1.categoryName);
      //console.log(usersResponseData)
      this.agent1Tool = selectedAgent1.toolName;
      this.agent1Category = selectedAgent1.categoryName;
      if (usersResponseData1.data != undefined && usersResponseData1.status == "success") {
        this.showDetail = true;
        this.noShowDetail = false;
        this.agent1TableData = usersResponseData1.data;
        //console.log(this.agent1Category);

      } else {
        this.noShowDetail = true;
        this.showDetail = false;
        this.startToolNullPropertiesMessage = "No properties found"
        //console.log(this.startToolNullPropertiesMessage)
      }
    } catch (error) {
      console.log(error);
    }
  }
  async loadAgent1Info2(selectedAgent2) {
    try {
      this.noShowDetail2 = true;
      this.noShowDetailCorr = false;
      this.showDetail3 = false;
      this.buttonOn = false;
      this.clicked = false;
      //console.log(selectedAgent2)
      let usersResponseData2 = await this.relationshipBuilderService.loadToolProperties(selectedAgent2.toolName, selectedAgent2.categoryName);
      this.agent2Tool = selectedAgent2.toolName;
      this.agent2Category = selectedAgent2.categoryName;
      if (usersResponseData2.data != undefined && usersResponseData2.status == "success") {
        //console.log(usersResponseData.data);
        this.showDetail2 = true;
        this.noShowDetail2 = false;
        this.agent2TableData = usersResponseData2.data;
      } else {
        this.noShowDetail2 = true;
        this.showDetail2 = false;
        this.endToolNullPropertiesMessage = "No properties found"
        //console.log(this.endToolNullPropertiesMessage)
      }
    } catch (error) {
      console.log(error);
    }
  }

  getCorrelation() {
    try {
      this.relationDataSource = [];
      this.servicesDataSource = [];
      var self = this;
      this.relationshipBuilderService.loadUiServiceLocation().then(
        (corelationResponse) => {
          self.corelationResponseMaster = corelationResponse;
          this.corrprop = corelationResponse.data;
          console.log(corelationResponse);
          console.log(self.corelationResponseMaster);
          if (this.corrprop != null) {
            for (var key in this.corrprop) {
              var element = this.corrprop[key];
              var a = (element.relationName);
              var b = (element.destination.toolName);
              var c = (element.source.toolName);
              this.relationDataSource.push(a)
              this.servicesDataSource.push(element);
            }
          }
          //this.relData = this.relationDataSource;
          //console.log(this.relData);
          this.dataComponentColumns = ['relationName'];
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  showDetailsDialog() {

    let showJsonDialog = this.dialog.open(ShowJsonDialog, {
      panelClass: 'showjson-dialog-container',
      height: '500px',
      width: '700px',
      disableClose: true,
      data: this.corelationResponseMaster,

    });
    //console.log(showJsonDialog);
  }

  statusEdit() {
    this.isListView = true;
    this.isEditData = true;

    console.log(this.selectedDummyAgent)
    for (var key in this.servicesDataSource) {
      if (this.servicesDataSource[key].relationName != this.selectedDummyAgent) {
        this.updatedDatasource.push(this.servicesDataSource[key])
      }
    }
    console.log(this.selectedDummyAgent);
    console.log(this.updatedDatasource);

    var deleteMappingJson = JSON.stringify( this.updatedDatasource );
    console.log(deleteMappingJson);

    this.relationshipBuilderService.saveCorrelationConfig(deleteMappingJson).then(
      (corelationResponse2) => {
        console.log(corelationResponse2)
        if (corelationResponse2.status == "success") {
          this.updatedDatasource = [];
          this.relationDataSource = [];
          this.servicesDataSource = [];
          this.getCorrelation();
        }
      });
  }
  statusEdit2() {
    this.isbuttonenabled = true;
    console.log(this.isbuttonenabled);
  }

  saveData() {

  }
  deleteMapping() {

  }
}
