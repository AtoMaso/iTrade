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

  //public tradeImages: Image[] = []; 
  public cariouselId: string = "myCarousel";
  public leftRight: string = "#myCarousel";

  public imageOne: Image = new Image();
  public imageTwo: Image = new Image();
  public imageThree: Image = new Image();

  private isVisible: boolean = true;
  private haveImages: boolean = true;

  @Input() tradeId: number;
  @Input() tradeImages: Image[];
  @Output() onErrorPicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(private  imageService: ImageService,
                     private  loggerService: LoggerService,
                     private  messagesService: ProcessMessageService) {  }  


  public ngOnInit() {
    // dashbord parent is passing the image of the trade
    // so the following method is not needed, but we keep it if we needed later
    // this.getImagesApiByTradeId(this.tradeId)  
    // but we still need to get crousel ids 
    this.getCrouselIds(this.tradeId);
  }

  //**************************************************************
  // GET IMAGES METHODS 
  //**************************************************************
  public getImagesApiByTradeId(id:number): void {

    try {
      this.imageService.getImagesApiByTradeId(id).
            subscribe((images: Image[]) => {
              this.tradeImages = images;    
              this.getCrouselIds(id);
           });
    }
    catch (err) {
      this.onError("getImagesApiById method", err);
    }
  }


  public getCrouselIds(passedId) {
    this.cariouselId = this.cariouselId + String(passedId);
    this.leftRight = this.leftRight + String(passedId);
  }


  
  //**************************************************************
  // PRIVATE METHODS ARTICLES
  //**************************************************************
  //@param operation - name of the operation that failed
  //@param result - optional value to return as the observable result
  private onError(operation, err: HttpErrorResponse) {

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
