import {
  ITrader, ITrade, IAddress, IPersonalDetails, ISecurityDetails, IContacDetails, IPhoneType,
  IPhone, IImage, ICategory, IContent, IUserSession, IAuthentication, IUserIdentity,
  IProcessMessage, IPageTitle, IAttachement } from './interfaces';


class Trader implements ITrader {
  traderId: number;
  personalDetails:IPersonalDetails;
  contactDetails: ContactDetails;
  securityDetails: SecurityDetails;

  constructor() {    
      this.traderId = 0;
      this.personalDetails = new PersonalDetails();
      this.contactDetails = new ContactDetails();
      this.securityDetails = new SecurityDetails();
  }
}

class PersonalDetails implements IPersonalDetails {
  pdId: number;
  traderId: number;
  firstName: string;
  secondName: string;
  dateOfBirth: Date;

  constructor() {
    this.pdId = 0;
    this.traderId = 0;
    this.firstName = "";
    this.secondName = "";
    this.dateOfBirth = new Date(1900, 1, 1);
  }
}

class ContactDetails implements IContacDetails {
  cdId: number;
  traderId: number;
  homeAddressId: number;
  homeAddress: IAddress;
  postalAddressId: number;
  postalAddress: IAddress;
  businessAddressId: number;
  bussinessAddress: IAddress;

  homePhoneId: number;
  homePhone: IPhone;
  businessPhoneId: number;
  businessPhone: IPhone;
  mobilePhoneId: number;
  mobilePhone: IPhone;

  email: string;
  facebook: string;
  twitter: string;
  instagram: string;

  constructor() {
    this.cdId = 0;
    this.traderId = 0;
    this.homeAddressId = 0;
    this.homeAddress = new Address();
    this.postalAddressId = 0;
    this.postalAddress = new Address;
    this.businessAddressId = 0;
    this.bussinessAddress =new Address();
    this.homePhoneId = 0;

    this.homePhone = new Phone();

    this.businessPhoneId = 0;
    this.businessPhone = new Phone();
    this.mobilePhoneId = 0;
    this.mobilePhone = new Phone();
    this.email = "";
    this.facebook = "";
    this.twitter = "";
    this.instagram = "";
  }
}

class SecurityDetails implements ISecurityDetails {
  sdId: number;
  traderId: number;
  userName: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;

  constructor() {
    this.sdId = 0;
    this.traderId = 0;
    this.userName = "";
    this.password = "Apple";   
    this.confirmPassword = "Apple";
    this.securityQuestion = "";
    this.securityAnswer = "";
  }
}

class Trade implements ITrade {

  tradeId: number;
  traderId: number;
  traderName: string;
  title: string;
  content: string;
  tradingFor: string[];
  datePublished: Date;
  categoryType: string;

  constructor() {    
    this.tradeId = 0;
    this.traderId = 0;
    this.traderName = "";   //????? check how we are going to pass this
    this.title = "";
    this.content = "";
    this.tradingFor = [];
  }
}

class Address implements IAddress {
  sdId = 0;
  addressId: number;
  traderId: number;
  number: number;
  street: string;
  suburb: string;
  city: string;
  postcode: number;
  state: string;
  country: string;

  constructor() {
    this.addressId = 0;
    this.traderId = 0;
    this.number = 0;
    this.street = "";
    this.suburb = "";
    this.city = "";
    this.postcode = 0;
    this.state = "";
    this.country = "";
  }
}

class Phone implements IPhone{

  phoneId: number;
  traderId: number;
  phoneNumber: number;
  countryCode: string;
  cityCode: string;
  phoneTypeId: number;
  type: IPhoneType

  constructor() {
    this.phoneId = 0;
    this.traderId = 0;
    this.phoneNumber = 0;
    this.countryCode = "";
    this.cityCode = "";
    this.phoneTypeId = 0;
    this.type = new PhoneType();
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

class Image implements IImage {
  imageId: number;
  tradeId: number;
  title: string;
  url: string;

  constructor() {
    this.imageId = 0;
    this.tradeId = 0;
    this.title = "";
    this.url = "";
  }
}

class Category implements ICategory {
  categoryId: number;
  categoryType: string;

  constructor() {
    this.categoryId = 0;
    this.categoryType = "";
  }
}

class Content implements IContent {
  contentId: number;
  contentText: string;

  constructor() {
    this.contentId = 0;
    this.contentText = "";
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
  id: string;
  type: string;
  text: string;
  constructor() {
    this.id = "";
    this.type = "Undefined";
    this.text = "Undefined";
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
  Trader, Trade, Address, PersonalDetails, ContactDetails, SecurityDetails, Phone, Image, Category
  , Content, UserSession, Authentication, UserIdentity, ProcessMessage, PageTitle, Attachement};
