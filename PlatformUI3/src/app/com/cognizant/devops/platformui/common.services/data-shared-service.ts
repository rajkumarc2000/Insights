import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataSharedService {

  private userSource = new BehaviorSubject<String>('admin');
  currentUser = this.userSource.asObservable();

  constructor() { }

  public changeUser(user: String) {
    this.userSource.next(user)
  }

}