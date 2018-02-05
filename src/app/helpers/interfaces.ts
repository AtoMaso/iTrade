
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


interface ISetPasswordBindingModel {
    NewPassword: string;
    ConfirmPassword: string;
}


interface ITraderList {
  traderId: string,
  traderFirstName: string,
  traderMiddleName: string,
  traderLastName: string,
  traderContactEmail: string;
  traderContactPhone: string
}

interface ITraderDetails {
  traderId: string;
  personalDetails: IPersonalDetails;
  contactDetails: IContactDetails
  securityDetails: ISecurityDetails;
}



interface IPersonalDetails {
  personalDetailsId: number;
  traderId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: Date;
  addresses: IAddress[]
}

interface IContactDetails {
  contactDetailsId: number;
  traderId: string;
  phones: IPhone[];
  socialNetworks: ISocialNetwork[];  
}


interface ISecurityDetails {
  securityDetailsId: number;
  traderId: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  securityAnswers: ISecurityAnswer[];
}


interface IAddress {
  addressId: number; 
  addressNumber: number;
  addressStreet: string;
  addressSuburb: string;
  addressCity: string;
  addressPostcode: number;
  addressState: string;
  addressCountry: string;
  addressTypeId: number;
  addressTypeDescription: string;
  personalDetailsId: number;
}

interface IAddressType {
  addressTypeId: number;
  addressTypeDescription: string;
}


interface IPhone {
  phoneId: number; 
  phoneNumber: number;
  phoneCityCode: string;
  phoneCountryCode: string;
  phoneTypeId: number; 
  phoneTypeDescription: string;
  contactDetailsId: number;
}

interface IPhoneType {
  phoneTypeId: number;
  phoneType: string;
}

interface ISocialNetwork {
  socialNetworkId: number;
  socialNetworkAccount: string;
  socialNetworkTypId: number;
  socialNetworkTypeText: string;
  contactDetailsId: number;
}

interface ISocialNetworkType {
  socialNetworkTypeId: number;
  socialNetworkTypeText: string;
}


interface ISecurityAnswer {
  answerId: number;
  questionId: number;
  questionText: string;
  questionAnswer: string;
  securityDetailsId: number;
}

interface ISecurityQuestions {
  questionId: number;
  questionText: string;
}


interface IEmail {
  emailId: number;
  emailTypeid: number;
  emailType: string;
  emailAccount: string;
  contactDetailsId: number;
}

interface IEmailType {
  emailTypeId: number;
  emailTypeDescription: string;
}





interface ITrade {
  totalTradesNumber: number; 
  tradeIdStr: string;
  tradeId: number;  
  tradeStatus: string;
  tradeDatePublished: Date;

  traderId: string;
  traderFirstName: string;
  traderMiddleName: string;
  traderLastName: string;

  tradeObjects: ITradeObject[];
  tradeForObjects: ITradeForObject[];
  images: IImage[];
}


interface ITradeHistory {
  historyId: number;
  tradeId: number;
  createdDate: Date;
  status: string;
}


interface IImage {
  imageId: number; 
  imageTitle: string;
  imageUrl: string;
  tradeId: number;
}


interface ITradeObject {
  tradeObjectId: number;
  tradeObjectDescription: string;
  objectCategoryId: number;
  tradeObjectCategoryDescription: string;
  tradeId: number;
}


interface ITradeForObject {
  tradeForObjectId: number;
  tradeForObjectDescription: string;
  objectCategoryId: number;
  tradeForObjectCategoryDescription: string;
  tradeId: number;
}


interface IObjectCategory {
  objectCategoryId: number;
  objectCategoryDescription: string;
}


interface ICorrespondence {
  id: number;
  message: string;
  status: string;
  dateSent: Date;
  subject: string;  // this is the object of trade
  tradeId: number;
  traderId: string;
  sender: string;   // this is the trader sending the correspondence
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
  messageTypeDescription: string;
  messageText: string;
  messageTypeId: number;
}

interface IProcessMessageType {
  messageTypeId: number; 
  messageTypeDescription: string;

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


export {
  IChangePasswordBindingModel, IRegisterBindingModel, ISetPasswordBindingModel, ILoginModel,
  ITraderList, ITraderDetails,
  IPersonalDetails, ISecurityDetails, IContactDetails,
  IAddress, IAddressType, IPhone, IPhoneType,
  ISecurityAnswer, ISecurityQuestions,
  ISocialNetwork, ISocialNetworkType,
  IEmail, IEmailType, ICorrespondence,
  ITrade, IImage, IObjectCategory, ITradeObject, ITradeForObject, ITradeHistory,
  IUserSession, IAuthentication, IUserIdentity, 
  IProcessMessage, IProcessMessageType, IPageTitle, IAttachement };
