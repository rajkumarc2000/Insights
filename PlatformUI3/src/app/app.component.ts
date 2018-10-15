import { Component } from '@angular/core';
import { AppConfig } from './common.services/app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PlatformUI3';
  constructor(private config: AppConfig){

  }
}
