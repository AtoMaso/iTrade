
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
  password: string;
  securityAnswers: ISecurityAnswer[];
}


interface IAddress {
  addressId: number;
  traderId: number;
  number: number;
  street: string;
  suburb: string;
  city: string;
  postcode: number;
  state: string;
  country: string;
}

interface IPhone {
  phoneId: number;
  traderId: number;
  phoneNumber: number;
  countryCode: string;
  cityCode: string;
  phoneTypeId: number;
}

interface IPhoneType {
  phoneTypeId: number;
  phoneType: string;
}

interface ISocialNetwork {
  socialNetworkId: number;
  socialNetworkAccount: string;
  socialNetworkTypId: number;
  socialNetworkTypetext: string;
  contactDetailsId: number;
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
  traderId: number;
  title: string; 
  content: string;
  tradingFor: string[];
  datePublished: Date;
  categoryType: string;
}





interface IImage {
  imageId: number;
  tradeId: number;
  title: string;
  url: string;
}


interface ICategory {
  categoryId: number;
  categoryType: string;
}

interface IContent {
    contentId: number;
    contentText: string;
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
  id: string;
  type: string;
  text: string;
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
  ITraderList, ITraderDetails, ITrade, IAddress, IPersonalDetails, ISecurityDetails, IContacDetails, IPhoneType,
  IPhone, IImage, ICategory, IContent, IUserSession, IAuthentication, IUserIdentity, 
  IProcessMessage, IPageTitle, IAttachement };
