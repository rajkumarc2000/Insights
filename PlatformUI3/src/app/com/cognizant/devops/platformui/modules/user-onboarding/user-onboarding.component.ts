import { Component, OnInit } from '@angular/core';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { DomSanitizer, BrowserModule, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { UserOnboardingService } from '@insights/app/modules/user-onboarding/user-onboarding-service';
import { MatTableDataSource } from '@angular/material';
import { ConfirmationMessageDialog } from '@insights/app/modules/application-dialog/confirmation-message-dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AddGroupMessageDialog } from '@insights/app/modules/user-onboarding/add-group-message-dialog';
import { MessageDialogService } from '@insights/app/modules/application-dialog/message-dialog-service';

@Component({
  selector: 'app-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrls: ['./user-onboarding.component.css', './../home.module.css']
})
export class UserOnboardingComponent implements OnInit {

  mainContentMinHeightWoSbTab: string = 'min-height:' + (window.innerHeight - 146 - 48) + 'px';
  iframeStyleAdd = "{'height': 1500 +'px '+ '!important' }";
  userListUrl: SafeResourceUrl;
  framesize: any;
  adminOrgDataArray = [];
  readOnlyOrg: boolean = false;
  selectedUser: any;
  userDataSource: any = [];
  displayedColumns = [];
  isbuttonenabled: boolean = false;
  isSaveEnable: boolean = false;
  showDetail: boolean = false;
  displayAccessGroupDetail: boolean = false;
  accessGroupName: String = "";
  grafanaUrl: String = "";
  showApplicationMessage: String = "";
  selectedAdminOrg: any;
  isSelectedUserId: any = -1;
  roleRecord = [
    { value: 'Editor', name: 'Editor' },
    { value: 'Admin', name: 'Admin' },
    { value: 'Viewer', name: 'Viewer' }
  ];

  constructor(private userOnboardingService: UserOnboardingService, private sanitizer: DomSanitizer,
    public dialog: MatDialog, public messageDialog: MessageDialogService) {
    var self = this;

    this.framesize = window.frames.innerHeight;

    var receiveMessage = function (evt) {
      var height = parseInt(evt.data);
      if (!isNaN(height)) {
        self.framesize = (evt.data + 20);
      }
    }
    window.addEventListener('message', receiveMessage, false);
    this.getApplicationDetail();
  }

  ngOnInit() {
  }

  async getApplicationDetail() {
    this.adminOrgDataArray = [];

    let adminOrgsResponse = await this.userOnboardingService.getCurrentUserOrgs();
    if (adminOrgsResponse.data != undefined && adminOrgsResponse.status == "success") {
      for (var org in adminOrgsResponse.data) {
        if ((adminOrgsResponse.data[org].role) === 'Admin') {
          this.adminOrgDataArray.push(adminOrgsResponse.data[org]);
        }
      }
    }
  }

  async loadUsersInfo(selectedAdminOrg) {
    let usersResponseData = await this.userOnboardingService.getOrganizationUsers(selectedAdminOrg);
    if (usersResponseData.data != undefined && usersResponseData.status == "success") {
      //console.log(usersResponseData.data);
      this.showDetail = true;
      this.displayedColumns = ['radio', 'Login', 'Email', 'Seen', 'Role'];
      this.userDataSource = new MatTableDataSource(usersResponseData.data);
    } else {
      this.messageDialog.showApplicationsMessage("Unable to load data", "WARN");
    }
  }

  statusEdit(element) {
    if (element != undefined) {
      this.isbuttonenabled = true;
    }
  }

  editUserData() {
    //console.log(this.selectedUser.userId);
    this.isSaveEnable = true;
    this.isSelectedUserId = this.selectedUser.userId;
  }

  deleteOrgUser() {
    //console.log("result " + this.selectedUser.login);
    if (this.selectedUser != undefined) {
      var self = this;
      var title = "Delete User";
      var dialogmessage = "Are you sure we want to delete this \" " + this.selectedUser.login + " \" user from organization ";
      const dialogRef = self.messageDialog.showConfirmationMessage(title, dialogmessage, "");
      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
        if (result == 'yes') {
          self.userOnboardingService.deleteUserOrg(this.selectedUser.orgId, this.selectedUser.userId, this.selectedUser.role)
            .then(function (deleteResponse) {
              if (deleteResponse.message = "User removed from organization") {
                self.isSaveEnable = false;
                self.showApplicationMessage = deleteResponse.message;
                self.messageDialog.showApplicationsMessage(deleteResponse.message, "SUCCESS");
              } else {
                self.showApplicationMessage = "Unable to update user Data";
                self.messageDialog.showApplicationsMessage("Unable to Delete user Data", "WARN");
              }
            });
          self.loadUsersInfo(this.selectedAdminOrg);
          setTimeout(() => {
            self.showApplicationMessage = "";
          }, 2000);
        }
        this.loadUsersInfo(this.selectedAdminOrg);
      });
    }
  }

  async saveData() {
    let editResponse = await this.userOnboardingService.editUserOrg(this.selectedUser.orgId, this.selectedUser.userId, this.selectedUser.role);
    if (editResponse.message = "Organization user updated") {
      this.isSaveEnable = false;
      this.showApplicationMessage = editResponse.message;
      this.messageDialog.showApplicationsMessage(editResponse.message, "SUCCESS");
    } else {
      this.showApplicationMessage = "Unable to update user Data";
      this.messageDialog.showApplicationsMessage(editResponse.message, "WARN");
    }
    setTimeout(() => {
      this.showApplicationMessage = "";
    }, 2000);
  }

  applyFilter(filterValue: string) {
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  displayaccessGroupCreateField() {
    this.displayAccessGroupDetail = !this.displayAccessGroupDetail;
    if (this.accessGroupName != undefined) {
      var self = this;
      const dialogRef = this.dialog.open(AddGroupMessageDialog, {
        width: '45%',
        height: '45%',
        data: {
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined && result != 'no') { //'yes'
          self.userOnboardingService.createOrg(result)
            .then(function (createOrgResponse) {
              if (createOrgResponse.message = "Organization created") {
                self.isSaveEnable = false;
                self.showApplicationMessage = createOrgResponse.message;
                self.messageDialog.showApplicationsMessage(createOrgResponse.message, "SUCCESS");
              } else {
                self.showApplicationMessage = "Unable create";
                self.messageDialog.showApplicationsMessage("Unable to Create Organization", "WARN");
              }
            });
          self.loadUsersInfo(this.selectedAdminOrg);
          setTimeout(() => {
            self.showApplicationMessage = "";
          }, 2000);
        }
      });
    }
    setTimeout(() => {
      this.showApplicationMessage = "";
    }, 2000);
  }
}
