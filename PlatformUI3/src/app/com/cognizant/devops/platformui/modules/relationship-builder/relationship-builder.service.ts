import { Injectable } from '@angular/core';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface IRelationshipBuilderService {
    loadToolsAndCategories(): Promise<any>;
    loadToolProperties(toolName: string, categoryName: string): Promise<any>;
    loadToolsRelationshipAndProperties(startToolName: string, startToolCategory: string, endToolName: string, endToolCatergory: string): Promise<any>;
}




@Injectable()
export class RelationshipBuilderService implements IRelationshipBuilderService {

    constructor(private restCallHandlerService: RestCallHandlerService, private http: HttpClient) {
    }
    public async initMethods() {
        const result1 = await this.loadUiServiceLocation();


    }


    async loadUiServiceLocation() {
        var self = this;
        var uiConfigJsonUrl = "config/correlation.json"
        let UIConfigResponse = await this.getJSONUsingObservable(uiConfigJsonUrl).toPromise();
        console.log(UIConfigResponse);
        return UIConfigResponse;
    }

    loadToolsAndCategories(): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("DATA_DICTIONARY_TOOLS_AND_CATEGORY");
    }

    loadToolProperties(toolName: string, categoryName: string): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("DATA_DICTIONARY_TOOL_PROPERTIES", { 'toolName': toolName, 'categoryName': categoryName });
    }

    public getJSONUsingObservable(url): Observable<any> {
        return this.http.get(url)
    }









    loadToolsRelationshipAndProperties(startToolName: string, startToolCategory: string, endToolName: string, endToolCatergory: string): Promise<any> {
        var restHandler = this.restCallHandlerService;
        return restHandler.get("DATA_DICTIONARY_TOOLS_RELATIONSHIPS", { 'startToolName': startToolName, 'startToolCategory': startToolCategory, 'endToolName': endToolName, 'endToolCatergory': endToolCatergory });
    }



}
