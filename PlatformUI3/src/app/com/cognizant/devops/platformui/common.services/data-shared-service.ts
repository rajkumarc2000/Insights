import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';


@Injectable()
export class DataSharedService {

  private userSource = new BehaviorSubject<String>('admin');
  currentUser = this.userSource.asObservable();

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) { }

  public changeUser(user: String) {
    this.userSource.next(user)
  }

  public uploadOrFetchLogo(imageSrc: any) {
    //console.log("in uploadOrFetchLogo ")
    if (imageSrc != 'DefaultLogo') {
      this.storage.set("customerLogo", imageSrc);
    } else {
      this.storage.set("customerLogo", "DefaultLogo");
    }
  }

  public getCustomerLogo() {
    return this.storage.get("customerLogo");
  }


}