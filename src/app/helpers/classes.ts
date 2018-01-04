import {
  TraderInterface, TradeInterface, AddressInterface,
  PhoneInterface, ImageInterface, CategoryInterface, ContentInterface,
  UserSessionInterface, AuthenticationInterface, UserIdentityInterface,
  ProcessMessageInterface, PageTitleInterface, AttachementInterface
} from './interfaces';


class Trader implements TraderInterface {
  traderId: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

class Trade implements TradeInterface {
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

class Address implements AddressInterface {
  addressId: number;
  traderId: number;
  number: number;
  street: string;
  suburb: string;
  city: string;
  postcode: number;
  state: string;
}

class Phone implements PhoneInterface {
  phoneId: number;
  traderId: number;
  countryCode: string;
  cityCode: string;
  home: string;
  business: string;
  mobile: string;
}

class Image implements ImageInterface {
  imageId: number;
  tradeId: number;
  title: string;
  url: string;
}

class Category implements CategoryInterface {
  categoryId: number;
  categoryType: string;
}

class Content implements ContentInterface {
  contentId: number;
  contentText: string;
}

class UserSession implements UserSessionInterface {
  authentication: AuthenticationInterface ;
  userIdentity: UserIdentityInterface;
  sessionCookie: string;
  constructor() {
    this.authentication = new Authentication();
    this.userIdentity = new UserIdentity();
    this.sessionCookie = "";
  }

}

class Authentication implements AuthenticationInterface {
      isAuthenticated: boolean;
      authenticationType: string;
      constructor() {
              this.isAuthenticated = false;
              this.authenticationType = "anonimous";
      } 
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
  //isInRole(rolename: string): boolean
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
