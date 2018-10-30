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

import { Component, OnInit } from '@angular/core';
import { InsightsInitService } from '@insights/common/insights-initservice';
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
  iframeStyleAdd = 'width:100%; height:1500px; overflow-x: hidden !important;';
  playListUrl: SafeResourceUrl;
  constructor(private restAPIUrlService: RestAPIurlService, private config: AppConfig,
    private restCallHandlerService: RestCallHandlerService, private sanitizer: DomSanitizer) {

    var self = this;
    var receiveMessage = function (evt) {
      var height = parseInt(evt.data);
      if (!isNaN(height)) {
        self.iframeStyleAdd = 'width:100%; height:' + (evt.data + 20) + 'px !important; overflow-x: hidden !important;';
        console.log(self.iframeStyleAdd);
        window.setTimeout(0);
      }
    }
    window.addEventListener('message', receiveMessage, false);

    self.playListUrl = sanitizer.bypassSecurityTrustResourceUrl(InsightsInitService.grafanaHost + '/dashboard/script/iSight.js?url=' + InsightsInitService.grafanaHost + '/playlists');
    // console.log(this.playListUrl)
    //console.log(this.playListUrl);
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
