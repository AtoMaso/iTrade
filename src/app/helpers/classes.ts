import {
  ITraderList, ITraderDetails,
  IPersonalDetails, ISecurityDetails, IContactDetails,
  IAddress, IAddressType,
  IPhone, IPhoneType,
  ISecurityAnswer, ISecurityQuestions,
  ISocialNetwork, ISocialNetworkType,
  IEmail, IEmailType,
  ITrade,
  IImage, IObjectCategory, ITradeObject, ITradeForObject,
  IUserSession, IAuthentication, IUserIdentity,
  IProcessMessage, IPageTitle, IAttachement } from './interfaces';


class Trader implements ITraderList {
  traderId: string;
  traderFirstName: string;
  traderMiddleName: string;
  traderLastName: string;
  traderContactEmail: string;
  traderContactPhone: string;

  constructor() {    
    this.traderId = ""
    this.traderFirstName = "";
    this.traderMiddleName = "";
    this.traderLastName = " ";
    this.traderContactEmail = "";  
    this.traderContactPhone = "";
  }
}


class TraderDetails implements ITraderDetails {
  traderId: string;
  personalDetails: PersonalDetails;
  contactDetails: ContactDetails;
  securityDetails: SecurityDetails;

  constructor() {
    this.traderId = "";
    this.personalDetails = new PersonalDetails();
    this.contactDetails = new ContactDetails();
    this.securityDetails = new SecurityDetails();
  }
}


class PersonalDetails implements IPersonalDetails {

  personalDetailsId: number;
  traderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  addresses: Address[];

  constructor() {
    this.personalDetailsId = 0;
    this.traderId = "";
    this.firstName = "";
    this.lastName = "";
    this.dateOfBirth = new Date(1900, 1, 1);
    this.addresses = [];
  }
}


class ContactDetails implements IContactDetails {

  contactDetailsId: number;
  traderId: string;
  phones: IPhone[];
  socialNetworks: ISocialNetwork[];  

  constructor() {
    this.contactDetailsId = 0;
    this.traderId = "";
    this.phones =  [] ;
    this.socialNetworks = [];
  }
}


class SecurityDetails implements ISecurityDetails {

  securityDetailsId: number;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  securityAnswers: SecurityAnswer [];
  traderId: string;

  constructor() {
    this.securityDetailsId = 0;   
    this.userName = "";
    this.email = "";
    this.password = "";   
    this.confirmPassword = "";
    this.securityAnswers = [];
    this.traderId = "";
  }
}


class Address implements IAddress {

  addressId: number;
  traderId: number;
  addressNumber: number;
  addressStreet: string;
  addressSuburb: string;
  addressPostcode: number;
  addressCity: string;
  addressState: string;
  addressCountry: string;
  addressTypeId: number;
  addressTypeDescription: string
  personalDetailsId: number;

  constructor() {
    this.addressId = 0;
    this.addressNumber = 0;
    this.addressStreet = "";
    this.addressSuburb = "";
    this.addressCity = "";
    this.addressPostcode = 0;
    this.addressState = "";
    this.addressCountry = "";
    this.addressTypeId = 0;
    this.addressTypeDescription = "";
    this.personalDetailsId = 0;
  }
}


class AddressType implements IAddressType {
  addressTypeId: number;
  addressTypeDescription: string;

  constructor() {
    this.addressTypeId = 0;
    this.addressTypeDescription = "";
  }
}


class Phone implements IPhone {

  phoneId: number; 
  phoneNumber: number;
  phoneCityCode: string;
  phoneCountryCode: string;
  phoneTypeId: number;
  phoneTypeDescription: string;
  contactDetailsId: number;

  constructor() {
    this.phoneId = 0;
    this.phoneNumber = 0;
    this.phoneCityCode = "";
    this.phoneCountryCode = "";
    this.phoneTypeId = 0;
    this.phoneTypeDescription = "";
    this.contactDetailsId = 0;
  }

}


class PhoneType implements IPhoneType {
  phoneTypeId: number;
  phoneType: string;

  constructor() {
    this.phoneTypeId = 0;
    this.phoneType = "";
  }
}


class SocialNetwork implements ISocialNetwork {
  socialNetworkId: number;
  socialNetworkAccount: string; 
  socialNetworkTypId: number;
  socialNetworkTypeText: string;
  contactDetailsId: number;

  constructor() {
    this.socialNetworkId = 0;
    this.socialNetworkAccount = "";
    this.socialNetworkTypId = 0;
    this.socialNetworkTypeText = "";
  }
}


class SocialNetworkType implements ISocialNetworkType {
  socialNetworkTypeId: number;
  socialNetworkTypeText: string;

  constructor() {
    this.socialNetworkTypeId = 0;
    this.socialNetworkTypeText = "";
  }
}


class SecurityAnswer implements ISecurityAnswer {
  answerId: number;
  questionId: number;
  questionText: string;
  questionAnswer: string;
  securityDetailsId: number;

  constructor() {
    this.answerId = 0;
    this.questionAnswer = "";
    this.questionId = 0;
    this.questionText = "";
    this.securityDetailsId = 0;
  }
  
}


class SecurityQuestion implements ISecurityQuestions {
  questionId: number;
  questionText: string;

  constructor() {
    this.questionId = 0;
    this.questionText = "";
  }

}


class Email implements IEmail {
  emailId: number;
  emailTypeid: number;
  emailType: string;
  emailAccount: string;
  contactDetailsId: number;

  constructor() {
    this.emailId = 0;
    this.emailType = "";
    this.emailAccount = "";
    this.emailTypeid = 0;
    this.contactDetailsId = 0;
  }
}



class EmailType implements IEmailType {
  emailTypeId: number;
  emailTypeDescription: string;

  constructor() {
    this.emailTypeId = 0;
    this.emailTypeDescription = "";
  }
}






class Trade implements ITrade {

  tradeId: number; 
  tradeDatePublished: Date;

  traderId: string;
  traderFirstName: string;
  traderMiddleName: string;
  traderLastName: string;
  traderFullName: string;

  tradeObjects: TradeObject[];
  tradeForObjects: TradeForObject[];
  images: Image[];

  tradeObjectDescription: string;
  tradeObjectCategoryDescription: string;
  tradeForObjectsDescription: string;

  constructor() {    
    this.tradeId = 0;  
    this.tradeDatePublished = new Date(1900, 1, 1); 

    this.traderId = "";
    this.traderFirstName = "";   
    this.traderMiddleName = "";
    this.traderLastName = ""

    this.tradeObjects = [];
    this.tradeForObjects = [];
    this.images = [];


    this.tradeObjectDescription = ""; 
    this.tradeObjectCategoryDescription = "";
    this.tradeForObjectsDescription = "";
  }
}

class Image implements IImage {
  imageId: number;
  imageTitle: string;
  imageUrl: string;
  tradeId: number;

  constructor() {
    this.imageId = 0;
    this.tradeId = 0;
    this.imageTitle = "";
    this.imageUrl = "";
  }
}


class TradeObject implements ITradeObject {

  tradeObjectId: number;
  tradeObjectDescription: string;
  objectCategoryId: number;
  tradeObjectCategoryDescription: string;
  tradeId: number;

  constructor() {
    this.tradeObjectId = 0;
    this.tradeObjectDescription = "";
    this.objectCategoryId = 0;
    this.tradeObjectCategoryDescription = "";
  } 
}


class TradeForObject implements ITradeForObject {

  tradeForObjectId: number;
  tradeForObjectDescription: string;
  objectCategoryId: number;
  tradeForObjectCategoryDescription: string;
  tradeId: number;

  constructor() {
    this.tradeForObjectId = 0;
    this.tradeForObjectDescription = "";
    this.objectCategoryId = 0;
    this.tradeForObjectCategoryDescription = "";
  }

}


class ObjectCategory {
  objectCategoryId: number;
  objectCategoryDescription: string;

  constructor() {
    this.objectCategoryId = 0;
    this.objectCategoryDescription = "";
  }
}




class UserSession implements IUserSession {
  authentication: Authentication ;
  userIdentity: UserIdentity;
  sessionCookie: string;

  constructor() {
    this.authentication = new Authentication();
    this.userIdentity = new UserIdentity();
    this.sessionCookie = "";
  }

}

class Authentication implements IAuthentication {     
  isAuthenticated: boolean;
  authenticationType: string;

      constructor() {
              this.isAuthenticated = false;
              this.authenticationType = "anonimous";
      } 
}

class UserIdentity implements IUserIdentity {
  accessToken: any;
  refreshToken: any;
  accessTokenType: string;
  accessTokenExpiresDate: Date;
  accessTokenExpiresIn: number;
  userName: string;
  name: string;
  userId: string;
  roles: string[];

  constructor() {
          this.accessToken = "";
          this.refreshToken = "";
          this.accessTokenType = "";
          this.accessTokenExpiresDate = new Date();
          this.accessTokenExpiresIn = 0;
          this.userName = "";
          this.userId = "";
          this.roles = [];
  }

  public isInRole(rolename: string, roles: string[]): boolean {
    return true;
  }
}

class ProcessMessage implements IProcessMessage {
  messageId: number;
  messageCode: string;
  messageType: string;
  messageText: string;

  constructor() {
    this.messageId = 0;
    this.messageCode = "Undefined";
    this.messageType = "Undefined";
    this.messageText = "Undefined";
  }
}

class PageTitle implements IPageTitle {
  title: string;
  value: string;

  constructor(pagetitle) {
    this.title = pagetitle;
  }
}

class Attachement implements IAttachement {

  attachementId: number;
  tradeId: number;
  physicalPath: string;
  name: string;

  constructor() {
    this.attachementId = 0;
    this.tradeId = 0;
    this.name = "";
    this.physicalPath = " ";
  }
}

class Guid {
  static newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}



export {
  Trader, TraderDetails,
   PersonalDetails, ContactDetails, SecurityDetails,
  Address, AddressType, Phone, PhoneType,
  SocialNetwork, SocialNetworkType,
  SecurityAnswer, SecurityQuestion,
  Trade, Image, ObjectCategory,
  UserSession, Authentication, UserIdentity,
  ProcessMessage, PageTitle, Attachement
};
