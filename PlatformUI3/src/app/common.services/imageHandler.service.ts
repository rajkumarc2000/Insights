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
        this.addImage('defaultLogo', "/icons/svg/landingPage/CognizantLogo.svg");
        this.addImage('verticleLine',"/icons/svg/login/vertical_separator_bar.svg")
    }


    public addPathIconRegistry() {
        this.imageMap.forEach((value: string, key: string) => {
            console.log(key, value);
            this.iconRegistry.addSvgIcon(key, value);
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