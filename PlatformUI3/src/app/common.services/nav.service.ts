import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class NavService {
  public appDrawer: any;

  constructor() {
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }
}
