﻿import { Component, Host, Input } from '@angular/core';

@Component({
  selector: 'modal-component',
  templateUrl: './modal.component.html'
})

export class ModalComponent {
      
      constructor( ) { }

      public modalMessage: string;
      public modalIsVisible: boolean;      

      public showModalDialog(msg: string) {     
          this.modalMessage = msg;
          this.modalIsVisible = true;
      }


      public closeModal() {        
        this.modalIsVisible = false;      
      }
}
