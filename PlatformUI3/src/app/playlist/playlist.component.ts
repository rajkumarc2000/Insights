import { Component, OnInit } from '@angular/core';
import { AppConfig } from '@insights/common/app.config'
import { RestAPIurlService } from '@insights/common/rest-apiurl.service'
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
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
  constructor(private restAPIUrlService: RestAPIurlService,private config: AppConfig, 
  private restCallHandlerService: RestCallHandlerService, private sanitizer: DomSanitizer) {

    var self = this;
      self.playListUrl = sanitizer.bypassSecurityTrustResourceUrl(AppConfig.grafanaHost + '/dashboard/script/iSight.js?url=' + AppConfig.grafanaHost + '/playlists');
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
