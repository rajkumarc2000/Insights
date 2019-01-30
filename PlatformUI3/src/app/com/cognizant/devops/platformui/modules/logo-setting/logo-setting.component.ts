import { Component, OnInit,ViewChild, ElementRef  } from '@angular/core';
import { LogoSettingService } from '@insights/app/modules/logo-setting/logo-setting.service';
import { HttpClientModule, HttpHeaders,HttpClient } from '@angular/common/http';
import { RestAPIurlService } from '@insights/common/rest-apiurl.service'
import { CookieService } from 'ngx-cookie-service';



@Component({
  selector: 'app-logo-setting',
  templateUrl: './logo-setting.component.html',
  styleUrls: ['./logo-setting.component.css','./../home.module.css']
})
export class LogoSettingComponent implements OnInit {
  trackingUploadedFileContentStr: string = "";
  @ViewChild('fileInput') myFileDiv: ElementRef;
  files:any;
  response:any;
  
  constructor(private logoSettingService: LogoSettingService,private http: HttpClient,private restAPIUrlService:RestAPIurlService,
    private cookieService: CookieService) { }

  ngOnInit() {
  }

  uploadFile() {
    var restcallAPIUrl = this.restAPIUrlService.getRestCallUrl("UPLOAD_IMAGE");
    var file = this.myFileDiv.nativeElement.files[0];
    var fd = new FormData();
    fd.append("file", file);
    var authToken = this.cookieService.get('Authorization');
    this.http.post(restcallAPIUrl, fd, {
        headers: {
            'Authorization': authToken
        },
    }).subscribe(event => {
      //console.log(event); // handle event here
    });
    /* 
     
    this.trackingUploadedFileContentStr = "";
    var uploadedFile = this.myFileDiv.nativeElement.files[0];
    console.log(uploadedFile);
    var restCallUrl = this.restAPIUrlService.getRestCallUrl("UPLOAD_IMAGE");
     
    this.http.post(restCallUrl, uploadedFile)
    .subscribe(event => {
      console.log(event); // handle event here
    });
    */
  }
  cancelFileUpload(){

  }


}
