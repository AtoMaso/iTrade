import { Component, Host } from '@angular/core';
import { NgForm, NgModel, } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'control-messages',
  inputs: ['controlName: control'],
  template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
})

export class ControlMessages {
  controlName: string;
  // this is the host where this message control is used
  constructor( @Host() private _formGroup: FormGroup) { }

  get errorMessage() {
    // Find the control in the Host (Parent) form
    let c = this._formGroup.get(this.controlName);

    for (let propertyName in c.errors) {
      // If control has a error
      if (c.errors.hasOwnProperty(propertyName) && c.touched) {
        // Return the appropriate error message from the Validation Service
        return ValidationService.getValidatorErrorMessage(propertyName);
      }
    }

    return null;
  }
}

