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

import { Component, ViewChild, HostBinding, Input, ElementRef, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core';
import { GrafanaAuthenticationService } from '@insights/common/grafana-authentication-service';
import { CookieService } from 'ngx-cookie-service';
import { InsightsInitService } from '@insights/common/insights-initservice';
import { Router } from '@angular/router';
import { NavItem } from '@insights/common/nav-item';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableModule } from '@angular/material/table';
import { DataSharedService } from '@insights/common/data-shared-service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class HomeComponent implements OnInit {
  isExpanded = false;
  element: HTMLElement;
  userName: String = '';
  userRole: String = '';
  userCurrentOrg: string = '';
  showAdminTab: boolean = false;
  isToolbarDisplay: boolean = true;
  showBusinessMapping: boolean = false;
  isValidUser: boolean = false;
  iframeStyle = 'width:100%; height:500px;';
  iframeWidth = window.innerWidth - 20;
  iframeHeight = window.innerHeight;
  grafanaResponse: any;
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  navItems: NavItem[] = [];
  navItemsBottom: NavItem[] = [];
  navOrgList: NavItem[] = [];
  selectedItem: NavItem;
  orgList = [];
  defaultOrg: number;
  selectedOrg: String;
  sidenavWidth: number = 14;
  framesize: any;
  ngOnInit() {
  }
  constructor(private grafanaService: GrafanaAuthenticationService,
    private cookieService: CookieService, private config: InsightsInitService,
    public router: Router, private dataShare: DataSharedService) {
    router.onSameUrlNavigation = 'reload';
    //console.log("In Home Component");
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.grafanaService.validateSession();
    this.isValidUser = true;
    /*this.iframeStyle = 'width:100%; height:400px;';
    var receiveMessage = function (evt) {
      var height = parseInt(evt.data);
      if (!isNaN(height)) {
        this.iframeStyle = 'width:100%; height:' + (evt.data + 20) + 'px';
      }
    }
    console.log(this.iframeStyle);
    window.addEventListener('message', receiveMessage, false);*/
    this.framesize = window.frames.innerHeight;
    var receiveMessage = function (evt) {
      var height = parseInt(evt.data);
      if (!isNaN(height)) {
        this.framesize = (evt.data + 20);
      }
    }
    var otherMenu = ((45 / 100) * this.framesize);
    console.log(otherMenu + " " + this.framesize);
    this.framesize = this.framesize - otherMenu; //bottom nav 106 px + tap fix content 110 236
    console.log(this.framesize);
    window.addEventListener('message', receiveMessage, false);
    this.getInformationFromGrafana();
    this.loadorganizations();
  }

  onItemSelected(item: NavItem) {
    this.selectedItem = item;
    this.isToolbarDisplay = item.isToolbarDisplay
    if (!item.children || !item.children.length) {
      if (item.iconName == 'grafanaOrg') {
        this.selectedOrg = (this.selectedItem == undefined ? '' : this.selectedItem.displayName);
        this.switchOrganizations(item.orgId);
        this.router.navigateByUrl(item.route, { skipLocationChange: true });//+ item.orgId
      } else if (item.iconName == 'logout') {
        this.logout();
        //this.router.navigateByUrl(item.route, { skipLocationChange: true });
      } else {
        this.router.navigateByUrl(item.route, { skipLocationChange: true });
      }
    }/*else if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }*/
  }

  public async getInformationFromGrafana() {
    let currentUserResponce: any;
    this.grafanaResponse = await this.grafanaService.getGrafanaCurrentOrgAndRole();
    let self = this;
    //console.log(this.grafanaResponse);
    if (this.grafanaResponse.grafanaCurrentOrgRole === 'Admin') {
      this.showAdminTab = true;
    } else {
      this.showAdminTab = false;
    }
    this.cookieService.set('grafanaRole', this.grafanaResponse.grafanaCurrentOrgRole);
    this.cookieService.set('grafanaOrg', this.grafanaResponse.grafanaCurrentOrg);
    if (this.grafanaResponse != undefined) {
      if (this.grafanaResponse.userName != undefined) {
        this.userName = this.grafanaResponse.userName.replace(/['"]+/g, '');
        this.dataShare.changeUser(this.userName);
      }
      this.userRole = this.grafanaResponse.grafanaCurrentOrgRole;
      this.userCurrentOrg = this.grafanaResponse.grafanaCurrentOrg;
      currentUserResponce = await this.grafanaService.getCurrentUserOrgs();
      if (currentUserResponce.data != undefined) {
        let filterOrgName = currentUserResponce.data.filter(function (i) {
          return i.orgId == self.userCurrentOrg;
        });
        //console.log(filterOrgName.length > 0);
        this.selectedOrg = (filterOrgName.length > 0) ? filterOrgName[0].name : null;
      } else {
        this.router.navigate(['/login']);
      }
      //console.log(this.selectedOrg);
    }
  }

  public async loadorganizations() {
    var self = this;
    let orgResponse = await this.grafanaService.getCurrentUserOrgs();
    let userResponse = await this.grafanaService.getUsers()
    //console.log(orgResponse.data);
    //console.log(userResponse.data);

    if (orgResponse.data != undefined) {
      var orgDataArray = orgResponse.data;
      this.orgList = orgDataArray;
      if (userResponse.data != undefined) {
        var grafanaOrgId = userResponse.data.orgId;
        //console.log(grafanaOrgId);
      }
      for (var key in this.orgList) {
        var orgDtl = this.orgList[key];
        var navItemobj = new NavItem();
        navItemobj.displayName = orgDtl.name;
        navItemobj.iconName = 'grafanaOrg';
        navItemobj.route = 'InSights/Home/grafanadashboard/' + orgDtl.orgId;
        navItemobj.isToolbarDisplay = false;
        navItemobj.showIcon = false;
        navItemobj.isAdminMenu = false;
        navItemobj.orgId = orgDtl.orgId;
        this.navOrgList.push(navItemobj);
      }

    }
    //console.log(this.orgList);
    this.loadMenuItem();
  }

  public loadMenuItem() {
    //console.log(" In load menu " + this.selectedOrg);
    this.navItems = [
      {
        displayName: 'Dashboards',
        iconName: 'feature',
        isAdminMenu: false,
        children: [
          {
            displayName: 'Grafana : ',
            iconName: 'grafana',
            isAdminMenu: false,
            isToolbarDisplay: false,
            children: this.navOrgList
            /*children: [
              {
                displayName: 'Swithch Org',
                iconName: 'switch_org',
                isToolbarDisplay: false,
                isAdminMenu: false,
                children: this.navOrgList,
              }
            ]*/
          },
          {
            displayName: 'ML Capabilities',
            iconName: 'feature',
            route: 'InSights/Home/grafanadashboard/100',
            isToolbarDisplay: true,
            isAdminMenu: true
          },
          {
            displayName: 'InSights',
            iconName: 'feature',
            route: 'InSights/Home/grafanadashboard/200',
            isToolbarDisplay: true,
            isAdminMenu: true
          },
          {
            displayName: 'DevOps Maturity',
            iconName: 'feature',
            route: 'InSights/Home/grafanadashboard/300',
            isToolbarDisplay: true,
            isAdminMenu: true
          },
          {
            displayName: 'BlockChain Development',
            iconName: 'feature',
            route: 'InSights/Home/grafanadashboard/400',
            isToolbarDisplay: true,
            isAdminMenu: true
          }
        ]
      },
      {
        displayName: 'Playlist',
        iconName: 'feature',
        route: 'InSights/Home/playlist',
        isToolbarDisplay: false,
        isAdminMenu: false
      },
      {
        displayName: 'Data Dictionary',
        iconName: 'feature',
        route: 'InSights/Home/datadictionary',
        isToolbarDisplay: true,
        isAdminMenu: false
      },
      {
        displayName: 'Health Check',
        iconName: 'feature',
        route: 'InSights/Home/healthcheck',
        isToolbarDisplay: true,
        isAdminMenu: true
      },
      {
        displayName: 'Admin',
        iconName: 'admin',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true,
        isAdminMenu: true,
        children: [
          {
            displayName: 'Agent Management',
            iconName: 'feature',
            route: 'InSights/Home/agentmanagement',
            isToolbarDisplay: true,
            isAdminMenu: true
          },
          {
            displayName: 'Business Mapping',
            iconName: 'feature',
            route: 'InSights/Home/businessmapping',
            isToolbarDisplay: true,
            isAdminMenu: true
          },
          {
            displayName: 'Access Group Management',
            iconName: 'feature',
            route: 'InSights/Home/grafanadashboard/900',
            isToolbarDisplay: true,
            isAdminMenu: true
          },
          {
            displayName: 'Logo Setting',
            iconName: 'feature',
            route: 'InSights/Home/grafanadashboard/1000',
            isToolbarDisplay: true,
            isAdminMenu: true
          },
          {
            displayName: 'Data Archiving',
            iconName: 'feature',
            route: 'InSights/Home/dataarchiving',
            isToolbarDisplay: true,
            isAdminMenu: true
          }
          /*{
            displayName: 'Settings',
            iconName: 'feature',
            route: 'InSights/Home/grafanadashboard/1000',
            isToolbarDisplay: true,
            isAdminMenu: true,
            children: [
              

            ]
          }*/
        ]
      }/*,
      {
        displayName: 'Help',
        iconName: 'help',
        route: 'InSights/Home/grafanadashboard/750',
        isToolbarDisplay: true,
        showIcon: true,
        isAdminMenu: false
      },
      {
        displayName: 'Logout',
        iconName: 'logout',
        route: 'login',
        isToolbarDisplay: true,
        showIcon: true,
        isAdminMenu: false
      }*/
    ];
    this.navItemsBottom = [
      {
        displayName: 'About',
        iconName: 'feature',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true,
        showIcon: true,
        isAdminMenu: false
      }, {
        displayName: 'Help',
        iconName: 'feature',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true,
        showIcon: true,
        isAdminMenu: false
      }, {
        displayName: 'Logout',
        iconName: 'logout',
        route: 'login', //loggedout
        isToolbarDisplay: true,
        showIcon: true,
        isAdminMenu: false
      }
    ];
    //console.log(this.navItems);
  }

  public logout(): void {
    var self = this;
    var uniqueString = "grfanaLoginIframe";
    var iframe = document.createElement("iframe");
    iframe.id = uniqueString;
    document.body.appendChild(iframe);
    iframe.style.display = "none";
    iframe.contentWindow.name = uniqueString;
    // construct a form with hidden inputs, targeting the iframe
    var form = document.createElement("form");
    form.target = uniqueString;
    this.config.getGrafanaHost1().then(function (response) {
      form.action = InsightsInitService.grafanaHost + "/logout";
      // console.log("form action "+form.action); //response.grafanaEndPoint
      form.method = "GET";
      document.body.appendChild(form);
      form.submit();
    });
    this.grafanaService.logout()
      .then(function (data) {
        //console.log(data);
      });
    this.deleteAllPreviousCookies();
    this.router.navigate(['/login']);
  }

  async switchOrganizations(orgId) {
    var self = this;
    self.defaultOrg = orgId;
    var switchorgResponse = await self.grafanaService.switchUserOrg(orgId);
    if (switchorgResponse != null && switchorgResponse.status === 'success') {
      var currentroleandorg = await self.grafanaService.getGrafanaCurrentOrgAndRole();
      if (currentroleandorg != null) {
        //console.log("Role " + currentroleandorg.grafanaCurrentOrgRole);
        if (currentroleandorg.grafanaCurrentOrgRole === 'Admin') {
          this.showAdminTab = true;
        } else {
          this.showAdminTab = false;
        }

        self.cookieService.set('grafanaRole', currentroleandorg.grafanaCurrentOrgRole);
        self.cookieService.set('grafanaOrg', currentroleandorg.grafanaCurrentOrg);
        this.userRole = currentroleandorg.grafanaCurrentOrgRole;

        if (currentroleandorg.userName != undefined) {
          this.userName = currentroleandorg.userName.replace(/['"]+/g, '');
          this.dataShare.changeUser(this.userName);
        }

      }
    }
  }

  deleteAllPreviousCookies(): void {
    let allCookies = this.cookieService.getAll();
    console.log(allCookies);

    for (let key of Object.keys(allCookies)) {
      console.log(key);
      this.cookieService.delete(key);
    }
  }

}
