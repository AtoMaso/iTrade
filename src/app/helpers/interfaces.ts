
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





interface ITrade {
  tradeId: number; 
  tradeTitle: string; 
  tradingFor: string[];
  tradeDatePublished: Date;
  tradeCategoryType: string;
  traderId: number;
  traderFirstName: string;
  traderMiddleName: string;
  traderLastName: string;
}


interface IImage {
  imageId: number; 
  imageTitle: string;
  imageUrl: string;
  tradeId: number;
}


interface ICategory {
  categoryId: number;
  categoryType: string;
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
  ITraderList, ITraderDetails,
  IPersonalDetails, ISecurityDetails, IContactDetails,
  IAddress, IAddressType, IPhone, IPhoneType,
  ISecurityAnswer, ISecurityQuestions,
  ISocialNetwork, ISocialNetworkType,
  ITrade,
  IImage, ICategory,
  IUserSession, IAuthentication, IUserIdentity, 
  IProcessMessage, IPageTitle, IAttachement };
