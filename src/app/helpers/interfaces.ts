
interface TraderInterface {
  TraderId: string;
  Name: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

interface TradeInterface {
  TradeId: number;
  TraderId: number;
  Title: string;
  Flash: string;
  Content: string;
  DatePublished: Date;
  CategoryType: string;
  ContentText: string;
}

interface AddressInterface {
  AddressId: number;
  TraderId: number; 
  Number: number;
  Street: string;
  Suburb: string;
  City: string;
  Postcode: number;
  State: string;
}

interface PhoneInterface {
  PhoneId: number;
  TraderId: number;
  CountryCode: string;
  CityCode: string;
  Home: string;
  Business: string;
  Mobile: string;
}


interface ImageInterface {
  ImageId: number;
  TradeId: number;
  title: string;
  url: string;
}


interface CategoryInterface {
  CategoryId: number;
  CategoryType: string;
}

interface ContentInterface {
    ContentId: number;
    ContentText: string;
}

interface UserSessionInterface {
    authentication: AuthenticationInterface;
    userIdentity: UserIdentityInterface;
    sessionCookie: string;
}

interface AuthenticationInterface {
    isAuthenticated: boolean;
    authenticationType: string;
}

interface UserIdentityInterface {
    accessToken: any;
    refreshToken: any;
    accessTokenType: string;
    accessTokenExpiresDate: Date;
    accessTokenExpiresIn: number;
    userName: string;
    name: string;
    userId: string;
    roles: string[];
    isInRole(rolename: string):boolean;
}


 interface ProcessMessageInterface {
  id: string;
  type: string;
  text: string;
}

 interface PageTitleInterface {
  title: string;
  value: string;
}

 interface AttachementInterface {
   AttachementId: number;
   ArticleId: string;
   PhysicalPath: string;
   Name: string;
 }

export {
  TraderInterface, TradeInterface, AddressInterface,          
  PhoneInterface, ImageInterface, CategoryInterface, ContentInterface,
  UserSessionInterface, AuthenticationInterface, UserIdentityInterface, 
  ProcessMessageInterface, PageTitleInterface, AttachementInterface };
