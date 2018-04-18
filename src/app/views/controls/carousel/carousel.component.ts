import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { ImageService } from '../../../services/image/image.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { Image } from '../../../helpers/classes';



@Component({
    selector: 'carousel',   
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    providers: [ImageService]
})

export class CarouselComponent implements OnInit {

  public cariouselId: string = "myCarousel";
  public leftRight: string = "#myCarousel";

  public hasImage1: boolean = true;
  public hasImage2: boolean = true;
  public hasImage3: boolean = true;
  public isVisible: boolean = true;
  public hasImages: boolean = false;
  public images: Image[];

  @Input() tradeId: number;
  @Output() onErrorPicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(private  imageService: ImageService,
                     private  loggerService: LoggerService,
                     private  messagesService: ProcessMessageService) {  }  


    public ngOnInit() {
    
    // dashbord parent can pass the images of the trade
    // we are going with the call from the control as it is quiker
    this.getImagesByTradeId(this.tradeId)  
    // but we still need to get crousel ids 
    this.getCrouselIds(this.tradeId);
  }

  //**************************************************************
  // GET IMAGES  - call the image service not passed from the parent
  //**************************************************************
  public getImagesByTradeId(id:number): void {

    try {
      this.imageService.getImagesByTradeId(id).
            subscribe((images: Image[]) => {
              this.images = images;    
              this.handleVisibility();
              this.getCrouselIds(id);
              if (images !== null) { this.hasImages = true;}
           });
    }
    catch (err) {
      this.onError("getImagesApiById method", err);
    }
  }


  // visibility of the images
  public handleVisibility() {
    if (this.images.length == 0) {
      this.hasImages = false;
    }
    else if (this.images.length == 1) {
      this.hasImage2 = false;
      this.hasImage3 = false;
    }
    else if (this.images.length == 2) {
      this.hasImage3 = false;
    }    
  }


  // carousel ids to match the control
  public getCrouselIds(passedId) {
    this.cariouselId = this.cariouselId + String(passedId);
    this.leftRight = this.leftRight + String(passedId);
  }



  //**************************************************************
  // HANDLE ERRORS  
  //**************************************************************  
  public onError(serviceError: any, operation: string) {

    let message: string = "";

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    // PME used to pass the message 
    if (serviceError.error === undefined) {

      var data = serviceError.json();

      if (data.ModelState !== undefined) {

        for (var key in data.ModelState) {
          for (var i = 0; i < data.ModelState[key].length; i++) {

            if (message == null) { message = data.ModelState[key][i]; }
            else { message = message + data.ModelState[key][i]; }
          }
        }
      }
      this.messagesService.emitProcessMessage("PME", message);
    }
    else if (serviceError.error.ModelState !== undefined) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error

  }

}
