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

  public imageOne: Image = new Image();
  public imageTwo: Image = new Image();
  public imageThree: Image = new Image();

  private isVisible: boolean = true;
  private hasImages: boolean = false;
  private tradeImages: Image[];

  @Input() tradeId: number;
  //@Input() tradeImages: Image[];
  @Output() onErrorPicked: EventEmitter<any> = new EventEmitter<any>();

    constructor(private  imageService: ImageService,
                     private  loggerService: LoggerService,
                     private  messagesService: ProcessMessageService) {  }  


  public ngOnInit() {
    // dashbord parent is passing the image of the trade
    // so the following method is not needed, but we keep it if we needed later
    this.getImagesByTradeId(this.tradeId)  
    // but we still need to get crousel ids 
    this.getCrouselIds(this.tradeId);
  }

  //**************************************************************
  // GET IMAGES  
  //**************************************************************
  public getImagesByTradeId(id:number): void {

    try {
      this.imageService.getImagesByTradeId(id).
            subscribe((images: Image[]) => {
              this.tradeImages = images;    
              this.getCrouselIds(id);
              if (images !== null) { this.hasImages = true;}
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


  
  private onError(serviceError: any, operation: string) {

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    if (serviceError.error.ModelState !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else { this.messagesService.emitProcessMessage("PMGTs"); }

  }

}
