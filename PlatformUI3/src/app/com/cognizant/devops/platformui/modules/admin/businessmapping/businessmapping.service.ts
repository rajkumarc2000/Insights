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
import { Injectable } from '@angular/core';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { Observable } from 'rxjs';


export interface IBusinessMappingService {
    //loadServerHealthConfiguration(): Promise<any>;
    //loadHealthConfigurations(toolName: string, toolCategory: string): Promise<any>;
    getAllHierarchyMappings(): Promise<any>;
    getHierarchyProperties(level1: string, level2: string, level3: string, level4: string): Promise<any>;
}




@Injectable()
export class BusinessMappingService implements IBusinessMappingService {

    constructor(private restCallHandlerService: RestCallHandlerService) {
    }

    getAllHierarchyMappings(): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("GET_ALL_HIERARCHY_DETAILS", { 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    getHierarchyProperties(level1: string, level2: string, level3: string, level4: string): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("GET_HIERARCHY_PROPERTIES", { "level1": level1, "level2": level2, "level3": level3, "level4": level4 }, { 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    loadToolsAndCategories(): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("DATA_DICTIONARY_TOOLS_AND_CATEGORY");
    }

    loadToolProperties(toolName: string, categoryName: string): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("DATA_DICTIONARY_TOOL_PROPERTIES", { 'toolName': toolName, 'categoryName': categoryName });
    }


}

