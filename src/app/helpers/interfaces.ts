
interface ITrader {
  traderId: number;
  personalDetails: IPersonalDetails;
  contactDetails: IContacDetails
  securityDetails: ISecurityDetails;
}

interface IPersonalDetails {
  pdId: number;
  traderId: number;
  firstName: string;
  secondName: string;
  dateOfBirth: Date;
}

interface IContacDetails {
  cdId: number;
  traderId: number;
  homeAddressId: number;
  postalAddressId: number;
  businessAddressId: number;
  homePhoneId: number;
  businessPhoneId: number;
  mobilePhoneId: number;
  email: string;
  facebook: string;
  twitter: string;
  instagram: string;
}


interface ISecurityDetails {
  sdId: number;
  traderId: number;
  userName: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
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
  ITrader, ITrade, IAddress, IPersonalDetails, ISecurityDetails, IContacDetails, IPhoneType,
  IPhone, IImage, ICategory, IContent, IUserSession, IAuthentication, IUserIdentity, 
  IProcessMessage, IPageTitle, IAttachement };
