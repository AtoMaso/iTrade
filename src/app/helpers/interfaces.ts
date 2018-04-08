
interface IUserInfoViewModel {
  Email: string;
  Username: string;
  HasRegitered: boolean;
  LoginProvider: string;
}


interface ILoginModel {
  Email: string;
  UserName: string;
  Password: string;
}


interface IChangePasswordBindingModel {
  OldPassword: string;
  NewPassword: string;
  ConfirmPassword
}

interface IRegisterBindingModel {
  Email: string;
  Role: string;
  Password: string;
  ConfirmPassword: string
}

interface IForgotPasswordBindingModel{
  Email: string;
}


interface ISetPasswordBindingModel {
  NewPassword: string;
  ConfirmPassword: string;
}

interface IResetPasswordBindingModel {
  Email: string;
  NewPassword: string;
  ConfirmPassword: string;
  Code: string;
}

interface ITraderList {
  traderId: string;
  userName: string;
  email: string;
  EmailConfirmed: boolean;
  password: string;
  passwordHash: string;
}



interface IPersonalDetails {
  id: number;
  traderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
}


interface ISecurityDetails {
  securityDetailsId: number;
  traderId: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}


interface IAddress {
  id: number; 
  number: string;
  unit: string;
  pobox: string;
  street: string;
  suburb: string;
  place: string;
  postcode: string;
  state: string;
  country: string;
  preferredFlag: string;
  addressTypeId: number;
  addressType: string;
  traderId: string;
}

interface IAddressType {
  addressTypeId: number;
  addressType: string;
}


interface IPhone {
  id: number; 
  number: string;
  cityCode: string;
  countryCode: string;
  preferredFlag: string;
  phoneTypeId: number; 
  phoneType: string;
  traderId: string;
}

interface IPhoneType {
  phoneTypeId: number;
  phoneType: string;
}

interface ISocialNetwork {
  id: number;
  account: string;
  preferredFlag: string;
  socialTypeId: number;
  socialType: string;
  traderId: string;
}

interface ISocialNetworkType {
  socialTypeId: number;
  socialType: string;
}


interface IEmail {
  id: number;
  account: string;
  preferredFlag: string;
  emailTypeId: number;
  emailType: string; 
  traderId: string;
}

interface IEmailType {
  emailTypeId: number;
  emailType: string;
}



interface ITrade {
  total: number; 

  tradeIdStr: string;
  tradeId: number;  
  name: string;
  description: string;
  tradeFor: string;
  status: string;
  datePublished: Date;
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

  Images: IImage[];
}


interface IPostTrade {
 
  tradeId: number;
  name: string;
  description: string;
  tradeFor: string;
  status: string;
  datePublished: Date; 
  state: string;
  place: string;
  postcode: string;
  suburb: string;
  category: string;
  subcategory: string; 
  traderId: string;
  Images: IImage[];
}

interface ITradeHistory {
  historyId: number;
  tradeId: number;
  createdDate: Date;
  status: string;
  viewer: string;
}


interface IImage {
  imageId: number; 
  imageTitle: string;
  imageUrl: string;
  tradeId: number;
}


interface ICategory {
  categoryId: number;
  category: string;
  subcategories: ISubcategory[];
}


interface ISubcategory {
  subcategoryId: number;
  subcategory: string;
  categoryId: number;
}


interface ICorrespondence {
  id: number;
  message: string;
  content: string;
  statusSender: string;
  statusReceiver: string;
  dateSent: Date;
  subject: string;  // this is the object of trade
  tradeId: number;
  traderIdReceiver: string;
  traderIdSender: string;
  sender: string;   // this is the trader sending the correspondence
  receiver: string; // this is the trader receiving the correspondence
}


interface IGeoData {
  id: number;
  state: string;
  place: string;
  postcode: string;
  suburb: string;
}



interface IUserSession {
    authentication: IAuthentication;
    userIdentity: IUserIdentity;
    sessionCookie: string;
}

interface IAuthentication {
    isAuthenticated: boolean;
    authenticationType: string;
}

interface IUserIdentity {
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
   isInRole(rolename: string, roles: string[]): boolean;
}


interface IProcessMessage {
  messageId: number;
  messageCode: string;
  messageType: string;
  messageText: string;
  messageTypeId: number;
}

interface IProcessMessageType {
  messageTypeId: number; 
  messageType: string;

}


 interface IPageTitle {
  title: string;
  value: string;
}

 interface IAttachement {
   attachementId: number;
   tradeId: number;
   physicalPath: string;
   name: string;
 }




interface IState {
  state: string;
  places: IPlace[];
}

interface IPlace {
  place: string;
  parentstate: string;
  postcodes: IPostcode[];
}


interface IPostcode {
  postcode: string;
  parentplace: string;
  suburbs: ISuburb[];
}

interface ISuburb {
  suburb: string;
  parentpostcode: string;
}



export {
IChangePasswordBindingModel, IRegisterBindingModel, IUserInfoViewModel,
  ISetPasswordBindingModel, ILoginModel, IForgotPasswordBindingModel, IResetPasswordBindingModel,
  ITraderList, IPostTrade, ISubcategory, IGeoData,
  IPersonalDetails, ISecurityDetails,
  IAddress, IAddressType, IPhone, IPhoneType,
  ISocialNetwork, ISocialNetworkType,
  IEmail, IEmailType, ICorrespondence,
  ITrade, IImage, ICategory, ITradeHistory,
  IUserSession, IAuthentication, IUserIdentity, 
  IPlace, IState, ISuburb, IPostcode,
  IProcessMessage, IProcessMessageType, IPageTitle, IAttachement };
