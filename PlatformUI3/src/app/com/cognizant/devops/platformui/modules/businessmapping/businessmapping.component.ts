import { Component, OnInit } from '@angular/core';
import { BusinessMappingService } from './businessmapping.service';

@Component({
  selector: 'app-businessmapping',
  templateUrl: './businessmapping.component.html',
  styleUrls: ['./businessmapping.component.css']
})
export class BusinessMappingComponent implements OnInit {

  allBusinessHierarchies:any;

  constructor(private businessMappingService:BusinessMappingService) { 
    this.loadAllBusinessHierarchies();
  }

  ngOnInit() {    
  }

  async loadAllBusinessHierarchies() {
      this.allBusinessHierarchies = this.businessMappingService.getAllHierarchyMappings();
      console.log("all hierarchy mappings" + this.allBusinessHierarchies);
      //if (this.healthResponse != null) {


  }

}
