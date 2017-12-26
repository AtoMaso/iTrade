import { Component, Host, Input } from '@angular/core';
import { NgForm, NgModel} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'modal-dialog',
  inputs: ['controlName: control'],
  templateUrl: './modaldialog.component.html'
})

export class ModalDialog {
     // the host is passed as a input partameter, also check the app component html where 
     // the host app component is passed as [app] = "itself"
      @Input() app: AppComponent;

      constructor( ) { }

      private modalMessage: string;
      public modalIsVisible: boolean;


      public showModalDialog(msg: string) {     
          this.modalMessage = msg;
          this.modalIsVisible = true;
      }


      public closeSession() {        
        this.modalIsVisible = false;
        this.app.onCloseSession();   
      }
}
