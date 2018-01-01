export let CONFIG = {

    debugKeys: {
      debugOn: false,   
    },

    //appKeys: {   
    //  numberOfImages: 5,
    //  totalNumberOfImages: 50
    //},


    baseUrls: {
        servicebase: 'http://localhost:5700/',
        accounts: 'http://localhost:5700/api/account/',
     
        trades: 'http://localhost:5700/api/trades',
        trade: 'http://localhost:5700/api/trade',
        updatetrade: 'http://localhost:5700/api/trades/PutTrade',
        addtrade: 'http://localhost:5700/api/trades/PostTrade',
        removetrade: 'http://localhost:5700/api/trades/DeleteTrade',
     
        traders: 'http://localhost:5700/api/account/GetTraders',
        trader: 'http://localhost:5700/api/account/GetTrader',
        updatetrader: 'http://localhost:5700/api/account/PutTrader',
        addtrader: 'http://localhost:5700/api/account/PostTrader',
        removetrader: 'http://localhost:5700/api/account/DeleteTrader',
     
        categories: 'http://localhost:5700/api/categories',
        updatecategory: 'http://localhost:5700/api/categories/PutCategory',
        addcategorie: 'http://localhost:5700/api/categories/PostCategory',
        removecategorie: 'http://localhost:5700/api/categories/DeleteCategory',

        addresses: 'http://localhost:5700/api/addresses',
        updateaddress: 'http://localhost:5700/api/localities/PutAddress',
        addaddress: 'http://localhost:5700/api/localities/PostAddress',
        removeaddress: 'http://localhost:5700/api/localities/DeleteAddress',

        uploads: 'http://localhost:5700/api/uploads',
        uploadsattach: 'http://localhost:5700/api/attachements',
        uploadsphysical: 'http://localhost:5700/uploads'
  }
}
