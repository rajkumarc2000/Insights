import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
 
import { LoginService } from './services/login.service';
import { RestEndpointService } from './services/rest-endpoint.service'
import { RestAPIurlService } from './services/rest-apiurl.service'
import { RestCallHandlerService } from './services/rest-call-handler.service'
import { AppConfig } from './services/app.config';
import { CookieService } from 'ngx-cookie-service';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'InSights/Home', component: HomeComponent },
  { path: '**'   , component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(appRoutes) 
    
  ],
  providers: [
    LoginService,
    RestEndpointService,
    RestAPIurlService,
    RestCallHandlerService,
    AppConfig,
    CookieService
  
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
