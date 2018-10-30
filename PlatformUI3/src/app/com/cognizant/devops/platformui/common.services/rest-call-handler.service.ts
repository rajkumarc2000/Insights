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
import { Observable } from 'rxjs'
import { RestAPIurlService } from '@insights/common/rest-apiurl.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Injectable()
export class RestCallHandlerService {
  asyncResult:any;
  constructor(private http: HttpClient, private restAPIUrlService: RestAPIurlService, 
  private cookieService: CookieService) {

  }

  public async get(url: string, requestParams?: Object, additionalheaders?: Object): Promise<any> {
    
    var dataresponse;
    var authToken = this.cookieService.get('Authorization');
    /* var headers;
    var defaultHeader = {
      'Authorization': authToken
    };

    if (this.checkValidObject(additionalheaders)) {
      headers = this.extend(defaultHeader, additionalheaders);
    } else {
      headers = defaultHeader;
    }
    var allData = {
      method: 'GET',
      headers: headers
    }*/
    const headers = new HttpHeaders()
            .set("Authorization", authToken);
    //console.log(headers);
    var restCallUrl = this.constructGetUrl(url, requestParams);
    this.asyncResult = await this.http.get(restCallUrl,{headers}).toPromise(); 
    //console.log(this.asyncResult.toString)
    return this.asyncResult;
  }


  public post(url: string, requestParams?: Object, additionalheaders?: Object): Observable<any> {

    var restCallUrl = this.restAPIUrlService.getRestCallUrl(url);
    //console.log(restCallUrl);
    var dataresponse;
    var headers;
    var authToken = this.cookieService.get('Authorization');
    var defaultHeader = {
      'Authorization': authToken
    };
    if (this.checkValidObject(additionalheaders)) {
      headers = this.extend(defaultHeader, additionalheaders);
    } else {
      headers = defaultHeader;
    }
    headers = defaultHeader;
    var allData = {
      method: 'POST',
      headers: headers,
      transformRequest: function (data) {
        if (data && Object.keys(data).length !== 0 && data.constructor == Object) {
          var postParameter = '';
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              postParameter = postParameter.concat(key + '=' + requestParams[key] + '&');
            }
          }
          postParameter = postParameter.slice(0, -1);
          return postParameter;
        }
        return;
      }
    }
    dataresponse=this.http.post(restCallUrl, {}, allData);
    /*subscribe((response: HttpResponse<any>) => { 
      
     });*/
    
    /*.subscribe(dataobjresponse => {
      console.log(dataobjresponse.toString)
      dataresponse=dataobjresponse;
    });*/

    return dataresponse;

  }

 private extend(obj: Object, src: Object) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
  }

 private checkValidObject(obj: Object) {
    if (obj != null && obj.constructor == Object && Object.keys(obj).length !== 0) {
      return true;
    }
    return false;
  }

 private constructGetUrl(url: string, requestParams: Object) {
    var selectedUrl = this.restAPIUrlService.getRestCallUrl(url); //url
    if (this.checkValidObject(requestParams)) {
      selectedUrl = selectedUrl.concat('?');
      for (var key in requestParams) {
        if (requestParams.hasOwnProperty(key)) {
          selectedUrl = selectedUrl.concat(key + '=' + requestParams[key] + '&');
        }
      }
      selectedUrl = selectedUrl.slice(0, -1);
    } 
    return selectedUrl;
  }

  public getJSON(url): Promise<any> {
    return this.http.get(url).toPromise()
  }

  public getJSONUsingObservable(url): Observable<any> {
		return this.http.get(url)
	}
}
