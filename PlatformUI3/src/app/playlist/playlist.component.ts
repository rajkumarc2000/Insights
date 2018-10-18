import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../common.services/app.config'
import { RestAPIurlService } from '../common.services/rest-apiurl.service'
import { RestCallHandlerService } from '../common.services/rest-call-handler.service';
import { DomSanitizer, BrowserModule, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  mainContentMinHeightWoSbTab: string = 'min-height:' + (window.innerHeight - 146 - 48) + 'px';
  iframeStyle = 'width:100%; height:1500px;';
  playListUrl: SafeResourceUrl;
  constructor(private restAPIUrlService: RestAPIurlService,
    private config: AppConfig, private restCallHandlerService: RestCallHandlerService, private sanitizer: DomSanitizer) {

    var self = this;
    //let response =self.config.getGrafanaHost1();
      var grafanaEndPoint = "http://localhost:3000"; //response.grafanaEndPoint
      self.playListUrl = sanitizer.bypassSecurityTrustResourceUrl(grafanaEndPoint + '/dashboard/script/iSight.js?url=' + grafanaEndPoint + '/playlists');
      console.log(this.playListUrl)
      console.log(this.playListUrl);
      self.setScrollBarPosition();
   

  }
  setScrollBarPosition() {
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  }
  ngOnInit() {
  }

}
