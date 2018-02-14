import { Inject, Injectable, EventEmitter } from '@angular/core';
import { Http, Response } from '@angular/http';
import * as moment from 'moment';

@Injectable()
export class ValidationService {


  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'Required',
      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid pattern in your email address.',
      'invalidEmailDomain': 'Invalid domain in your email address',     
      'invalidPassword': 'Invalid password. Password must be between 6 and 10 characters long, and should contain min one number.',
      'invalidConfirmPassword': 'Invalid confirm password. Password must be between 6 and 10 characters long, and contains a number.',
      'invalidFirstName': 'Invalid name. Your first name should contain only alphabetical characters with maximum lenght of 15 characters. ',
      'invalidMiddleName': 'Invalid name. Your middle name should contain only alphabetical characters with maximum lenght of 15 characters. ',
      'invalidLastName': 'Invalid name. Your last name should contain only alphabetical characters with maximum lenght of 50 characters. ',  
      'invalidUsername': 'Invalid username. Username must be 5 alphanumeric characters long. ',
      'invalidPhone': 'Invalid phone. Phone must contain 10 numeric characters. ',
      'invalidTradeName': 'Name should be 3-15 characters. ',
      'invalidTradeDescription': 'Description should be 10-200 characters. ',
      'invalidTradeTradeFor': 'Trade for name should be 3-15 characters. ',
      'invalidCategoty': 'You must select a category. ',
      'invalidDatePublished': 'Published date can not be in the past. ',
    };
    return config[validatorName];
  }

  //static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
  //  let config = {
  //    'required': 'Required',
  //    'invalidCreditCard': 'Is invalid credit card number',
  //    'invalidEmailAddress': 'Invalid email address',
  //    'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number.',
  //    'minlength': `Minimum length ${validatorValue.requiredLength}`
  //  };

  //  return config[validatorName];
  //}

  static tradeNameValidator(control) {
    // {10}-Assert trade name can be up to is 10 characters
    if (control.value) {
      if (control.value.match(/^([a-zA-Z]){3,15}$/)) {
        return null;
      } else {
        return { 'invalidTradeName': true };
      }
    }
  }

  static tradeDescriptionValidator(control) {
    // {10}-Assert trade description can be up to 200 characters
    if (control.value) {
      if (control.value.match(/^([a-zA-Z]){10,200}$/)) {
        return null;
      } else {
        return { 'invalidTradeDescription': true };
      }
    }
  }

  static tradeForValidator(control) {
    // {10}-Assert trade for name can be up to 10 characters
    if (control.value) {
      if (control.value.match(/^([a-zA-Z]){3,15}$/)) {
        return null;
      } else {
        return { 'invalidTradeTradeFor': true };
      }
    }
  }


  static publishDateValidator(control) {

    // {10}-Assert date can no be in the past
    if (control.value)  {
        let today = new Date()
       let now = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())         
      let nowstring: string = moment(now).format('YYYY MM DD');
      let controlstring: string = moment(control.value.date).format('YYYY MM DD');
      if (controlstring > nowstring) {
              return null;
      }
        else {
            return { 'invalidDatePublished': true };
        }
    }
}


  static categoryValidator(control) {

  // {10}-Assert date can no be in the past
  if (control.value) {
 
    if (control.value  !== "Select") {
      return null;
    }
    else {
      return { 'invalidCategoty': true };
    }
  }
}


  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 10 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,10}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

  //// GOOD - TEST IT
  //static creditCardValidator(control:any) {
  //  // Visa, MasterCard, American Express, Diners Club, Discover, JCB
  //  if (control.value) {
  //      if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
  //        return null;
  //      } else {
  //        return { 'invalidCreditCard': true };
  //      }
  //  }
  //}

  //// GOOD
  //static emailValidator(control: any) {
  //  if (control.value) {
  //      // RFC 2822 compliant regex
  //      //if (control.value.match(/^([a-zA-Z0-9!#$%&'*+/=?^_`{|}~-])(\.[a-zA-Z0-9!#$ %&'*+/=?^_`{|}~-])(\@\w+(\.\w{3})(\.\w{2}))$/)) {
  //      if (control.value.match(/^(\w+)(\.\w+)(\@\w+(\.\w{3})(\.\w{2}))$/)) {
  //        return null;
  //      } else {
  //        return { 'invalidEmailAddress': true };
  //      }
  //  }
  //}

  static emailDomainValidator(control: any) {
    if (control.value) {
      // RFC 2822 compliant regex
      if (control.value.match(/^(\w+)(\.\w+)(\@ato.gov.au)$/)) {
        return null;
      } else {
        return { 'invalidEmailDomain': true };
      }
    }
  }


  //// GOOD
  //static passwordValidator(control:any) {
  //  // {6,100}-Assert password is between 6 and 100 characters
  //  // (?=.*[0-9])-Assert a string has at least one number
  //  if (control.value) {
  //      if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,10}$/)) {
  //        return null;
  //      } else {
  //        return { 'invalidPassword': true };
  //      }
  //  }
  //}


  // GOOD
  static confirmPasswordValidator(control: any) {   
      // {6,100}-Assert password is between 6 and 100 characters
      // (?=.*[0-9])-Assert a string has at least one number
      if (control.value) {
          if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,10}$/)) {
              return null;
          } else {
              return { 'invalidConfirmPassword': true };
          }
      }
  }


// GOOD
static phoneValidator(control: any) {
  // {1-10}-Assert phone is numeric only
  if (control.value) {
      if (control.value.match(/^(\d{10})$/)) {
        return null;
      } else {
        return { 'invalidPhone': true };
      }
  }
}

// GOOD
static workpointValidator(control: any) {
  // {3-6}-Assert workpoint is alphanumeric characters and the dot character
  if (control.value) {
      if (control.value.match(/^\d{1,3}(\.\d{1,3})$/)) {
        return null;
      } else {
        return { 'invalidWorkpoint': true };
      }
  }
}

// GOOD
static firstNameValidator(control: any) {
    // Name should be any character set separated with minimum one space
    if (control.value) {
        if (control.value.match(/^(\w{1,15})$/)) {
            return null;
        } else {
            return { 'invalidFirstName': true };
        }
    }
  }

  static middleNameValidator(control: any) {
    // Name should be any character set separated with minimum one space
    if (control.value) {
      if (control.value.match(/^(\w{1,15})$/)) {
        return null;
      } else {
        return { 'invalidMiddletName': true };
      }
    }
  }

  static lastNameValidator(control: any) {
    // Name should be any character set separated with minimum one space
    if (control.value) {
      if (control.value.match(/^(\w{1,20})$/)) {
        return null;
      } else {
        return { 'invalidLastName': true };
      }
    }
  }


}
