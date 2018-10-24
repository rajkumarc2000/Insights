import { Component, ViewChild, HostBinding, Input, ElementRef, ViewEncapsulation, AfterViewInit, OnInit } from '@angular/core';
import { GrafanaAuthenticationService } from '@insights/common/grafana-authentication-service';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '@insights/common/app.config'
import { Router } from '@angular/router';
import { NavItem } from '@insights/common/nav-item';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  userCurrentOrgName: string = '';
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
  orgList = [];
  selectedApp: string;
  defaultOrg: number;
  sidenavWidth: number = 14;

  ngOnInit() {
    console.log("In Home Component A Init");
  }




  constructor(private grafanaService: GrafanaAuthenticationService,
    private cookieService: CookieService, private config: AppConfig,
    private router: Router) {
      console.log("In Home Component");
    if (this.depth === undefined) {
      this.depth = 0;
    }
    this.grafanaService.validateSession();
    this.isValidUser = true;
    this.iframeStyle = 'width:100%; height:400px;';
    var receiveMessage = function (evt) {
      var height = parseInt(evt.data);
      if (!isNaN(height)) {
        this.iframeStyle = 'width:100%; height:' + (evt.data + 20) + 'px';
      }
    }
    window.addEventListener('message', receiveMessage, false);
    this.getInformationFromGrafana();
    this.loadorganizations();
  }

  onItemSelected(item: NavItem) {
    console.log(item);
    if (item.isToolbarDisplay != undefined) {
      this.isToolbarDisplay = item.isToolbarDisplay
    } else {
      this.isToolbarDisplay = true;
    }
    console.log(item.isToolbarDisplay + "" + this.isToolbarDisplay)
    if (!item.children || !item.children.length) {
      if(item.iconName=='grafanaOrg'){
        console.log(item.route);
        this.router.navigate([item.route]);
      }else{
        this.router.navigate([item.route]);
      }
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  public async getInformationFromGrafana() {
    let currentUserResponce: any;
    this.grafanaResponse = await this.grafanaService.getGrafanaCurrentOrgAndRole();
    let self = this;
    console.log(this.grafanaResponse);
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
      }
      this.userRole = this.grafanaResponse.grafanaCurrentOrgRole;
      this.userCurrentOrg = this.grafanaResponse.grafanaCurrentOrg;
      currentUserResponce = await this.grafanaService.getCurrentUserOrgs();
      if (currentUserResponce.data != undefined) {
        let filterOrgName = currentUserResponce.data.filter(function (i) {
          return i.orgId == self.userCurrentOrg;
        });
        console.log(filterOrgName.length > 0);
        this.userCurrentOrgName = (filterOrgName.length > 0) ? filterOrgName[0].name : null;
        console.log(this.userCurrentOrgName);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  public async loadorganizations() {
    var self = this;
    let orgResponse = await this.grafanaService.getCurrentUserOrgs();
    let userResponse = await this.grafanaService.getUsers()
    console.log(orgResponse.data);
    console.log(userResponse.data);
    // .then(function (orgData) 
    if (orgResponse.data != undefined) {
      var orgDataArray = orgResponse.data;
      this.orgList = orgDataArray;
      if (userResponse.data != undefined) {
        var grafanaOrgId = userResponse.data.orgId;
        console.log(grafanaOrgId);
        /* this.defaultOrg = grafanaOrgId;
         for (var key in this.orgList) {
           var orgDtl = this.orgList[key];
           if (orgDtl.id === grafanaOrgId) {
             this.selectedApp = orgDtl.name;
           }
         }*/
        // self.getDashboards();

      }
      for (var key in this.orgList) {
        var orgDtl = this.orgList[key];
        var navItemobj = new NavItem();
        navItemobj.displayName = orgDtl.name;
        navItemobj.iconName ='grafanaOrg' ;
        navItemobj.route = 'InSights/Home/grafanadashboard/'+orgDtl.orgId;
        this.navOrgList.push(navItemobj);
      }
      console.log(this.navOrgList);
      //.then(function (userData) 

      // );
    }
    console.log(this.selectedApp);
    console.log(this.orgList);
    this.loadMenuItem();
  }

  public loadMenuItem() {

    this.navItems = [
      {
        displayName: 'Dashboard',
        iconName: '',
        route: 'InSights/Home/admin',
        children: [
          {
            displayName: 'Grafana',
            iconName: 'grafana',
            route: 'InSights/Home/admin',
            children: [
              {
                displayName: 'Swithch Org',
                iconName: 'switch_org',
                route: 'InSights/Home/grafanadashboard',
                isToolbarDisplay: false,
                children: this.navOrgList,
              }
            ]
          },
          {
            displayName: 'ML Capability',
            iconName: 'feature',
            route: 'InSights/Home/admin',
          },
          {
            displayName: 'InSights',
            iconName: 'feature',
            route: 'InSights/Home/admin',
          },
          {
            displayName: 'Devops Matuarity',
            iconName: 'feature',
            route: 'InSights/Home/admin'
          },
          {
            displayName: 'BlockChain Development',
            iconName: 'feature',
            route: 'InSights/Home/admin'
          }
        ]
      },
      {
        displayName: 'Playlist',
        iconName: 'feature',
        route: 'InSights/Home/playlist',
        isToolbarDisplay: true
      },
      {
        displayName: 'Data Dictionary',
        iconName: 'feature',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true
      },
      {
        displayName: 'Health Check',
        iconName: 'feature',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true
      },
      {
        displayName: 'Admin',
        iconName: 'admin',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true
      },
      {
        displayName: 'Help',
        iconName: 'help',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true
      },
      {
        displayName: 'Logout',
        iconName: 'logout',
        route: 'login',
        isToolbarDisplay: true
      }
    ];
    /*this.navItemsBottom = [
      {
        displayName: 'Help',
        iconName: 'help',
        route: 'InSights/Home/admin',
        isToolbarDisplay: true
      }, {
        displayName: 'Logout',
        iconName: 'logout',
        route: 'login',
        isToolbarDisplay: true
      }
    ];*/

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
      form.action = response.grafanaEndPoint + "/logout";
      // console.log("form action "+form.action);
      form.method = "GET";
      document.body.appendChild(form);
      form.submit();
    });
    this.grafanaService.logout()
      .then(function (data) {
        //console.log(data);
      });
    var cookieVal = this.cookieService.getAll();
    for (var key in cookieVal) {
      cookieVal[key] = '';
      this.cookieService.set(key, cookieVal[key]);
      this.cookieService.delete(key);
    }
    this.router.navigate(['/login']);
  }

}
