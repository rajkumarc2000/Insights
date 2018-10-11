import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable()
export class AppConfig {

    //static settings: IAppConfig;

    constructor(private http: HttpClient) {
        this.load();
    }

    load() {
        const jsonFile = 'config/uiConfig.json';
        this.http.get(jsonFile)
	    .subscribe((UiConfig_data) => {
		console.log(UiConfig_data);
		});
     }
}