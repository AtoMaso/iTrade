import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null" class='text-denger'>{{errorMessage}}</div>`
})

export class ControlMessages implements OnInit {

  errorMessage: string;
  @Input() control: FormControl;

  constructor() { }

  ngOnInit() {
    //this.errorMessage = this.geterrorMessage();
  }


  get errorMessage() {
    for (let propertyName in this.control.errors) {
          if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
            return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
          }
    }

    return null;
  }
}

