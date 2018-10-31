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

import { Component, ViewChild, HostBinding, Input, ElementRef, ViewEncapsulation, AfterViewInit, OnInit, HostListener } from '@angular/core';
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
  iframeStyleAdd = "{'height': 1500 +'px '+ '!important' }";
  playListUrl: SafeResourceUrl;
  windowHeight: any;
  windowWidth: any;
  constructor(private restAPIUrlService: RestAPIurlService, private config: InsightsInitService,
    private restCallHandlerService: RestCallHandlerService, private sanitizer: DomSanitizer) {
    var self = this;

    this.windowHeight = (window.screen.height);
    this.windowWidth = (window.screen.width);
    var framesize=window.frames.innerHeight;
    console.log(window);
    console.log(framesize);
    console.log(this.windowHeight);
    console.log(this.windowWidth)

    self.playListUrl = sanitizer.bypassSecurityTrustResourceUrl(InsightsInitService.grafanaHost + '/dashboard/script/iSight.js?url=' + InsightsInitService.grafanaHost + '/playlists');
    //self.setScrollBarPosition();
  }

  setScrollBarPosition() {
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  }
  ngOnInit() {
  }

}
