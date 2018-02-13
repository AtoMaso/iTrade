export let CONFIG = {

    debugKeys: {
      debugOn: false,   
    },

  baseUrls: {
  
  servicebase: 'http://localhost:5700/',
  accounts: 'http://localhost:5700/api/account/',

    //trades
    alltrades: 'http://localhost:5700/api/trades',
    alltradesWithStatus: 'http://localhost:5700/api/trades/GetAllTradesWithStatus',

    filteredtradeswithstatus: 'http://localhost:5700/api/trades/GetFilteredTradesWithStatus',
    filteredtradesall: 'http://localhost:5700/api/trades/GetFilteredTradesAll',

    tradesbytraderidwithstatus: 'http://localhost:5700/api/trades/GetTradesByTraderIdWithStatus',
    tradesbytraderid: 'http://localhost:5700/api/trades/GetTradesByTraderId',

    pagesoftradeswithstatus: 'http://localhost:5700/api/trades/GetPagesOfTradesWithStatus',
    pagesoftradesall: 'http://localhost:5700/api/trades/GetPagesOfTradesAll',

    trade: 'http://localhost:5700/api/trades/',
    updatetrade: 'http://localhost:5700/api/trades/PutTrade',
    addtrade: 'http://localhost:5700/api/trades/PostTrade',
    removetrade: 'http://localhost:5700/api/trades/DeleteTrade',

    // trade history
    tradehistories: 'http://localhost:5700/api/tradehistories',
    pagesoftradehistories: 'http://localhost:5700/api/tradehistories/GetPagesOfTradeHistories',
    tradehistory: 'http://localhost:5700/api/tradehistories/',
    updatetradehistory: 'http://localhost:5700/api/tradehistories/puttradehistory',
    addtradehistory: 'http://localhost:5700/api/tradehistories/posttradehistory',
    removetradehistory: 'http://localhost:5700/api/tradehistories/deletedradehistory',

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
    corresbytraderid: 'http://localhost:5700/api/correspondences/GetCorrespondencesByTraderId',
    corresbytraderidwithstatus: 'http://localhost:5700/api/correspondences/GetCorrespondencesByTraderIdWithStatus',

    singlecorres: 'http://localhost:5700/api/correspondences/',
    updatecorres: 'http://localhost:5700/api/images/putcorrespondence',
    addcorres: 'http://localhost:5700/api/images/postcorrespondences',
    removecorres: 'http://localhost:5700/api/images/deletecorrespondence',

    // trade object
    tradeobjects: 'http://localhost:5700/api/tradeobjects',
    tradeobject: 'http://localhost:5700/api/tradeobjects/',
    updatetradeobject: 'http://localhost:5700/api/tradeobjects/puttradeobject',
    addtradeobject: 'http://localhost:5700/api/tradeobjects/posttradeobject',
    removetradeobjects: 'http://localhost:5700/api/tradeobjects/deletedradeobject',

    // trade for objects
    tradeforobjects: 'http://localhost:5700/api/tradeforobjects',
    tradeforobject: 'http://localhost:5700/api/tradeforobjects/',
    updatetradeforobject: 'http://localhost:5700/api/tradeforobjects/puttradeforobject',
    addtradeforobject: 'http://localhost:5700/api/tradeforobjects/posttradeforobject',
    removetradeforobjects: 'http://localhost:5700/api/tradeforobjects/deletedradeforobject',
 
    // category
    categories: 'http://localhost:5700/api/categories',
    category: 'http://localhost:5700/api/categories/',
    updatecategory: 'http://localhost:5700/api/objectcategories/putcategory',
    addcategory: 'http://localhost:5700/api/objectcategories/postcategory',
    removecategory: 'http://localhost:5700/api/objectcategories/deletecategory',

   //traders
    traders: 'http://localhost:5700/api/account/GetTraders',
    trader: 'http://localhost:5700/api/account/GetTraders/',
    updatetrader: 'http://localhost:5700/api/account/puttrader',
    addtrader: 'http://localhost:5700/api/account/posttrader',
    removetrader: 'http://localhost:5700/api/account/deletetrader',

    // contact details
    contactdetails: 'http://localhost:5700/api/contactdetails',
    contactdetailsbytraderid: 'http://localhost:5700/api/contactdetails/GetContactDetailsByTraderId',
    contactdetail: 'http://localhost:5700/api/contactdetails/',
    updatecontactdetail: 'http://localhost:5700/api/contactdetails/putcontactdetail',
    addcontactdetail: 'http://localhost:5700/api/contactdetails/postcontactdetail',
    removecontactdetail: 'http://localhost:5700/apicontactdetails/deletecontactdetail',

    // personal details
    personaldetails: 'http://localhost:5700/api/personaldetails',
    personaldetailsbytraderid: 'http://localhost:5700/api/personaldetails/GetPersonalDetailsByTraderId',    
    personaldetail: 'http://localhost:5700/api/personaldetails/',
    updatepersonaldetail: 'http://localhost:5700/api/personaldetails/putpersonaldetail',
    addpersonaldetail: 'http://localhost:5700/api/personaldetails/postpersonaldetails',
    removepersonaldetail: 'http://localhost:5700/personaldetails/deletepersonaldetail',
  
    // security details
    securitydetails: 'http://localhost:5700/api/securitydetails',
    securitydetail: 'http://localhost:5700/api/personaldetails/',
    updatesecuritydetail: 'http://localhost:5700/api/securitydetails/putsecuritydetail',
    addsecuritydetail: 'http://localhost:5700/api/securitydetails/postsecuritydetails',
    removesecuritydetail: 'http://localhost:5700/securitydetails/deletesecuritydetail',

    // address
    addresses: 'http://localhost:5700/api/addresses',
    address: 'http://localhost:5700/api/addresses/',
    updateaddress: 'http://localhost:5700/api/addresses/putaddress',
    addaddress: 'http://localhost:5700/api/addresses/postaddress',
    removeaddress: 'http://localhost:5700/api/addresses/deleteaddress',

    // address type
    addresstypes: 'http://localhost:5700/api/addresstypes',
    addresstype: 'http://localhost:5700/api/addresstypes/',
    updateaddresstype: 'http://localhost:5700/api/addresstypes/putaddresstype',
    addaddresstype: 'http://localhost:5700/api/addrestypes/postaddresstype',
    removeaddresstype: 'http://localhost:5700/api/addresstypes/deleteaddress',
  
    // process message
    messages: 'http://localhost:5700/api/processmessages',
    message: 'http://localhost:5700/api/processmessages/',
    updatemessage: 'http://localhost:5700/api/processmessages/putprocessmessage',
    addmessage: 'http://localhost:5700/api/processmessages/postprocessmessage',
    removemessage: 'http://localhost:5700/api/processmessages/deleteprocessmessage',
 
    // process message type
    messagetypes: 'http://localhost:5700/api/processmessagetypes',
    messagetype: 'http://localhost:5700/api/processmessagetypes/',
    updatemessagetype: 'http://localhost:5700/api/processmessagetypes/putprocessmessagetype',
    addmessagetype: 'http://localhost:5700/api/processmessagetypes/postprocessmessagetype',
    removemessagetype: 'http://localhost:5700/api/processmessagetypes/deleteprocessmessagetype',

    // phone
    phones: 'http://localhost:5700/api/phones',
    phone: 'http://localhost:5700/api/phones/',
    updatephone: 'http://localhost:5700/api/phones/putphone',
    addphone: 'http://localhost:5700/api/phones/postphone',
    removephone: 'http://localhost:5700/api/phones/deletephone',

    // phone type
    phonetypes: 'http://localhost:5700/api/phonetypes',
    phonetype: 'http://localhost:5700/api/phonetypes/',
    updatephonetype: 'http://localhost:5700/api/phonetypes/putphonetype',
    addphonetype: 'http://localhost:5700/api/phonetypes/postphonetype',
    removephonetype: 'http://localhost:5700/api/phonetypes/deletephonetype',

   // email
    emails: 'http://localhost:5700/api/emails',
    email: 'http://localhost:5700/api/emails/',
    updateemail: 'http://localhost:5700/api/emails/putemail',
    addemail: 'http://localhost:5700/api/emails/postemail',
    removeemail: 'http://localhost:5700/api/emails/deleteemail',

    // email type
    emailtypes: 'http://localhost:5700/api/emailtypes',
    emailtype: 'http://localhost:5700/api/emailtypes/',
    updateemailtype: 'http://localhost:5700/api/emailtypes/putemailtype',
    addemailtype: 'http://localhost:5700/api/emailtypes/postemailtype',
    removeemailtype: 'http://localhost:5700/api/emailtypes/deleteemailtype',
  
    // social network
    socialnetworks: 'http://localhost:5700/api/socialnetworks',
    socialnetwork: 'http://localhost:5700/api/socialnetworks/',
    updatesocialnetwork: 'http://localhost:5700/api/socialnetworks/putsocialnetwork',
    addsocialnetwork: 'http://localhost:5700/api/socialnetworks/postsocialnetwork',
    removesocialnetwork: 'http://localhost:5700/api/socialnetworks/deletesocialnetwork',

    // socila network type
    socialnetworktypes: 'http://localhost:5700/api/socialnetworktypes',
    socialnetworktype: 'http://localhost:5700/api/socialnetworktypes/',
    updatesocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/putsocialnetworktype',
    addsocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/postsocialnetworktype',
    removesocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/deletesocialnetworktype',

    // security answers
    securityanswers: 'http://localhost:5700/api/securityanswers',
    securityanswer: 'http://localhost:5700/api/securityanswers/',
    updatesecurityanswer: 'http://localhost:5700/api/securityanswers/putsecurityanswer',
    addsecurityanswer: 'http://localhost:5700/api/securityanswers/postsecurityanswer',
    removesecurityanswer: 'http://localhost:5700/api/securityanswers/deletesecurityanswer',

    // security questions
    securityquestions: 'http://localhost:5700/api/securityquestions',
    securityquestion: 'http://localhost:5700/api/securityquestions/',
    updatesecurityquestion: 'http://localhost:5700/api/securityquestions/putsecurityquestion',
    addsecurityquestion: 'http://localhost:5700/api/securityquestions/postsecurityquestion',
    removesecurityquestion: 'http://localhost:5700/api/securityquestions/deletesecurityquestion',

    // uploads
    uploadFileUrl: 'http://localhost:5700/api/uploads/UploadFile',
    imagesPathUrl: 'http://localhost:5700/uploads/images/',
    
  }
}
