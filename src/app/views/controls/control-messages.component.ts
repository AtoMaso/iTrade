import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'control-messages',
  template: `<div *ngIf="errorMessage !== null" class='text-denger'>
                      <span class="messagespan">{{errorMessage}}</span>
                </div>`
})

export class ControlMessages  {

  //errorMessage: string;
  @Input() control: FormControl;

  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {
          if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
            return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
          }
    }

    return null;
  }
}

