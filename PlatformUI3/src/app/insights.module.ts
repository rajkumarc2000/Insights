import { DomSanitizer, BrowserModule, SafeUrl } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HttpHeaders} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatSelectModule
} from '@angular/material';

import { InsightsAppComponent } from '@insights/app/insights.component';
import { LoginComponent } from '@insights/app/login/login.component';
import { PageNotFoundComponent } from '@insights/app/page-not-found/page-not-found.component';
import { HomeComponent } from '@insights/app/home/home.component';
import { PlaylistComponent } from '@insights/app/playlist/playlist.component';
import { AdminComponent } from '@insights/app/admin/admin.component';
import { MenuListItemComponent } from '@insights/app/menu-list-item/menu-list-item.component';

import { LoginService } from '@insights/app/login/login.service';
import { RestAPIurlService } from '@insights/common/rest-apiurl.service'
import { RestCallHandlerService } from '@insights/common/rest-call-handler.service'
import { AppConfig } from '@insights/common/app.config';
import { ImageHandlerService } from '@insights/common/imageHandler.service';
import { GrafanaAuthenticationService } from '@insights/common/grafana-authentication-service';

import { CookieService } from 'ngx-cookie-service';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },

  { path: 'login', component: LoginComponent },
  {
    path: 'InSights/Home', component: HomeComponent,
    children: [
      { path: 'playlist', component: PlaylistComponent },
      { path: 'admin', component: AdminComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    InsightsAppComponent,
    LoginComponent,
    PageNotFoundComponent,
    HomeComponent,
    PlaylistComponent,
    AdminComponent,
    MenuListItemComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatNativeDateModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSelectModule,
    RouterModule.forRoot(appRoutes)

  ],
  providers: [
    LoginService,
    AppConfig,
    RestAPIurlService,
    RestCallHandlerService,
    ImageHandlerService,
    GrafanaAuthenticationService,
    AppConfig,
    CookieService

  ],
  bootstrap: [InsightsAppComponent]
})
export class InsightsAppModule { }
