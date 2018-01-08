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

  private haveImages: boolean = true;

  @Input() tradeId: number;
  @Output() onErrorPicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(private  imageService: ImageService,
                     private  loggerService: LoggerService,
                     private  messagesService: ProcessMessageService) {            
             
  }  


  public ngOnInit() {
    
    //this.getImagesLocally();
    //this.getImagesApi();  
    this.getImagesApiByTradeId(this.tradeId)
  }



  //**************************************************************
  // GET IMAGES METHODS 
  //**************************************************************
  // gets the images data from the local json file
  public getImagesApi():void {

      try {     
        this.imageService.getImagesApi().subscribe((images: Image[]) => { this.getImagesByTradeId(images, this.tradeId) });
      }
      catch (err) {
        this.handleError("getImages method", err);
      }
  }


  public getImagesApiByTradeId(id:number): void {

    try {
      this.imageService.getImagesApiByTradeId(id).
            subscribe((images: Image[]) => {
              this.tradeImages = images;
              this.getImagesLength(images);
              this.getCrouselIds(this.tradeId);
           });
    }
    catch (err) {
      this.handleError("getImagesApiById method", err);
    }
  }



  public getImagesByTradeId(passedImages, passedId) {

    this.getCrouselIds(passedId);

    for (let x = 0; x < passedImages.length - 1; x++) {
      if (+passedImages[x].tradeId === passedId) {
        this.tradeImages.push(passedImages[x]);
      }
    }
  }

  public getCrouselIds(passedId) {
    this.cariouselId = this.cariouselId + String(passedId);
    this.leftRight = this.leftRight + String(passedId);
  }

  public getImagesLength(images) {

  }


  
  //**************************************************************
  // PRIVATE METHODS ARTICLES
  //**************************************************************
  //@param operation - name of the operation that failed
  //@param result - optional value to return as the observable result
  private handleError(operation, err: HttpErrorResponse) {

    this.haveImages = false;

       // write a message to the console
      console.log(`Backend returned code in getImagesApiByTradeId method in carousel component method calling the image service!, ${operation} failed: ${err.status},  the URL: ${err.url}, was:  ${err.statusText}`); 
  
      //// audit log the error on the server side
      this.loggerService.addError(err, `${operation} failed: ${err.status},  the URL: ${err.url}, was:  ${err.statusText}`);
  
    // this is emiting the isRequesting value for the parent dashboard component child spinner component
    this.onErrorPicked.emit(false);

    // images can not be retrieved, so friendly message to be displayed
    this.messagesService.emitProcessMessage("PMGI");
  }
}
