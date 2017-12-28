//import { Component, Host } from '@angular/core';
//import { ValidationService } from '../../services/validation.service';
//import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';


//@Component({
//  selector: 'control-messages',
//  inputs: ['controlName: control'],
//  template: `<div *ngIf="errorMessage !== null">{{errorMessage}}</div>`
//})

//export class ControlMessages {
//  controlName: string;
//  // this is the host where this message control is used
//  constructor( @Host() private _formGroup: FormGroup) { }

//  get errorMessage() {
//    // Find the control in the Host (Parent) form
//    let c = this._formGroup.get(this.controlName);

//    for (let propertyName in c.errors) {
//      // If control has a error
//      if (c.errors.hasOwnProperty(propertyName) && c.touched) {
//        // Return the appropriate error message from the Validation Service
//        return ValidationService.getValidatorErrorMessage(propertyName);
//      }
//    }

//    return null;
//  }
//}




import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationService } from '../../services/validation.service';

@Component({
  selector: 'control-messages',
  template: `<div *ngIf="theErrorMessage !== null" class='text-denger'>{{theErrorMessage}}</div>`
})
export class ControlMessages {

  theErrorMessage: string;
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

