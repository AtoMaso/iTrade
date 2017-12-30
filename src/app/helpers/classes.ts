import {
  TraderInterface, TradeInterface, AddressInterface,
  PhoneInterface, ImageInterface, CategoryInterface, ContentInterface,
  UserSessionInterface, AuthenticationInterface, UserIdentityInterface,
  ProcessMessageInterface, PageTitleInterface, AttachementInterface
} from './interfaces';





class Trader implements TraderInterface {
  TraderId: string;
  Name: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
}

class Trade implements TradeInterface {
  TradeId: number;
  TraderId: number;
  Title: string;
  Flash: string;
  Content: string;
  DatePublished: Date;
  CategoryType: string;
  ContentText: string;
}

class Address implements AddressInterface {
  AddressId: number;
  TraderId: number;
  Number: number;
  Street: string;
  Suburb: string;
  City: string;
  Postcode: number;
  State: string;
}

class Phone implements PhoneInterface {
  PhoneId: number;
  TraderId: number;
  CountryCode: string;
  CityCode: string;
  Home: string;
  Business: string;
  Mobile: string;
}

class Image implements ImageInterface {
  ImageId: number;
  TradeId: number;
  title: string;
  url: string;
}


class Category implements CategoryInterface {
  CategoryId: number;
  CategoryType: string;
}

class Content implements ContentInterface {
  ContentId: number;
  ContentText: string;
}

class UserSession implements UserSessionInterface {
  authentication: AuthenticationInterface;
  userIdentity: UserIdentityInterface;
  sessionCookie: string;
}

class Authentication implements AuthenticationInterface {
  isAuthenticated: boolean;
  authenticationType: string;
}

class UserIdentity implements UserIdentityInterface {
  accessToken: any;
  refreshToken: any;
  accessTokenType: string;
  accessTokenExpiresDate: Date;
  accessTokenExpiresIn: number;
  userName: string;
  name: string;
  userId: string;
  roles: string[];
}


class ProcessMessage implements ProcessMessageInterface {
  id: string;
  type: string;
  text: string;
}

class PageTitle implements PageTitleInterface {
  title: string;
  value: string;
}

class Attachement implements AttachementInterface {
  AttachementId: number;
  ArticleId: string;
  PhysicalPath: string;
  Name: string;
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
  Trader, Trade, Address,
  Phone, Image, Category, Content,
  UserSession, Authentication, UserIdentity,
  ProcessMessage, PageTitle, Attachement};
