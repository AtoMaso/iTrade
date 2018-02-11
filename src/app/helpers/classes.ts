﻿import {
  IChangePasswordBindingModel, IRegisterBindingModel, ISetPasswordBindingModel, ILoginModel,
  ITraderList, ITraderDetails,
  IPersonalDetails, ISecurityDetails, IContactDetails,
  IAddress, IAddressType,
  IPhone, IPhoneType,
  ISecurityAnswer, ISecurityQuestions,
  ISocialNetwork, ISocialNetworkType,
  IEmail, IEmailType, ICorrespondence,
  ITrade, IImage, ICategory, ITradeHistory, 
  ITradeObject, ITradeForObject,  
  IUserSession, IAuthentication, IUserIdentity,
  IProcessMessage, IProcessMessageType,
  IPageTitle, IAttachement
} from './interfaces';




class LoginModel implements ILoginModel{
  Email: string;
  UserName: string;
  Password: string;

  constructor() {
    this.Email = "";
    this.Password = "";
    this.UserName = "";
  }
}


class ChangePasswordBindingModel implements  IChangePasswordBindingModel {
  OldPassword: string;
  NewPassword: string;
  ConfirmPassword

  constructor() {
    this.OldPassword = "";
    this.NewPassword = "";
    this.ConfirmPassword = "";
  }
}


class RegisterBindingModel implements  IRegisterBindingModel {
  Email: string;
  Role: string;
  Password: string;
  ConfirmPassword: string

  constructor() {
    this.Email = "";
    this.Password = "";
    this.ConfirmPassword = "";
  }
}


class SetPasswordBindingModel implements ISetPasswordBindingModel {
  NewPassword: string;
  ConfirmPassword: string;

  constructor() {
    this.NewPassword = "";
    this.ConfirmPassword = "";
  }
}


class Trader implements ITraderList {
  traderId: string;
  traderFirstName: string;
  traderMiddleName: string;
  traderLastName: string;
  traderContactEmail: string;
  traderContactPhone: string;
  traderSocialNetwork: string;

  constructor() {    
    this.traderId = ""
    this.traderFirstName = "";
    this.traderMiddleName = "";
    this.traderLastName = " ";
    this.traderContactEmail = "";  
    this.traderContactPhone = "";
    this.traderSocialNetwork = "";
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
  preferredAddress: Address;

  constructor() {
    this.personalDetailsId = 0;
    this.traderId = "";
    this.firstName = "";
    this.lastName = "";
    this.dateOfBirth = new Date(1900, 1, 1);
    this.addresses = [];
    this.preferredAddress = new Address();
  }
}


class ContactDetails implements IContactDetails {

  contactDetailsId: number;
  traderId: string;  
  phones: Phone[];
  preferredPhone: Phone;
  emails: Email[];
  preferredEmail: Email;
  socialNetworks: SocialNetwork[];  
  preferredSocialNetwork: SocialNetwork;

  constructor() {
    this.contactDetailsId = 0;
    this.traderId = "";  
    this.phones = [];
    this.preferredPhone = new Phone();
    this.emails = [];
    this.preferredEmail = new Email();
    this.socialNetworks = [];
    this.preferredSocialNetwork = new SocialNetwork();
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

  id: number;
  traderId: number;
  number: number;
  street: string;
  suburb: string;
  postcode: number;
  city: string;
  state: string;
  country: string;
  preferred: string;
  typeId: number;
  typeDescription: string
  personalDetailsId: number;

  constructor() {
    this.id = 0;
    this.number = 0;
    this.street = "";
    this.suburb = "";
    this.city = "";
    this.postcode = 0;
    this.state = "";
    this.country = "";
    this.preferred = "";
    this.typeId = 0;
    this.typeDescription = "";
    this.personalDetailsId = 0;
  }
}


class AddressType implements IAddressType {
  typeId: number;
  typeDescription: string;

  constructor() {
    this.typeId = 0;
    this.typeDescription = "";
  }
}


class Phone implements IPhone {

  id: number; 
  number: string;
  cityCode: string;
  countryCode: string;
  preferred: string;
  typeId: number;
  typeDescription: string;
  contactDetailsId: number;

  constructor() {
    this.id = 0;
    this.number = "";
    this.cityCode = "";
    this.countryCode = "";
    this.preferred = "";
    this.typeId = 0;
    this.typeDescription = "";
    this.contactDetailsId = 0;
  }

}


class PhoneType implements IPhoneType {
  typeId: number;
  typeDescription: string;

  constructor() {
    this.typeId = 0;
    this.typeDescription = "";
  }
}


class SocialNetwork implements ISocialNetwork {
  id: number;
  account: string; 
  preferred: string;
  typId: number;
  typeDescription: string;
  contactDetailsId: number;

  constructor() {
    this.id = 0;
    this.account = "";
    this.preferred = "";
    this.typId = 0;
    this.typeDescription = "";
    this.contactDetailsId = 0;
  }
}


class SocialNetworkType implements ISocialNetworkType {
  typeId: number;
  typeDescription: string;

  constructor() {
    this.typeId = 0;
    this.typeDescription = "";
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
  id: number;
  account: string;
  preferred: string;
  typeId: number;
  typeDescription: string; 
  contactDetailsId: number;

  constructor() {
    this.id = 0;
    this.account = "";
    this.preferred = ""
    this.typeId = 0;
    this.typeDescription = "";
    this.contactDetailsId = 0;
  }
}



class EmailType implements IEmailType {
  typeId: number;
  typeDescription: string;

  constructor() {
    this.typeId = 0;
    this.typeDescription = "";
  }
}






class Trade implements ITrade {

  total: number;
  tradeIdStr: string;
  tradeId: number; 
  name: string;
  description: string;
  tradeFor: string;
  datePublished: Date;
  status: string;
  categoryId: number;
  categoryDescription: string;

  traderId: string;
  traderFirstName: string;
  traderMiddleName: string;
  traderLastName: string;
  traderFullName: string;

  Images: Image[]; 
  
  constructor() {    
    this.total = 0;  
    this.tradeIdStr = "";
    this.tradeId = 0;  
    this.name = "";
    this.description = "";
    this.tradeFor = "";    
    this.datePublished = new Date(1900, 1, 1); 
    this.status = "";
    this.categoryId = 0;
    this.categoryDescription = "";


    this.traderId = "";
    this.traderFirstName = "";   
    this.traderMiddleName = "";
    this.traderLastName = ""

    this.Images = [];
  }
}


class TradeHistory implements ITradeHistory {
 
  historyId: number;
  tradeId: number;
  createdDate: Date;
  status: string;

  constructor() {
    this.historyId = 0;
    this.tradeId = 0;
    this.createdDate = new Date(9999, 1, 1);
    this.status = "Initialised";
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

  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryDescription: string;
  tradeId: number;

  constructor() {
    this.id = 0;
    this.name = "";
    this.description = "";
    this.categoryId = 0;
    this.categoryDescription = "";
  } 
}


class TradeForObject implements ITradeForObject {

  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryDescription: string;
  tradeId: number;

  constructor() {
    this.id = 0;
    this.name = "";
    this.description = "";
    this.categoryId = 0;
    this.categoryDescription = "";
  }

}


class Category {
  categoryId: number;
  categoryDescription: string;

  constructor() {
    this.categoryId = 0;
    this.categoryDescription = "";
  }
}

class Correspondence implements ICorrespondence {
  id: number;  
  message: string;
  status: string;
  dateSent: Date;
  subject: string;  // this is the object of trade
  tradeId: number;
  traderIdReciever: string;
  traderIdSender: string;
  sender: string;   // this is the trader sending the correspondence

  constructor() {
    this.id = 0;
    this.subject = "";
    this.message = "";
    this.status = "";
    this.dateSent = new Date(9999, 1, 1);
    this.tradeId = 0;
    this.traderIdReciever = "";
    this.traderIdSender = "";
    this.sender = "";
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
  email: string;
  emailConfirmed: string;
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
    this.email = "";
    this.emailConfirmed = "";
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
  messageText: string;
  messageTypeId: number;
  messageTypeDescription: string;
  

  constructor() {
    this.messageId = 0;
    this.messageCode = "";
    this.messageText = "";
    this.messageTypeId = 0;
    this.messageTypeDescription = "";  
  }
}


class ProcessMessageType implements IProcessMessageType { 
  messageTypeId: number;
  messageTypeDescription: string;

  constructor() { 
    this.messageTypeId = 0;
    this.messageTypeDescription = "Undefined";
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
  ChangePasswordBindingModel, RegisterBindingModel, SetPasswordBindingModel, LoginModel,
  Trader, TraderDetails,
  PersonalDetails, ContactDetails, SecurityDetails,
  Address, AddressType, Phone, PhoneType,
  SocialNetwork, SocialNetworkType,Email,
  SecurityAnswer, SecurityQuestion, Correspondence,
  Trade, Image, Category, TradeHistory,
  UserSession, Authentication, UserIdentity,
  ProcessMessage,ProcessMessageType, PageTitle, Attachement
};
