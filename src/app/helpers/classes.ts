﻿import {
  IChangePasswordBindingModel, IRegisterBindingModel, IResetPasswordBindingModel,
  ISetPasswordBindingModel, ILoginModel, IForgotPasswordBindingModel,
  ITraderList, IPostTrade, IGeoData,
  IPersonalDetails, ISecurityDetails,
  IAddress, IAddressType,
  IPhone, IPhoneType, ISubcategory,
  ISocialNetwork, ISocialNetworkType,
  IEmail, IEmailType, ICorrespondence,
  ITrade, IImage, ICategory, ITradeHistory,  
  IUserSession, IAuthentication, IUserIdentity,
  IProcessMessage, IProcessMessageType,
  IPageTitle, IAttachement, IUserInfoViewModel, IPlace, IState, ISuburb, IPostcode,
} from './interfaces';


class UserInfoViewModel implements IUserInfoViewModel {

  Email: string;
  Username: string;
  Password: string;
  HasRegitered: boolean;
  LoginProvider: string;

  constructor() {
    this.Email = "";
    this.Username = "";
    this.Password = "***********";
    this.HasRegitered = true;
    this.LoginProvider = "";
  }
}



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


class ResetPasswordBindingModel implements IResetPasswordBindingModel {
  Email: string;
  NewPassword: string;
  ConfirmPassword: string;
  Code: string;

  constructor() {
    this.Email = "";
    this.NewPassword = "";
    this.ConfirmPassword = "";
    this.Code = "";
  }
}

class ForgotPasswordBindingModel implements IForgotPasswordBindingModel {
  Email: string;

  constructor() {
    this.Email = "";
  }
}



class Trader implements ITraderList {
  traderId: string;
  userName: string;
  email: string;
  EmailConfirmed: boolean;
  password: string;
  passwordHash: string;
  

  constructor() {    
    this.traderId = "";
    this.email = "";
    this.EmailConfirmed = false;
    this.userName = "";
    this.password = "************";
    this.passwordHash = "";
  }
}



class PersonalDetails implements IPersonalDetails {

  id: number;
  traderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;

  constructor() {
    this.id = 0;
    this.traderId = "";
    this.firstName = "";
    this.middleName = "";
    this.lastName = "";
    this.dateOfBirth = "";
  }
}


class SecurityDetails implements ISecurityDetails {

  securityDetailsId: number;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  traderId: string;

  constructor() {
    this.securityDetailsId = 0;   
    this.userName = "";
    this.email = "";
    this.password = "";   
    this.confirmPassword = "";
    this.traderId = "";
  }
}


class Address implements IAddress {

  id: number; 
  number: string;
  unit: string;
  pobox: string;
  street: string;
  suburb: string;
  postcode: string;
  place: string;
  state: string;
  country: string;
  preferredFlag: string;
  addressTypeId: number;
  addressType: string;
  traderId: string;


  constructor() {
    this.id = 0;
    this.number = "";
    this.pobox = "";
    this.unit = "";
    this.street = "";
    this.suburb = "";
    this.place = "";
    this.postcode = "";
    this.state = "";
    this.country = "";
    this.preferredFlag = "";
    this.addressTypeId = 0;
    this.addressType = "";
    this.traderId = "";
  }
}


class AddressType implements IAddressType {
  addressTypeId: number;
  addressType: string;

  constructor() {
    this.addressTypeId = 0;
    this.addressType = "";
  }
}


class Phone implements IPhone {

  id: number; 
  number: string;
  cityCode: string;
  countryCode: string;
  preferredFlag: string;
  phoneTypeId: number;
  phoneType: string;
  traderId: string;

  constructor() {
    this.id = 0;
    this.number = "";
    this.cityCode = "";
    this.countryCode = "";
    this.preferredFlag = "";
    this.phoneTypeId = 0;
    this.phoneType = "";
    this.traderId = "";
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
  id: number;
  account: string; 
  preferredFlag: string;
  socialTypeId: number;
  socialType: string;
  traderId: string;

  constructor() {
    this.id = 0;
    this.account = "";
    this.preferredFlag = "";
    this.socialTypeId = 0;
    this.socialType = "";
    this.traderId = "";
  }
}


class SocialNetworkType implements ISocialNetworkType {
  socialTypeId: number;
  socialType: string;

  constructor() {
    this.socialTypeId = 0;
    this.socialType = "";
  }
}


class Email implements IEmail {
  id: number;
  account: string;
  preferredFlag: string;
  emailTypeId: number;
  emailType: string; 
  traderId: string;

  constructor() {
    this.id = 0;
    this.account = "";
    this.preferredFlag = ""
    this.emailTypeId = 0;
    this.emailType = "";
    this.traderId = "";
  }
}



class EmailType implements IEmailType {
  emailTypeId: number;
  emailType: string;

  constructor() {
    this.emailTypeId = 0;
    this.emailType = "";
  }
}



class GeoData implements IGeoData {
  id: number;
  state: string;
  place: string;
  postcode: string;
  suburb: string;

  constructor() {
    this.id = 0;
    this.state = "";
    this.place = "";
    this.postcode = "";
    this.suburb = "";
  }
}


class Trade implements ITrade {
  addsflag: boolean;
  total: number;
  tradeIdStr: string;
  tradeId: number; 
  name: string;
  description: string;
  tradeFor: string;
  datePublished: Date;
  status: string;
  state: string;
  place: string;
  postcode: string;  
  suburb: string;
  category: string;
  subcategory: string;

  traderId: string;
  traderFirstName: string;
  traderMiddleName: string;
  traderLastName: string;
  traderFullName: string;

  Images: Image[]; 
  
  constructor() {    
    this.addsflag= false;
    this.total = 0;  
    this.tradeIdStr = "";
    this.tradeId = 0;  
    this.name = "";
    this.description = "";
    this.tradeFor = "";    
    this.datePublished = new Date(1900, 1, 1); 
    this.status = "";
    this.state = "";
    this.place = "";
    this.postcode = "";   
    this.suburb = "";
    this.category = "";
    this.subcategory = "";

    this.traderId = "";
    this.traderFirstName = "";   
    this.traderMiddleName = "";
    this.traderLastName = ""

    this.Images = [];
  }
}



class PostTrade implements IPostTrade {

  tradeId: number;
  name: string;
  description: string;
  tradeFor: string;
  datePublished: Date;
  status: string; 
  state: string;
  place: string;
  postcode: string; 
  suburb: string; 
  category: string;
  subcategory: string;
  traderId: string;
  Images: Image[];

  constructor() {
    this.tradeId = 0;
    this.name = "";
    this.description = "";
    this.tradeFor = "";
    this.datePublished = new Date(1900, 1, 1);
    this.status = "";
    this.state = "";
    this.place = "";
    this.postcode = "";
    this.suburb = "";
    this.category = "";   
    this.subcategory = "";  
    this.traderId = "";
    this.Images = [];
  }
}


class TradeHistory implements ITradeHistory {
 
  historyId: number;
  tradeId: number;
  createdDate: Date;
  status: string;
  viewer: string;

  constructor() {
    this.historyId = 0;
    this.tradeId = 0;
    this.createdDate = new Date(9999, 1, 1);
    this.status = "Created";
    this.viewer = "";
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


class Category implements ICategory {
  categoryId: number;
  category: string;
  subcategories: Subcategory[];

  constructor() {
    this.categoryId = 0;
    this.category = "";
    this.subcategories = [];
  }
}


class Subcategory implements ISubcategory {
  subcategoryId: number;
  subcategory: string;
  categoryId: number;

  constructor() {
    this.subcategoryId = 0;
    this.subcategory = "";
    this.categoryId = 0;
  }
}


class Correspondence implements ICorrespondence {
  id: number;  
  message: string;
  content: string;
  statusSender: string;
  statusReceiver: string;
  dateSent: Date;
  subject: string;  // this is the object of trade
  tradeId: number;
  traderIdReceiver: string; // this is the trader viewing it
  traderIdSender: string;  //this is the trader sending it
  sender: string;   // this is the trader name sending the correspondence
  receiver: string; // this is the trader name receiving the corresponding 

  constructor() {
    this.id = 0;
    this.subject = "";
    this.message = "";
    this.content = "";
    this.statusSender = "";
    this.statusReceiver = "";
    this.dateSent = new Date(9999, 1, 1);
    this.tradeId = 0;
    this.traderIdReceiver = "";
    this.traderIdSender = "";
    this.sender = "";
    this.receiver = "";
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
    this.accessTokenExpiresDate = null;
    this.accessTokenExpiresIn = 0;
    this.userName = "";
    this.email = "";
    this.emailConfirmed = "";
    this.userId = "";
    this.roles = [];
  }

  public isInRole(rolename: string, roles: string[]): boolean {

    let m: number = 0;
    for (m = 0; m < roles.length; m++) {
      if (rolename === roles[m]) {
        return true;
      }
    }
    return false;
  }
}

class ProcessMessage implements IProcessMessage {
  messageId: number;
  messageCode: string;
  messageText: string;
  messageTypeId: number;
  messageType: string;
  

  constructor() {
    this.messageId = 0;
    this.messageCode = "";
    this.messageText = "";
    this.messageTypeId = 0;
    this.messageType = "";  
  }
}


class ProcessMessageType implements IProcessMessageType { 
  messageTypeId: number;
  messageType: string;

  constructor() { 
    this.messageTypeId = 0;
    this.messageType = "Undefined";
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


class PreferredType {
  id: number;
  value: string;

  constructor() {
    this.id = 0;
    this.value = "";
  }
}





class State implements IState {
  state: string;
  places: IPlace[];

  constructor() {
    this.state="";
    this.places = [];
  }
}

class Place implements IPlace {
  place: string;
  parentstate: string;
  postcodes: IPostcode[];

  constructor() {
    this.place = "";
    this.parentstate = "";
    this.postcodes = [];
  }
}


class Postcode implements IPostcode {
  postcode: string;
  parentplace: string;
  suburbs: ISuburb[];

  constructor() {
    this.postcode = "";
    this.parentplace = "";
    this.suburbs = [];
  }
}

class Suburb implements ISuburb {
  suburb: string;
  parentpostcode: string;

  constructor() {
    this.suburb = "";
    this.parentpostcode = "";
  }
}

export {
  ChangePasswordBindingModel, RegisterBindingModel,
  UserInfoViewModel, ForgotPasswordBindingModel, ResetPasswordBindingModel,
  SetPasswordBindingModel, LoginModel, Subcategory, 
  Trader, PostTrade, GeoData,    
  PersonalDetails, SecurityDetails,
  Address, AddressType, Phone, PhoneType,
  SocialNetwork, SocialNetworkType, Email, EmailType,Correspondence,
  Trade, Image, Category, TradeHistory,
  UserSession, Authentication, UserIdentity,
  ProcessMessage, ProcessMessageType, PageTitle, Attachement, PreferredType,
  State, Place, Postcode, Suburb
};
