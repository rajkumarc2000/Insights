import { Component, OnInit } from '@angular/core';
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service';
import { DomSanitizer, BrowserModule, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { UserOnboardingService } from '@insights/app/modules/user-onboarding/user-onboarding-service';
import { MatTableDataSource } from '@angular/material';
import { ConfirmationMessageDialog } from '@insights/app/modules/application-dialog/confirmation-message-dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';



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
  roleRecord = [
    { value: 'Editor', name: 'Editor' },
    { value: 'Admin', name: 'Admin' },
    { value: 'Viewer', name: 'Viewer' }
  ];

  constructor(private userOnboardingService: UserOnboardingService, private sanitizer: DomSanitizer,
    public dialog: MatDialog) {
    var self = this;

    this.framesize = window.frames.innerHeight;

    var receiveMessage = function (evt) {
      var height = parseInt(evt.data);
      if (!isNaN(height)) {
        self.framesize = (evt.data + 20);
      }
    }
    //console.log(this.framesize);
    window.addEventListener('message', receiveMessage, false);
    this.grafanaUrl = InsightsInitService.grafanaHost;
    //console.log(this.framesize);
    this.getApplicationDetail();
    self.userListUrl = sanitizer.bypassSecurityTrustResourceUrl(InsightsInitService.grafanaHost + '/dashboard/script/iSight_ui3.js?url=' + InsightsInitService.grafanaHost + '/playlists');

  }

  ngOnInit() {
  }

  async getApplicationDetail() {
    this.adminOrgDataArray = [];

    let adminOrgsResponse = await this.userOnboardingService.getCurrentUserOrgs();
    console.log(adminOrgsResponse);
    if (adminOrgsResponse.data != undefined && adminOrgsResponse.status == "success") {
      for (var org in adminOrgsResponse.data) {
        if ((adminOrgsResponse.data[org].role) === 'Admin') {
          this.adminOrgDataArray.push(adminOrgsResponse.data[org]);
        }
      }
    }
    console.log(this.adminOrgDataArray);
    /*then(function (orgData) { 
      var orgDataArray = orgData.data;
      /*self.getUserAdminOrgs(orgDataArray);
      self.authenticationService.getGrafanaCurrentOrgAndRole()
        .then(function (data) {
          self.getCurrentOrgName(data, orgDataArray);
        });*
    }); */
  }

  async loadUsersInfo(selectedAdminOrg) {

    console.log(selectedAdminOrg);
    let usersResponseData = await this.userOnboardingService.getOrganizationUsers(selectedAdminOrg);
    console.log(usersResponseData);
    console.log(usersResponseData.data);
    if (usersResponseData.data != undefined && usersResponseData.status == "success") {
      this.showDetail = true;
      this.displayedColumns = ['radio', 'UserImage', 'Login', 'Email', 'Seen', 'Role'];
      this.userDataSource = new MatTableDataSource(usersResponseData.data);
    }
  }

  statusEdit(element) {
    if (element != undefined) {
      this.isbuttonenabled = true;
    }
  }

  editUserData() {
    console.log("Edit " + JSON.stringify(this.selectedUser) + " select org " + this.selectedUser.orgId);
    this.isSaveEnable = true;
  }

  deleteOrgUser() {
    console.log("Delete " + this.selectedUser);
    console.log(this.selectedAdminOrg)
    if (this.selectedUser != undefined) {
      var self = this;
      const dialogRef = this.dialog.open(ConfirmationMessageDialog, {
        width: '40%',
        height: '40%',
        data: {
          title: "Delete User",
          message: "Are you sure we want ot delete this  " + this.selectedUser.login + " user from organization "
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed  ' + result);
        if (result == 'yes') {
          self.userOnboardingService.deleteUserOrg(this.selectedUser.orgId, this.selectedUser.userId, this.selectedUser.role)
            .then(function (deleteResponse) {
              if (deleteResponse.message = "User removed from organization") {
                self.isSaveEnable = false;
                self.showApplicationMessage = deleteResponse.message;
              } else {
                self.showApplicationMessage = "Unable to update user Data";
              }
            });
          self.loadUsersInfo(this.selectedAdminOrg);
          setTimeout(() => {
            self.showApplicationMessage = "";
          }, 2000);
        }
      });
    }

  }

  async saveData() {
    console.log("Edit " + JSON.stringify(this.selectedUser) + " select org " + this.selectedUser.orgId + " Role " + this.selectedUser.role);
    let editResponse = await this.userOnboardingService.editUserOrg(this.selectedUser.orgId, this.selectedUser.userId, this.selectedUser.role);
    console.log(editResponse);
    if (editResponse.message = "Organization user updated") {
      this.isSaveEnable = false;
      this.showApplicationMessage = editResponse.message;
    } else {
      this.showApplicationMessage = "Unable to update user Data";
    }
    setTimeout(() => {
      this.showApplicationMessage = "";
    }, 2000);
  }

  applyFilter(filterValue: string) {
    this.userDataSource.filter = filterValue.trim().toLowerCase();
  }

  accessGroupCreate(accessGroupName) {
    console.log(this.accessGroupName);
    if (this.accessGroupName != undefined) {
      var self = this;
      const dialogRef = this.dialog.open(ConfirmationMessageDialog, {
        width: '40%',
        height: '40%',
        data: {
          title: "Confirm Access Group Name",
          message: "Adding an Access Group cannot be REVERTED." +
            "Once the Access Group name is added you will not be able to RENAME or DELETE the Access Group <br> Are you sure you want to create accessGroup " + accessGroupName
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed  ' + result);
        if (result == 'yes') {
          console.log("confirm access group " + accessGroupName)
        }
      });
    }
    setTimeout(() => {
      this.showApplicationMessage = "";
    }, 2000);
  }

  displayaccessGroupCreateField() {
    this.displayAccessGroupDetail = !this.displayAccessGroupDetail;
  }
}
