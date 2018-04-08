export let CONFIG = {

    debugKeys: {
      debugOn: false,   
    },

  baseUrls: {
  
    servicebase: 'http://localhost:5700/',
    accounts: 'http://localhost:5700/api/account/',
    getUserInfo: 'http://localhost:5700/api/account/UserInfo',
    changepassword: 'http://localhost:5700/api/account/ChangePassword',
    logout: 'http://localhost:5700/api/account/Logout',
    forgotpassword: 'http://localhost:5700/api/account/ForgotPassword',
    resetPassword: 'http://localhost:5700/api/account/ResetPassword',


    //trades
    alltrades: 'http://localhost:5700/api/trades',
    tradeswithstatus: 'http://localhost:5700/api/trades/GetTradesWithStatus',

    tradeswithsetfilters: 'http://localhost:5700/api/trades/GetTradesWithSetFilters',
    setoftradeswithsetfilters:'http://localhost:5700/api/trades/GetSetOfTradesWithSetFilters',

    limitedtradeswithstatus: 'http://localhost:5700/api/trades/GetLimitedTradesWithStatus',
    limitedtradesnostatus: 'http://localhost:5700/api/trades/GetLimitedTradesNoStatus',
   
    tradesbytraderidwithstatus: 'http://localhost:5700/api/trades/GetTradesByTraderIdWithStatus',    
    tradesbytraderidnostatus: 'http://localhost:5700/api/trades/GetTradesByTraderIdNoStatus',
 
    setoftradeswithstatus: 'http://localhost:5700/api/trades/GetSetOfTradesWithStatus',
    setoftradeswithstatusfortrader: 'http://localhost:5700/api/trades/GetSetOfTradesWithStatusForTrader',
    setoftradesnostatusfortrader: 'http://localhost:5700/api/trades/GetSetOfTradesNoStatusForTrader',
    setoftradesclosed: 'http://localhost:5700/api/trades/GetSetOfTradesClosed',

    trade: 'http://localhost:5700/api/trades/',
    updatetrade: 'http://localhost:5700/api/trades/',
    addtrade: 'http://localhost:5700/api/trades/PostTrade',
    deletetrade: 'http://localhost:5700/api/trades/DeleteTrade',


    // trade history
    tradehistories: 'http://localhost:5700/api/tradehistories/',
    tradehistoriesbytradeid : 'http://localhost:5700/api/tradehistories/GetTradeHistoriesByTradeId/',   
    pagesoftradehistories: 'http://localhost:5700/api/tradehistories/GetPagesOfTradeHistories',
    tradehistory: 'http://localhost:5700/api/tradehistories/',
    updatetradehistory: 'http://localhost:5700/api/tradehistories/PutTradeHistory',
    addtradehistory: 'http://localhost:5700/api/tradehistories/PostTradeHistory',
    removetradehistory: 'http://localhost:5700/api/tradehistories/DeleteTradeHistory',


     // images 
    images: 'http://localhost:5700/api/images',
    image: 'http://localhost:5700/api/images/',
    updateimage: 'http://localhost:5700/api/images/putimage',
    addimage: 'http://localhost:5700/api/images/postimage',
    removeimage: 'http://localhost:5700/api/images/deleteimage',


    // corresspondence
    corres: 'http://localhost:5700/api/correspondences',
    correswithstatus: 'http://localhost:5700/api/correspondences/GetCorrespondencesWithStatus',
    corresbytradeid: 'http://localhost:5700/api/correspondences/GetCorrespondencesByTradeId',
    corresbytradeidwithstatus: 'http://localhost:5700/api/correspondences/GetCorrespondencesByTradeIdWithStatus',
    corresbysenderidandid: 'http://localhost:5700/api/correspondences/GetCorrespondenceByTradeIdAndId',

    corresbytraderidinbox: 'http://localhost:5700/api/correspondences/GetInboxByTraderId',
    corresbytraderidwithstatusinbox: 'http://localhost:5700/api/correspondences/GetInboxByTraderIdWithStatus',
    corresbytraderidsent: 'http://localhost:5700/api/correspondences/GetSentByTraderId',
    corresbytraderidwithstatussent: 'http://localhost:5700/api/correspondences/GetSentByTraderIdWithStatus',
    removedcorrespondencebytraderid: 'http://localhost:5700/api/correspondences/GetRemovedCorrespondenceByTraderId',

    singlecorres: 'http://localhost:5700/api/correspondences/',
    updatecorres: 'http://localhost:5700/api/correspondences/PutCorrespondence',
    addcorres: 'http://localhost:5700/api/correspondences/PostCorrespondence',
    deletecorres: 'http://localhost:5700/api/correspondences/DeleteCorrespondence',


    // geo data
    geodataStatesWthData: 'http://localhost:5700/api/geodatas/GetStatesWithData',
    geodataStates: 'http://localhost:5700/api/geodatas/GetStates',
    geodataPlacesByStateCodeUrl: 'http://localhost:5700/api/geodatas/GetPlacesByStateCode',
    geodataPostcodesByPlaceNameAndStateCodeUrl: 'http://localhost:5700/api/geodatas/GetPostcodesByPlaceNameAndStateCode',
    geodataSuburbsByPostcodeNumberUrl: 'http://localhost:5700/api/geodatas/GetSuburbsByPostcodeNumber',
    geodataSuburbsByPostcodeNumberAndPlaceNameUrl: 'http://localhost:5700/api/geodatas/GetSuburbsByPostcodeNumberAndPlaceName',
    addGeoRecord: 'http://localhost:5700/api/geodatas/PostGeoData',
    updateGeoRecord: 'http://localhost:5700/api/geodatas/PutGeoData',
    deleteGeoRecord: 'http://localhost:5700/api/geodatas/DeleteGeoData',


    // category
    categories: 'http://localhost:5700/api/categories',
    category: 'http://localhost:5700/api/categories/',
    updatecategory: 'http://localhost:5700/api/categories/PutCategory',
    addcategory: 'http://localhost:5700/api/categories/PostCategory',
    deletecategory: 'http://localhost:5700/api/categories/DeleteCategory',


    // subcategory
    subcategories: 'http://localhost:5700/api/subcategories',
    subcategoriesbycategoryid: 'http://localhost:5700/api/subcategories/GetSubcategoriesByCategoryId',
    subcategory: 'http://localhost:5700/api/subcategories/',
    updatesubcategory: 'http://localhost:5700/api/subcategories/PutSubcategory',
    addsubcategory: 'http://localhost:5700/api/subcategories/PostSubcategory',
    deletesubcategory: 'http://localhost:5700/api/subcategories/DeleteSubcategory',


   //traders
    traders: 'http://localhost:5700/api/account/GetTraders',
    traderbytraderid: 'http://localhost:5700/api/account/GetTraderByTraderId/',
    updatetrader: 'http://localhost:5700/api/account/PutTrader',
    addtrader: 'http://localhost:5700/api/account/PostTrader',
    deletetrader: 'http://localhost:5700/api/account/DeleteTrader',

      // personal details
    personaldetails: 'http://localhost:5700/api/personaldetails',
    personaldetailsbytraderid: 'http://localhost:5700/api/personaldetails/GetPersonalDetailsByTraderId', 
    personaldetail: 'http://localhost:5700/api/personaldetails/',
    updatepersonaldetail: 'http://localhost:5700/api/personaldetails/PutPersonalDetail',
    addpersonaldetail: 'http://localhost:5700/api/personaldetails/PostPersonalDetails',
    deletepersonaldetails: 'http://localhost:5700/api/personaldetails/DeletePersonalDetails',
  
    // security details
    securitydetails: 'http://localhost:5700/api/securitydetails',
    securitydetailsbytraderid: 'http://localhost:5700/api/securitydetails/GetSecurityDetailsByTraderId',   
    securitydetail: 'http://localhost:5700/api/personaldetails/',
    updatesecuritydetail: 'http://localhost:5700/api/securitydetails/PutSecurityDetail',
    addsecuritydetail: 'http://localhost:5700/api/securitydetails/PostSurityDetails',
    deletesecuritydetail: 'http://localhost:5700/securitydetails/DeleteSecurityDetail',

    // address
    addresses: 'http://localhost:5700/api/addresses',
    address: 'http://localhost:5700/api/addresses/',
    addressesbytraderid: 'http://localhost:5700/api/addresses/GetAddressesByTraderId',
    preferredaddress: 'http://localhost:5700/api/addresses/GetPreferredAddress',
    updateaddress: 'http://localhost:5700/api/addresses/PutAddress',
    addaddress: 'http://localhost:5700/api/addresses/PostAddress',
    deleteaddress: 'http://localhost:5700/api/addresses/DeleteAddress',

    // address type
    addresstypes: 'http://localhost:5700/api/addresstypes',    
    addresstype: 'http://localhost:5700/api/addresstypes/',
    updateaddresstype: 'http://localhost:5700/api/addresstypes/PutAddressType',
    addaddresstype: 'http://localhost:5700/api/addresstypes/PostAddressType',
    deleteaddresstype: 'http://localhost:5700/api/addresstypes/DeleteAddressType',
  
    // process message
    messages: 'http://localhost:5700/api/processmessages',
    message: 'http://localhost:5700/api/processmessages/',
    updatemessage: 'http://localhost:5700/api/processmessages/putprocessmessage',
    addmessage: 'http://localhost:5700/api/processmessages/postprocessmessage',
    deletemessage: 'http://localhost:5700/api/processmessages/deleteprocessmessage',
 
    // process message type
    messagetypes: 'http://localhost:5700/api/processmessagetypes',
    messagetype: 'http://localhost:5700/api/processmessagetypes/',
    updatemessagetype: 'http://localhost:5700/api/processmessagetypes/putprocessmessagetype',
    addmessagetype: 'http://localhost:5700/api/processmessagetypes/postprocessmessagetype',
    deletemessagetype: 'http://localhost:5700/api/processmessagetypes/deleteprocessmessagetype',

    // phone
    phones: 'http://localhost:5700/api/phones',
    phone: 'http://localhost:5700/api/phones/',
    phonesbytraderid: 'http://localhost:5700/api/phones/GetPhonesByTraderId',
    preferredphone: 'http://localhost:5700/api/phones/GetPreferredPhone',
    updatephone: 'http://localhost:5700/api/phones/PutPhone',
    addphone: 'http://localhost:5700/api/phones/PostPhone',
    deletephone: 'http://localhost:5700/api/phones/DeletePhone',

    // phone type
    phonetypes: 'http://localhost:5700/api/phonetypes',
    phonetype: 'http://localhost:5700/api/phonetypes/',
    updatephonetype: 'http://localhost:5700/api/phonetypes/PutPhoneType',
    addphonetype: 'http://localhost:5700/api/phonetypes/PostPhoneType',
    deletephonetype: 'http://localhost:5700/api/phonetypes/DeletePhoneType',

   // email
    emails: 'http://localhost:5700/api/emails',
    email: 'http://localhost:5700/api/emails/',
    emailsbytraderid: 'http://localhost:5700/api/emails/GetEmailsByTraderId',
    preferredemail: 'http://localhost:5700/api/emails/GetPreferredEmail',
    updateemail: 'http://localhost:5700/api/emails/PutEmail',
    addemail: 'http://localhost:5700/api/emails/PostEmail',
    deleteemail: 'http://localhost:5700/api/emails/DeleteEmail',

    // email type
    emailtypes: 'http://localhost:5700/api/emailtypes',
    emailtype: 'http://localhost:5700/api/emailtypes/',
    updateemailtype: 'http://localhost:5700/api/emailtypes/PutEmailType',
    addemailtype: 'http://localhost:5700/api/emailtypes/PostEmailType',
    deleteemailtype: 'http://localhost:5700/api/emailtypes/DeleteEmailType',
  
    // social network
    socialnetworks: 'http://localhost:5700/api/socialnetworks',
    socialnetwork: 'http://localhost:5700/api/socialnetworks/',
    socialnetworksbytraderid: 'http://localhost:5700/api/socialnetworks/GetSocialNetworksByTraderId',
    preferredsocialnetwork: 'http://localhost:5700/api/socialnetworks/GetPreferredSocialNetwork',
    updatesocialnetwork: 'http://localhost:5700/api/socialnetworks/PutSocialNetwork',
    addsocialnetwork: 'http://localhost:5700/api/socialnetworks/PostSocialNetwork',
    deletesocialnetwork: 'http://localhost:5700/api/socialnetworks/DeleteSocialNetwork',

    // socila network type
    socialnetworktypes: 'http://localhost:5700/api/socialnetworktypes',
    socialnetworktype: 'http://localhost:5700/api/socialnetworktypes/',
    updatesocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/PutSocialNetworkType',
    addsocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/PostSocialNetworkType',
    deletesocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/DeleteSocialNetworkType',

    // uploads
    uploadFileUrl: 'http://localhost:5700/api/uploads/UploadFile',
    imagesPathUrl: 'http://localhost:5700/uploads/images/',


  }
}
