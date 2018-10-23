import { Component } from '@angular/core';
import { AppConfig } from '@insights/common/app.config';

@Component({
  selector: 'insights-root',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})

export class InsightsAppComponent {
  title = 'PlatformUI3';
  constructor(private config: AppConfig){

  }
}
