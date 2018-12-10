/*******************************************************************************
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
 ******************************************************************************/
import { Component, OnInit, Injectable } from '@angular/core';
import { BusinessMappingService } from './businessmapping.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

/**
 * TreeNode data structure. Each node has a name and list of children
 */
export class TreeNode {
  children?: TreeNode[];
  name: string;
}


/**
 * BusinessMapping database, it can build a tree structured TreeNode array from JsonObject array. 
 * Each node has a name and an optional children (a list of TreeNodes).
 * The input will be a json object array, and the output is a list of `TreeNode` with nested
 * structure.
 */
@Injectable()
export class BusinessHierarchyDatabase {
  dataChange = new BehaviorSubject<TreeNode[]>([]);

  hierarchyList = [];

  get data(): TreeNode[] { return this.dataChange.value; }

  constructor(private businessMappingService: BusinessMappingService) {
    this.loadAllBusinessHierarchies();
  }

  async loadAllBusinessHierarchies() {
    this.businessMappingService.getAllHierarchyMappings()
      .then((result) => {
        console.log("result of hierarchy mappings:" + result);
        if (result != null) {
          this.hierarchyList = result.data[0].children;
          console.log("all hierarchy mappings" + this.hierarchyList);
          let data = this.buildTreeNode(this.hierarchyList, 0);
          // Notify the change.
          this.dataChange.next(data);
        }
      })
  }


  /**
   * Converts server side response JsonObject into list of TreeNode objects
   * Build the business mapping structure tree. The `value` is TreeNode object, or a sub-tree of a TreeNode object.
   * The return value is the list of `TreeNode`.
   */
  buildTreeNode(obj: { [key: string]: any }, level: number): TreeNode[] {
    return Object.keys(obj).reduce<TreeNode[]>((accumulator, key) => {
      let value = obj[key];
      let node = new TreeNode();
      node.name = value.name;

      if (value != null) {
        if (typeof value === 'object' && value.children != undefined) {
          node.children = this.buildTreeNode(value.children, level + 1);
        }
      }

      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-businessmapping',
  templateUrl: './businessmapping.component.html',
  styleUrls: ['./businessmapping.component.css']
})
export class BusinessMappingComponent implements OnInit {

  nestedTreeControl: NestedTreeControl<TreeNode>;
  nestedDataSource: MatTreeNestedDataSource<TreeNode>;
  hierarchyProperties:any;

  hasNestedChild = (_: number, nodeData: TreeNode) => nodeData.children;

  private _getChildren = (node: TreeNode) => node.children;

  constructor(private businessMappingService: BusinessMappingService, private database: BusinessHierarchyDatabase) {
    this.nestedTreeControl = new NestedTreeControl<TreeNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
    database.dataChange.subscribe(data => this.nestedDataSource.data = data);
  }

  ngOnInit() {
  }


  showChildToolsProperties(selectedNode: string) {
   // console.log("Leaf Node>> " + selectedNode);
    var selectedElement = document.getElementById(selectedNode);
    //console.log("Selected UI element>>" + selectedElement);
    selectedElement.style.backgroundColor = "#eee";
    var levels = [];
    levels.unshift(selectedElement.id);
    while (selectedElement.parentElement) {
      //console.log("Tag Name:# " + selectedElement.parentElement.tagName);
      if (selectedElement.parentElement.tagName == "LI") {
        //console.log("Value:>> " + selectedElement.parentElement.id);
        levels.unshift(selectedElement.parentElement.id);
      }
      selectedElement = selectedElement.parentElement;
    }
   // console.log("Levels:>> " + levels);
    var level1 = levels[0] || '';
    var level2 = levels[1] || '';
    var level3 = levels[2] || '';
    var level4 = levels[3] || '';
    this.businessMappingService.getHierarchyProperties(level1,level2,level3,level4)
        .then((data)=> {
          //console.log(data);
          this.hierarchyProperties = data.data;
        });
  }

}
