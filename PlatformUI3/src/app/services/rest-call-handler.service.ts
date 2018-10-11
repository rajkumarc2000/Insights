import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { RestAPIurlService } from '../services/rest-apiurl.service'
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class RestCallHandlerService {

  constructor(private http: HttpClient, private restAPIUrlService: RestAPIurlService, private cookieService: CookieService) {

  }

  public get(url: string, requestParams?: Object, additionalheaders?: Object): Observable<any> {
    var headers;
    var dataresponse;
    var authToken = this.cookieService.get('Authorization');
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
    }
    var restCallUrl = this.constructGetUrl(url, requestParams);
    this.http.get(restCallUrl).subscribe(dataresponse => {
      console.log(dataresponse.toString)
    });
    return dataresponse;
  }


  public post(url: string, requestParams?: Object, additionalheaders?: Object): Observable<any> {

    var restCallUrl = this.restAPIUrlService.getRestCallUrl(url);
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
    this.http.post(restCallUrl, {}, allData).subscribe(dataresponse => {
      console.log(dataresponse.toString)
    });

    return dataresponse;

  }

  extend(obj: Object, src: Object) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
  }

  checkValidObject(obj: Object) {
    if (typeof (obj) != 'undefined' && obj != null && obj.constructor == Object && Object.keys(obj).length !== 0) {
      return true;
    }
    return false;
  }

  constructGetUrl(url: string, requestParams: Object) {
    var selectedUrl = this.restAPIUrlService.getRestCallUrl(url);
    /*if (this.checkValidObject(requestParams)) {
      selectedUrl = selectedUrl.concat('?');
      for (var key in requestParams) {
        if (requestParams.hasOwnProperty(key)) {
          selectedUrl = selectedUrl.concat(key + '=' + requestParams[key] + '&');
        }
      }
      selectedUrl = selectedUrl.slice(0, -1);
    } */
    return selectedUrl;
  }
}
