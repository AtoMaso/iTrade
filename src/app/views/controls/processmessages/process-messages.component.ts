import { Component, Input} from '@angular/core';
import { ProcessMessage } from '../../../helpers/classes';


@Component({
  selector: 'process-messages',
  template: ` 
                    <div *ngIf="errorMessage" [class] = "style">                    
                      <span [class]= "stylespan"> {{ errorMessage }}</span>
                    </div>
               `      
})


export class ProcessMessagesComponent {

  public style: string;
  public stylespan = "messagespan;"
  public errorMessage: string;

  // this is the host where this message control is used
  constructor() {}


  // display the message text 
  public displayProcessMessage(message: ProcessMessage) {
    try {
      if (message === null)
      {
        this.errorMessage = null;
      }
      else {                 
          this.style = "container panel panel-default col-md-12";
          this.stylespan = "messagespan "
          this.getControlStyle(message.messageType);
           this.errorMessage = this.getThePrefix(message.messageType)  + message.messageText ;           
      }
    }
    catch (error) {
      // Display friendly client message in case the error message can not be displayed          
      this.getControlStyle("Error");
      this.errorMessage = this.getThePrefix("Error") + "An error has occured. Please contact the application administration.";
    }
  }


  public getThePrefix(type: string): string {    
         switch (type) {
          case "Error":
              return "ERROR: ";            
          case "Warning":
              return "WARNING: ";  
          case "Information":
              return "INFORMATION: ";  
          case "Success":
              return "SUCCESS: ";  
      }
  }


  // gets the style of the control depending on the type of the message
  public getControlStyle(type: string) {  
    switch (type) {
      case "Error":
            this.style = this.style + " redbackground";          
            this.stylespan = this.stylespan + " textwhite";
        break;
        case "Warning":
            this.style = this.style + " okerbackground";      
            this.stylespan = this.stylespan + " textwhite";
            break;
        case "Information":
            this.style = this.style + " yellowbackground";      
            this.stylespan = this.stylespan + " textblack";
            break;    
        case "Success":
            this.style = this.style + " greenbackground";     
            this.stylespan = this.stylespan + " textwhite"; 
            break;      
          }
  }

}

