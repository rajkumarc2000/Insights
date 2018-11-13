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

import { Injectable } from '@angular/core';
import { DomSanitizer, BrowserModule, SafeUrl } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


export interface IImageHandlerService {
    getImagePath(imageKey: String): String;
    initializeImageIcons(): void;
    addPathIconRegistry(): void;
}

@Injectable()
export class ImageHandlerService implements IImageHandlerService {
    urlMapping = {};
    imageMap = new Map<String, String>();
    constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {

    }

    public initializeImageIcons() {
        this.addImage('defaultLogo', "icons/svg/landingPage/OneDevOps_InsightsLOGO.svg");
        this.addImage('verticleLine', "icons/svg/login/Vertical_Line.svg");
        this.addImage('user-icon', "icons/svg/login/user_icon.svg");
        this.addImage('user-icon-active', "icons/svg/login/user_icon_active.svg");
        this.addImage('password-icon', "icons/svg/login/password_icon.svg");
        this.addImage('password-icon-active', "icons/svg/login/password_icon_active.svg");
        this.addImage('favicon_icon',"icons/svg/IS.svg");
    }


    public addPathIconRegistry() {
        this.imageMap.forEach((value: string, key: string) => {
            this.iconRegistry.addSvgIcon(key, this.sanitizer.bypassSecurityTrustResourceUrl(value));
        });
    }

    public addImage(name: string, imagePath: String) {
        if (!this.imageMap.has(name)) {
            this.imageMap.set(name, imagePath);
        } else {
            throw new Error('imagePath with same name already exists ' + name);
        }
    }
    public getImagePath(imageKey: String) {
        if (!this.imageMap.has(imageKey)) {
            throw new Error("Url Mapping doesnt exist");
        }
        return this.imageMap.get(imageKey);
    }
}