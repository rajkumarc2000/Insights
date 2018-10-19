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

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { AdminComponent } from './admin/admin.component';
import { MenuListItemComponent } from './menu-list-item/menu-list-item.component';

import { LoginService } from './login/login.service';
import { RestAPIurlService } from './common.services/rest-apiurl.service'
import { RestCallHandlerService } from './common.services/rest-call-handler.service'
import { AppConfig } from './common.services/app.config';
import { ImageHandlerService } from './common.services/imageHandler.service';
import { GrafanaAuthenticationService } from './common.services/grafana-authentication-service';


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
    AppComponent,
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
  bootstrap: [AppComponent]
})
export class AppModule { }
