
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
  traderSocialNetwork: string;
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
  emails: IEmail[];
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
  id: number; 
  number: number;
  street: string;
  suburb: string;
  city: string;
  postcode: number;
  state: string;
  country: string;
  preferred: string;
  typeId: number;
  typeDescription: string;
  personalDetailsId: number;
}

interface IAddressType {
  typeId: number;
  typeDescription: string;
}


interface IPhone {
  id: number; 
  number: string;
  cityCode: string;
  countryCode: string;
  preferred: string;
  typeId: number; 
  typeDescription: string;
  contactDetailsId: number;
}

interface IPhoneType {
  typeId: number;
  typeDescription: string;
}

interface ISocialNetwork {
  id: number;
  account: string;
  preferred: string;
  typId: number;
  typeDescription: string;
  contactDetailsId: number;
}

interface ISocialNetworkType {
  typeId: number;
  typeDescription: string;
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
  id: number;
  account: string;
  preferred: string;
  typeId: number;
  typeDescription: string; 
  contactDetailsId: number;
}

interface IEmailType {
  typeId: number;
  typeDescription: string;
}


interface IState {
  id: number;
  name: string;
  places: IPlace[];
}

interface IPlace {
  id: number;
  name: string;
  stateId: number;
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
  stateId: number;
  state: string;
  placeId: number;
  place: string;
  categoryId: number; 
  categoryDescription: string
  subcategoryId: number;
  subcategoryDescription: string;

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
  categoryId: number;
  stateId: number;
  placeId: number;
  subcategoryId: number; 
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
  categoryDescription: string;
  subcategories: ISubcategory[];
}


interface ISubcategory {
  subcategoryId: number;
  subcategoryDescription: string;
}


interface ICorrespondence {
  id: number;
  message: string;
  content: string;
  status: string;
  dateSent: Date;
  subject: string;  // this is the object of trade
  tradeId: number;
  traderIdReciever: string;
  traderIdSender: string;
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
  ITraderList, ITraderDetails, IPostTrade, IPlace, IState, ISubcategory,
  IPersonalDetails, ISecurityDetails, IContactDetails,
  IAddress, IAddressType, IPhone, IPhoneType,
  ISecurityAnswer, ISecurityQuestions,
  ISocialNetwork, ISocialNetworkType,
  IEmail, IEmailType, ICorrespondence,
  ITrade, IImage, ICategory, ITradeHistory,
  IUserSession, IAuthentication, IUserIdentity, 
  IProcessMessage, IProcessMessageType, IPageTitle, IAttachement };
