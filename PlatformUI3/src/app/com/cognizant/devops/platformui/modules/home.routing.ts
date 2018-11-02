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

import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PlaylistComponent } from '@insights/app/modules/playlist/playlist.component';
import { AdminComponent } from '@insights/app/modules/admin/admin.component';
import { HealthcheckComponent } from '@insights/app/modules/healthcheck/healthcheck.component';
import { GrafanaDashboardComponent } from '@insights/app/modules/grafana-dashboard/grafana-dashboard.component';
import { HomeComponent } from '@insights/app/modules/home/home.component';
import { PageNotFoundComponent } from '@insights/app/modules/page-not-found/page-not-found.component';

const homeRoutes: Routes = [
  {
    path: 'InSights/Home', component: HomeComponent,
    children: [
      { path: 'playlist', component: PlaylistComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'grafanadashboard/:id', component: GrafanaDashboardComponent },
      { path: 'healthcheck', component: HealthcheckComponent },
      { path: 'loggedout',redirectTo:'login'}
    ]
  }
];

export const HomeRouting: ModuleWithProviders = RouterModule.forChild(homeRoutes);