﻿import { Component, Input, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { CONFIG } from '../../config';

import { ImageService } from '../../services/image.service';
import { LoggerService } from '../../services/logger.service';
import { ProcessMessageService } from '../../services/processmessage.service';
import { Image } from '../../helpers/classes';


@Component({
    selector: 'css-carousel',   
    templateUrl: './carousel.component.html',
    styleUrls: ['../../../assets/css/carousel.component.css'],
    providers: [ImageService]
})

export class CSSCarouselComponent implements OnInit {
  
  public allImages: Image[] = [];
  public tradeImages: Image[] = []; 
  public cariouselId: string = "myCarousel";
  public leftRight: string = "#myCarousel";

  private isVisible: boolean = true;
  private image1Url: string;
  private image2Url: string;
  private image3Url: string;
  private image1Title: string;
  private image2Title: string;
  private image3Titlel: string;

    @Input() tradeId: number;

    constructor(private  imageService: ImageService,
                     private  loggerService: LoggerService,
                     private  messagesService: ProcessMessageService) {            
             
  }  

  public ngOnInit() {
    this.getImages();  
  }
    
    // gets the images data from the local json file
    public getImages() {

      this.imageService.getImages()
            .subscribe(
                  (images: Image[]) => this.getImagesById(this.tradeId, images)
                 ,(error:any) => this.onError(error));
    }

    //**************************************************************
    // PRIVATE METHODS ARTICLES
    //**************************************************************
  public getImagesById(passedId, passedImages) {

        this.cariouselId = this.cariouselId + String( passedId );
        this.leftRight = this.leftRight + String( passedId );


        for (let x = 0; x < passedImages.length-1; x++) {
            if (+passedImages[x].tradeId === passedId) { 
                      this.tradeImages.push(passedImages[x]);
              }
         }    
  }

  // on error of http call
  private onError(err: any) {
    // toggle visibility when error is raised
    this.isVisible = false;   

    // we will log the error in the server side by calling the logger, or that is already 
    // done on the server side if the error has been caught
    this.loggerService.logErrors(err, "carousel control");

    // we will display a fiendly process message using the process message service             
    this.messagesService.emitProcessMessage("PMGI");       
    
  }
}

