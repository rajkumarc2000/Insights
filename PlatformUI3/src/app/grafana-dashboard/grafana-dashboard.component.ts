import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer, BrowserModule, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { AppConfig } from '@insights/common/app.config'

@Component({
  selector: 'app-grafana-dashboard',
  templateUrl: './grafana-dashboard.component.html',
  styleUrls: ['./grafana-dashboard.component.css']
})
export class GrafanaDashboardComponent implements OnInit {
  orgId: number;
  routeParameter: Observable<any>;
  playListUrl: SafeResourceUrl;
  constructor(private route: ActivatedRoute, private router: Router,
  private sanitizer: DomSanitizer) {
    var self = this;
      self.playListUrl = sanitizer.bypassSecurityTrustResourceUrl(AppConfig.grafanaHost + '/dashboard/script/iSight.js?url=' + AppConfig.grafanaHost + '/d/DrPYuKJmz/dynatrace-data?orgId=1');
      console.log(this.playListUrl)
      console.log(this.playListUrl);
      self.setScrollBarPosition();
  }

  ngOnInit() {
    this.routeParameter = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => params.get('id'))
    );
    console.log(this.routeParameter);
  }

  setScrollBarPosition() {
    setTimeout(function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  }

}
