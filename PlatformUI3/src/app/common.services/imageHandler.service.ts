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
        this.initializeImageIcons();
        this.addPathIconRegistry();
    }

    public initializeImageIcons() {
        this.addImage('defaultLogo', "icons/svg/landingPage/CognizantLogo.svg");
        this.addImage('verticleLine', "icons/svg/login/vertical_separator_bar.svg");
        this.addImage('AdminIconSelected', "icons/svg/landingPage/Admin_icon_selected.svg");
        this.addImage('DashboardIconNormal', "icons/svg/landingPage/Dashboard_icon_normal.svg");
        this.addImage('HealthcheckIconNormal', "icons/svg/landingPage/Healthcheck_icon_normal.svg");
        this.addImage('HelpIconNormal', "icons/svg/landingPage/Help_icon_normal.svg");
        this.addImage('playlistNormal', "icons/svg/landingPage/playlist_normal.svg");
        this.addImage('logoutNormal', "icons/svg/landingPage/logout_normal.svg");
        this.addImage('magnifying_glass', "icons/svg/landingPage/magnifying_glass.svg");
        this.addImage('aboutNormal', "icons/svg/landingPage/about_normal.svg");
    }


    public addPathIconRegistry() {
        this.imageMap.forEach((value: string, key: string) => {
            //console.log(key, value);
            this.iconRegistry.addSvgIcon(key, this.sanitizer.bypassSecurityTrustResourceUrl(value));
        });
    }

    public addImage(name: string, imagePath: String) {
        if (!this.imageMap.has(name)) {
            this.imageMap.set(name, imagePath);
        } else {
            throw new Error('imagePath with same name already exists');
        }
    }
    public getImagePath(imageKey: String) {
        if (!this.imageMap.has(imageKey)) {
            throw new Error("Url Mapping doesnt exist");
        }
        return this.imageMap.get(imageKey);
    }
}