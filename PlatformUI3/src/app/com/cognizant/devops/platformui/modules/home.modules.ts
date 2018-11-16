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

import { DomSanitizer, BrowserModule, SafeUrl } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@insights/app/material.module';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material';


import { HomeRouting } from '@insights/app/modules/home.routing';
import { SharedServices } from '@insights/app/shared.services';

import { HomeComponent } from '@insights/app/modules/home/home.component';
import { PlaylistComponent } from '@insights/app/modules/playlist/playlist.component';
import { AdminComponent } from '@insights/app/modules/admin/admin.component';
import { MenuListItemComponent } from '@insights/app/modules/menu-list-item/menu-list-item.component';
import { GrafanaDashboardComponent } from '@insights/app/modules/grafana-dashboard/grafana-dashboard.component';
import { PageNotFoundComponent } from '@insights/app/modules/page-not-found/page-not-found.component';
import { HealthCheckComponent } from '@insights/app/modules/healthcheck/healthcheck.component';
import { ShowDetailsDialog } from '@insights/app/modules/healthcheck/healthcheck-show-details-dialog';

import { GrafanaAuthenticationService } from '@insights/common/grafana-authentication-service';
import { GrafanaDashboardService } from '@insights/app/modules/grafana-dashboard/grafana-dashboard-service';
import { AgentManagementComponent } from '@insights/app/modules/admin/agent-management/agent-management.component';
import { AgentService } from '@insights/app/modules/admin/agent-management/agent-management-service';
import { HealthCheckService } from '@insights/app/modules/healthcheck/healthcheck.service';


@NgModule({
  declarations: [
    HomeComponent,
    PlaylistComponent,
    AdminComponent,
    MenuListItemComponent,
    GrafanaDashboardComponent,
    PageNotFoundComponent,
    HealthCheckComponent,
    ShowDetailsDialog,
    AgentManagementComponent
  ],
  imports: [
    HomeRouting,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedServices
  ],
  entryComponents: [
    ShowDetailsDialog
  ],

  providers: [
    GrafanaAuthenticationService,
    GrafanaDashboardService,
    AgentService, 
    HealthCheckService
  ]
})



export class HomeModules { }
