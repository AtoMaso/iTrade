
interface TraderInterface {
  traderId: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface TradeInterface {
  tradeId: number;
  traderId: number;
  traderName: string;
  title: string;
  flash: string;
  content: string;
  willTradeFor: string;
  datePublished: Date;
  categoryType: string;
}

interface AddressInterface {
  addressId: number;
  traderId: number; 
  number: number;
  street: string;
  suburb: string;
  city: string;
  postcode: number;
  state: string;
}

interface PhoneInterface {
  phoneId: number;
  traderId: number;
  countryCode: string;
  cityCode: string;
  home: string;
  business: string;
  mobile: string;
}


interface ImageInterface {
  imageId: number;
  tradeId: number;
  title: string;
  url: string;
}


interface CategoryInterface {
  categoryId: number;
  categoryType: string;
}

interface ContentInterface {
    contentId: number;
    contentText: string;
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
  //isInRole(rolename: string): boolean;
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
