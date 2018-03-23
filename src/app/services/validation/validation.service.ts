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
      'invalidUsername': 'Invalid username. Username must be 5 alphanumeric characters long. ',

      'invalidTradeName': 'Name should be 3-20 characters. ',
      'invalidTradeDescription': 'Description can be 10-200 characters. ',
      'invalidTradeTradeFor': 'Trading for name can be 3-20 characters. ',
      'invalidCategory': 'You must select a category. ',
      'invalidSubcategory': 'You must select a subcategory. ',
      'invalidState': 'You must select a state. ',
      'invalidPlace': 'You must select a place. ',   
      'invalidDatePublished': 'Published date can not be in the past. ',
      'invalidPostCode': 'You must select postcode.',
  
      'invalidPhone': 'Numeric 7-10 digits. ',

      'invalidPreferredFlag': 'The preferred flag must be selected',
      'invalidAddressType': 'The address type must be selected',
      'invalidNumber': 'Must be a numerical value.',
      'invalidUnit': 'Must be a numerical value.',
      'invalidStreet': 'The street name longer than 30 char.',
      'invalidSuburb': 'The suburb name longer than 30 char.',

      'invalidFirstName': 'Your first name maximum lenght of 15 characters. ',
      'invalidMiddleName': 'Your middle name maximum lenght of 15 characters. ',
      'invalidLastName': 'Your last name maximum lenght of 20 characters. ',
      'invalidDate': 'Date must be selected.',

      'invalidCityCode': 'Numeric 2 to 4 digits!',
      'invalidCountryCode': 'Numeric 3 to 5 digits!',
      'invalidPhoneType': 'Must be selected!',

      'invalidEmailType': 'Must be selected!',
      'invalidSocialType': 'Must be selected!',

      'invalidMessage': 'The subject must 5 to 70 characters in length!',
      'invalidContent': 'The content must be 10 to 500 characters in length!',
    };
    return config[validatorName];
  }

 /**************************************************/
 //trade list view and add trade view validation 
/**************************************************/ 
  static tradeNameValidator(control) {
    // {10}-Assert trade name can be up to is 10 characters
    if (control.value) {
      if (control.value.match(/^([a-zA-Z\s]){3,20}$/)) {
        return null;
      } else {
        return { 'invalidTradeName': true };
      }
    }
  }

  static tradeDescriptionValidator(control) {
    // {10}-Assert trade description can be up to 200 characters
    if (control.value) {
      if (control.value.match(/^([a-zA-Z\s]){10,200}$/)) {
        return null;
      } else {
        return { 'invalidTradeDescription': true };
      }
    }
  }

  static tradeForValidator(control) {
    // {10}-Assert trade for name can be up to 10 characters
    if (control.value) {
      if (control.value.match(/^([a-zA-Z\s]){3,20}$/)) {
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
        let now = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        now = moment().toDate();
        now.setDate(now.getDate() -1 );

         if(moment(now).isBefore(moment(control.value.jsdate)) ) {
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
 
    if (control.value.categoryDescription  !== "") {
      return null;
    }
    else {
      return { 'invalidCategory': true };
    }
  }
  }

  static subcategoryValidator(control) {

    // {10}-Assert date can no be in the past
    if (control.value) {

      if (control.value.subcategoryDescription !== "") {
        return null;
      }
      else {
        return { 'invalidSubcategory': true };
      }
    }
  }

  static stateValidator(control) {

    // {10}-Assert date can no be in the past
    if (control.value) {

      if (control.value.name !== "") {
        return null;
      }
      else {
        return { 'invalidState': true };
      }
    }
  }

  static placeValidator(control) {

    // {10}-Assert date can no be in the past
    if (control.value) {

      if (control.value.name !== "") {
        return null;
      }
      else {
        return { 'invalidPlace': true };
      }
    }
  }

  static postcodeValidator(control: any) {

        // postcode must be selected
    if (control.value) {

      if (control.value.number !== "") {
        return null;
      }
      else {
        return { 'invalidPostcode': true };
      }
    }
  }
  


 /**************************************************/
 // login and register views validations plust personal details
/**************************************************/
  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/) ) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

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

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 10 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,10}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

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

  static dateValidator(control) {

    // {10}-Assert date can no be in the past
    if (control.value) {
      //let today = new Date()
      //let now = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      //now = moment().toDate();
      //now.setDate(now.getDate() - 1);
      //if (moment(now).isBefore(moment(control.value.jsdate))) {\
      if (control.value != null) {
        return null;
      }
      else {
        return { 'invalidDate': true };
      }
    }
  }



  //********************************************************
  // address details validations
  //********************************************************
  static preferredValidator(control) {

    if (control.value) {
      if (control.value.number !== "") {
        return null;
      }
      else {
        return { 'invalidPreferredFlag': true };
      }
    }
  }


  static addresstypeValidator(control) {
    if (control.value) {
      if (control.value.number !== "") {
        return null;
      }
      else {
        return { 'invalidAddressType': true };
      }
    }
  }


  static streetValidator(control) {
    
    if (control.value) {
      if (control.value.match(/^([a-zA-Z\s]){3,30}$/)) {
        return null;
      } else {
        return { 'invalidStreet': true };
      }
    }
  }

  static suburbValidator(control) {

    if (control.value) {
      if (control.value.match(/^([a-zA-Z\s]){3,30}$/)) {
        return null;
      } else {
        return { 'invalidSuburb': true };
      }
    }
  }

  static numberValidator(control) {

    if (control.value) {
      if (control.value.match(/^([0-9]){1,5}$/)) {
        return null;
      } else {
        return { 'invalidNumber': true };
      }
    }
  }

  static unitValidator(control) {

    if (control.value) {
      if (control.value.match(/^([0-9]){1,5}$/)) {
        return null;
      } else {
        return { 'invalidUnit': true };
      }
    }
  }


  //*******************************************************
  //  PHONES
  //*******************************************************
  // GOOD
  static phoneValidator(control: any) {
    // {1-10}-Assert phone is numeric only
    if (control.value) {
      if (control.value.match(/^([0-9]){7,10}$/)) {
        return null;
      } else {
        return { 'invalidPhone': true };
      }
    }
  }

  static citycodeValidator(control) {

    if (control.value) {
      if (control.value.match(/^([0-9]){2,4}$/)) {
        return null;
      } else {
        return { 'invalidCityCode': true };
      }
    }
  }

  static countrycodeValidator(control) {

    if (control.value) {
      if (control.value.match(/^([0-9]){3,5}$/)) {
        return null;
      } else {
        return { 'invalidCountryCode': true };
      }
    }
  }


  static phonetypeValidator(control) {
    if (control.value) {
      if (control.value.number !== "") {
        return null;
      }
      else {
        return { 'invalidPhoneType': true };
      }
    }
  }



  //*******************************************************
  //  EMAILS
  //*******************************************************
  static emailtypeValidator(control) {
    if (control.value) {
      if (control.value.number !== "") {
        return null;
      }
      else {
        return { 'invalidEmailType': true };
      }
    }
  }


  //*******************************************************
  //  EMAILS
  //*******************************************************
  static socialtypeValidator(control) {
    if (control.value) {
      if (control.value.number !== "") {
        return null;
      }
      else {
        return { 'invalidSocialType': true };
      }
    }
  }

  
  static messageValidator(control) {

    if (control.value) {
      if (control.value.match(/^([\\\-\0-9a-zA-Z\s\`\?\<\>\/\:\;\"\'\[\]\{\}\.\,\@\!\~\#\$\%\^\&\*\(\)\_\+\=\|]){10,500}$/)) {
        return null;
      } else {
        return { 'invalidMessage': true };
      }
    }
  }

  static contentValidator(control) {

    if (control.value) {
      if (control.value.match(/^([\\\-\0-9a-zA-Z\s\`\?\<\>\/\:\;\"\'\[\]\{\}\.\,\@\!\~\#\$\%\^\&\*\(\)\_\+\=\|]){10,500}$/)) {
        return null;
      } else {
        return { 'invalidContent': true };
      }
    }
  }


  //********************************************************
  // extra ones
  //********************************************************
  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }

}
