import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-grafana-dashboard',
  templateUrl: './grafana-dashboard.component.html',
  styleUrls: ['./grafana-dashboard.component.css']
})
export class GrafanaDashboardComponent implements OnInit {
  orgId: number;
  routeParameter: Observable<any>;
  constructor(private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {
    this.routeParameter = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => params.get('id'))
    );
    console.log(this.routeParameter);
  }

}
