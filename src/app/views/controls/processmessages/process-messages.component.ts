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
  private errorMessage: string;

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
          this.style = "container panel panel-default col-md-10 col-md-offset-1";
          this.stylespan = "messagespan;"
          this.getControlStyle(message.messageTypeDescription);
           this.errorMessage = this.getThePrefix(message.messageTypeDescription)  + message.messageText ;           
      }
    }
    catch (error) {
      // Display friendly client message in case the error message can not be displayed          
      this.getControlStyle("error");
      this.errorMessage = this.getThePrefix("error") + "An error has occured. Please contact the application administration.";
    }
  }


  private getThePrefix(type: string): string {    
         switch (type) {
          case "error":
              return "ERROR: ";            
          case "warning":
              return "WARNING: ";  
          case "information":
              return "INFORMATION: ";  
          case "success":
              return "SUCCESS: ";  
      }
  }


  // gets the style of the control depending on the type of the message
  public getControlStyle(type: string) {  
    switch (type) {
      case "error":
            this.style = this.style + " redbackground";          
            this.stylespan = this.stylespan + " textwhite";
        break;
        case "warning":
            this.style = this.style + " okerbackground";      
            this.stylespan = this.stylespan + " textwhite";
            break;
        case "information":
            this.style = this.style + " yellowbackground";      
            this.stylespan = this.stylespan + " textblack";
            break;    
        case "success":
            this.style = this.style + " greenbackground";     
            this.stylespan = this.stylespan + " textwhite"; 
            break;      
          }
  }

}

