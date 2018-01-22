export let CONFIG = {

    debugKeys: {
      debugOn: false,   
    },

  baseUrls: {
    // local api
    //servicebase: 'http://localhost:4200/',
    //accounts: 'http://localhost:4200/api/account/',
     
    //trades: 'http://localhost:4200/api/trades',
    //trade: 'http://localhost:4200/api/trade',
    //updatetrade: 'http://localhost:4200/api/trades/PutTrade',
    //addtrade: 'http://localhost:4200/api/trades/PostTrade',
    //removetrade: 'http://localhost:4200/api/trades/DeleteTrade',
     
    //traders: 'http://localhost:4200/api/account/GetTraders',
    //trader: 'http://localhost:4200/api/account/GetTrader',
    //updatetrader: 'http://localhost:4200/api/account/PutTrader',
    //addtrader: 'http://localhost:4200/api/account/PostTrader',
    //removetrader: 'http://localhost:4200/api/account/DeleteTrader',
     
    //categories: 'http://localhost:4200/api/categories',
    //category: 'http://localhost:4200/api/categories',
    //updatecategory: 'http://localhost:4200/api/categories/PutCategory',
    //addcategory: 'http://localhost:4200/api/categories/PostCategory',
    //removecategory: 'http://localhost:4200/api/categories/DeleteCategory',

    //addresses: 'http://localhost:4200/api/addresses',
    //address: 'http://localhost:4200/api/address',
    //updateaddress: 'http://localhost:4200/api/localities/PutAddress',
    //addaddress: 'http://localhost:4200/api/localities/PostAddress',
    //removeaddress: 'http://localhost:4200/api/localities/DeleteAddress',

    //images: 'http://localhost:4200/api/images',
    //image: 'http://localhost:4200/api/image',
    //updateimage: 'http://localhost:4200/api/localities/PutImage',
    //addimage: 'http://localhost:4200/api/localities/PostImage',
    //removeimage: 'http://localhost:4200/api/localities/DeleteImage',

    //uploads: 'http://localhost:4200/api/uploads',
    //uploadsattach: 'http://localhost:4200/api/attachements',
    //uploadsphysical: 'http://localhost:4200/uploads',


  // real api
  servicebase: 'http://localhost:5700/',
  accounts: 'http://localhost:5700/api/account/',

  trades: 'http://localhost:5700/api/trades',
  trade: 'http://localhost:5700/api/trade',
  updatetrade: 'http://localhost:5700/api/trades/PutTrade',
  addtrade: 'http://localhost:5700/api/trades/PostTrade',
  removetrade: 'http://localhost:5700/api/trades/DeleteTrade',

  images: 'http://localhost:5700/api/images',
  image: 'http://localhost:5700/api/image',
  updateimage: 'http://localhost:5700/api/localities/PutImage',
  addimage: 'http://localhost:5700/api/localities/PostImage',
  removeimage: 'http://localhost:5700/api/localities/DeleteImage',

  traders: 'http://localhost:5700/api/account/GetTraders',
  trader: 'http://localhost:5700/api/account/GetTrader',
  updatetrader: 'http://localhost:5700/api/account/PutTrader',
  addtrader: 'http://localhost:5700/api/account/PostTrader',
  removetrader: 'http://localhost:5700/api/account/DeleteTrader',

  categories: 'http://localhost:5700/api/categories',
  category: 'http://localhost:5700/api/category',
  updatecategory: 'http://localhost:5700/api/categories/PutCategory',
  addcategory: 'http://localhost:5700/api/categories/PostCategory',
  removecategory: 'http://localhost:5700/api/categories/DeleteCategory',

  addresses: 'http://localhost:5700/api/addresses',
  address:'http://localhost:5700/api/address',
  updateaddress: 'http://localhost:5700/api/localities/PutAddress',
  addaddress: 'http://localhost:5700/api/localities/PostAddress',
  removeaddress: 'http://localhost:5700/api/localities/DeleteAddress',

  messages: 'http://localhost:5700/api/processmessages',
  message: 'http://localhost:5700/api/processmessage',
  updatemessage: 'http://localhost:5700/api/localities/PutProcessMessage',
  addmessage: 'http://localhost:5700/api/localities/PostProcessMessage',
  removemessage: 'http://localhost:5700/api/localities/DeleteProcessMessage',


  uploads: 'http://localhost:5700/api/uploads',
  uploadsattach: 'http://localhost:5700/api/attachements',
  uploadsphysical: 'http://localhost:5700/uploads'
  }
}
