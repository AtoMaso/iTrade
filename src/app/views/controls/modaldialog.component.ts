﻿import { Component, Host, Input } from '@angular/core';

@Component({
  selector: 'modal-dialog',
  templateUrl: './modaldialog.component.html'
})

export class ModalDialogComponent {
      
      constructor( ) { }

      private modalMessage: string;
      public modalIsVisible: boolean;      

      public showModalDialog(msg: string) {     
          this.modalMessage = msg;
          this.modalIsVisible = true;
      }


      public closeSession() {        
        this.modalIsVisible = false;      
      }
}
