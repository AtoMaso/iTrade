import { Component, Host, Input } from '@angular/core';

@Component({
  selector: 'modal-address-component',
  templateUrl: './modal-address.component.html'
})

export class ModalAddressComponent {

  constructor() { }

  private modalMessage: string = "";
  private modalTitle: string = "";
  public modalIsVisible: boolean;

  public showModalDialog(msg: string, title:string) {
    this.modalMessage = msg;
    this.modalTitle = title;
    this.modalIsVisible = true;
  }


  public closeModal) {
    this.modalIsVisible = false;
  }
}
