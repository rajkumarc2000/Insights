/*******************************************************************************
 * Copyright 2019 Cognizant Technology Solutions
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

export interface IQueryBuilderService {
    saveOrUpdateQuery(form: any): Promise<any>;
    fetchQueries(): Promise<any>;
}

@Injectable()
export class QueryBuilderService implements IQueryBuilderService {

    constructor(private restCallHandlerService: RestCallHandlerService) {
    }

    saveOrUpdateQuery(form: any): Promise<any> {
        console.log(form);
        return this.restCallHandlerService.postWithParameter("CREATE_UPDATE_CYPHER_QUERY",
            { 'reportName': form.reportname, 'frequency': form.frequency, 'subscribers': form.subscribers },
            { 'Content-Type': 'application/x-www-form-urlencoded' }).toPromise();
    }

    fetchQueries(): Promise<any> {
        return this.restCallHandlerService.get("FETCH_CYPHER_QUERY");
    }

    deleteQuery(reportname): Promise<any> {
        return this.restCallHandlerService.postWithParameter("DELETE_CYPHER_QUERY",
        { 'reportName': reportname},
        { 'Content-Type': 'application/x-www-form-urlencoded' }).toPromise();
    }
    

}