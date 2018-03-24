import {
  IChangePasswordBindingModel, IRegisterBindingModel, IResetPasswordBindingModel,
  ISetPasswordBindingModel, ILoginModel, IForgotPasswordBindingModel,
  ITraderList, IPostTrade,ISuburb,
  IPersonalDetails, ISecurityDetails,
  IAddress, IAddressType, IState, IPlace, IPostcode,
  IPhone, IPhoneType, ISubcategory,
  ISecurityAnswer, ISecurityQuestions,
  ISocialNetwork, ISocialNetworkType,
  IEmail, IEmailType, ICorrespondence,
  ITrade, IImage, ICategory, ITradeHistory,  
  IUserSession, IAuthentication, IUserIdentity,
  IProcessMessage, IProcessMessageType,
  IPageTitle, IAttachement, IUserInfoViewModel,
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
  city: string;
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
    this.city = "";
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


class SecurityAnswer implements ISecurityAnswer {
  answerId: number;
  questionAnswer: string;
  questionId: number;
  questionText: string;
  traderId: string;

  constructor() {
    this.answerId = 0;
    this.questionAnswer = "";
    this.questionId = 0;
    this.questionText = "";
    this.traderId = "";
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

class State implements IState {
  id: number;
  name: string;
  places: Place[];

  constructor() {
    this.id = 0;
    this.name = "";
    this.places = [];
  }
}

class Place implements IPlace {
  id: number;
  name: string;
  stateId: number;
  postcodes: Postcode[];

  constructor() {
    this.id = 0;
    this.name = "";
    this.stateId = 0;
    this.postcodes = [];
  }
}

class Postcode implements IPostcode {
  id: number;
  number: string;
  placeId: number;
  suburbs: Suburb[];

  constructor() {
    this.id = 0;
    this.number = "";
    this.placeId = 0;
    this.suburbs = [];
  }
}

class Suburb implements ISuburb {
  id: number;
  name: string;
  postcodeId: number;

  constructor() {
    this.id = 0;
    this.name = "";
    this.postcodeId = 0;    
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
  placeId: number;
  place: string;
  postcodeId: number;
  postcodeNumber: string;
  stateId: number;
  state: string;
  categoryId: number;
  categoryDescription: string;
  subcategoryId: number;
  subcategoryDescription: string;

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
    this.placeId = 0;
    this.place = "";
    this.postcodeId = 0;
    this.postcodeNumber = "";
    this.stateId = 0;
    this.state = "";
    this.categoryId = 0;
    this.categoryDescription = "";
    this.subcategoryId = 0;
    this.subcategoryDescription = "";

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
  placeId: number;
  //place: string;
  postcodeId: number;
  //postcodeNumber: string;
  stateId: number;
  //state: string;
  categoryId: number;
  //categoryDescription: string;
  subcategoryId: number;
  //subcategoryDescription: string;
  traderId: string;
  Images: Image[];

  constructor() {
    this.tradeId = 0;
    this.name = "";
    this.description = "";
    this.tradeFor = "";
    this.datePublished = new Date(1900, 1, 1);
    this.status = "";
    this.placeId = 0;
    //this.place = "";
    this.postcodeId = 0;
    //this.postcodeNumber = "";
    this.stateId = 0;
    //this.state = "";
    this.categoryId = 0;
    //this.categoryDescription = "";
    this.subcategoryId = 0;
    //this.subcategoryDescription = "";
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
  categoryDescription: string;
  subcategories: Subcategory[];

  constructor() {
    this.categoryId = 0;
    this.categoryDescription = "";
    this.subcategories = [];
  }
}


class Subcategory implements ISubcategory {
  subcategoryId: number;
  subcategoryDescription: string;
  categoryId: number;

  constructor() {
    this.subcategoryId = 0;
    this.subcategoryDescription = "";
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


class PreferredType {
  id: number;
  value: string;

  constructor() {
    this.id = 0;
    this.value = "";
  }
}

export {
  ChangePasswordBindingModel, RegisterBindingModel,
  UserInfoViewModel, ForgotPasswordBindingModel, ResetPasswordBindingModel,
  SetPasswordBindingModel, LoginModel, Subcategory, 
  Trader, PostTrade, State, Place, Postcode,Suburb,
  PersonalDetails, SecurityDetails,
  Address, AddressType, Phone, PhoneType,
  SocialNetwork, SocialNetworkType, Email, EmailType,
  SecurityAnswer, SecurityQuestion, Correspondence,
  Trade, Image, Category, TradeHistory,
  UserSession, Authentication, UserIdentity,
  ProcessMessage,ProcessMessageType, PageTitle, Attachement, PreferredType
};
