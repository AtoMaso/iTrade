export let CONFIG = {

    debugKeys: {
      debugOn: false,   
    },

  baseUrls: {
  
  servicebase: 'http://localhost:5700/',
  accounts: 'http://localhost:5700/api/account/',

  trades: 'http://localhost:5700/api/trades',
  trade: 'http://localhost:5700/api/trades/',
  updatetrade: 'http://localhost:5700/api/trades/puttrade',
  addtrade: 'http://localhost:5700/api/trades/tosttrade',
  removetrade: 'http://localhost:5700/api/trades/deletedrade',

  tradeobjects: 'http://localhost:5700/api/tradeobjects',
  tradeobject: 'http://localhost:5700/api/tradeobjects/',
  updatetradeobject: 'http://localhost:5700/api/tradeobjects/puttradeobject',
  addtradeobject: 'http://localhost:5700/api/tradeobjects/tosttradeobject',
  removetradeobjects: 'http://localhost:5700/api/tradeobjects/deletedradeobject',

  tradeforobjects: 'http://localhost:5700/api/tradeforobjects',
  tradeforobject: 'http://localhost:5700/api/tradeforobjects/',
  updatetradeforobject: 'http://localhost:5700/api/tradeforobjects/puttradeforobject',
  addtradeforobject: 'http://localhost:5700/api/tradeforobjects/tosttradeforobject',
  removetradeforobjects: 'http://localhost:5700/api/tradeforobjects/deletedradeforobject',

  images: 'http://localhost:5700/api/images',
  image: 'http://localhost:5700/api/images/',
  updateimage: 'http://localhost:5700/api/images/putimage',
  addimage: 'http://localhost:5700/api/images/postimage',
  removeimage: 'http://localhost:5700/api/images/deleteimage',

  categories: 'http://localhost:5700/api/objectcategories',
  category: 'http://localhost:5700/api/objectcategories/',
  updatecategory: 'http://localhost:5700/api/objectcategories/putobjectcategory',
  addcategory: 'http://localhost:5700/api/objectcategories/postobjectcategory',
  removecategory: 'http://localhost:5700/api/objectcategories/deleteobjectcategory',

  traders: 'http://localhost:5700/api/account/gettraders',
  trader: 'http://localhost:5700/api/account/gettraders/',
  updatetrader: 'http://localhost:5700/api/account/puttrader',
  addtrader: 'http://localhost:5700/api/account/posttrader',
  removetrader: 'http://localhost:5700/api/account/deletetrader',

  contactdetails: 'http://localhost:5700/api/contactdetails',
  contactdetail: 'http://localhost:5700/api/contactdetails/',
  updatecontactdetail: 'http://localhost:5700/api/contactdetails/putcontactdetail',
  addcontactdetail: 'http://localhost:5700/api/contactdetails/postcontactdetail',
  removecontactdetail: 'http://localhost:5700/apicontactdetails/deletecontactdetail',

  personaldetails: 'http://localhost:5700/api/personaldetails',
  personaldetail: 'http://localhost:5700/api/personaldetails/',
  updatepersonaldetail: 'http://localhost:5700/api/personaldetails/putpersonaldetail',
  addpersonaldetail: 'http://localhost:5700/api/personaldetails/postpersonaldetails',
  removepersonaldetail: 'http://localhost:5700/personaldetails/deletepersonaldetail',

  securitydetails: 'http://localhost:5700/api/securitydetails',
  securitydetail: 'http://localhost:5700/api/personaldetails/',
  updatesecuritydetail: 'http://localhost:5700/api/securitydetails/putsecuritydetail',
  addsecuritydetail: 'http://localhost:5700/api/securitydetails/postsecuritydetails',
  removesecuritydetail: 'http://localhost:5700/securitydetails/deletesecuritydetail',

  addresses: 'http://localhost:5700/api/addresses',
  address:'http://localhost:5700/api/addresses/',
  updateaddress: 'http://localhost:5700/api/addresses/putaddress',
  addaddress: 'http://localhost:5700/api/addresses/postaddress',
  removeaddress: 'http://localhost:5700/api/addresses/deleteaddress',

  addresstypes: 'http://localhost:5700/api/addresstypes',
  addresstype: 'http://localhost:5700/api/addresstypes/',
  updateaddresstype: 'http://localhost:5700/api/addresstypes/putaddresstype',
  addaddresstype: 'http://localhost:5700/api/addrestypes/postaddresstype',
  removeaddresstype: 'http://localhost:5700/api/addresstypes/deleteaddress',

  messages: 'http://localhost:5700/api/processmessages',
  message: 'http://localhost:5700/api/processmessages/',
  updatemessage: 'http://localhost:5700/api/processmessages/putprocessmessage',
  addmessage: 'http://localhost:5700/api/processmessages/postprocessmessage',
  removemessage: 'http://localhost:5700/api/processmessages/deleteprocessmessage',

  messagetypes: 'http://localhost:5700/api/processmessagetypes',
  messagetype: 'http://localhost:5700/api/processmessagetypes/',
  updatemessagetype: 'http://localhost:5700/api/processmessagetypes/putprocessmessagetype',
  addmessagetype: 'http://localhost:5700/api/processmessagetypes/postprocessmessagetype',
  removemessagetype: 'http://localhost:5700/api/processmessagetypes/deleteprocessmessagetype',

  phones: 'http://localhost:5700/api/phones',
  phone: 'http://localhost:5700/api/phones/',
  updatephone: 'http://localhost:5700/api/phones/putphone',
  addphone: 'http://localhost:5700/api/phones/postphone',
  removephone: 'http://localhost:5700/api/phones/deletephone',

  phonetypes: 'http://localhost:5700/api/phonetypes',
  phonetype: 'http://localhost:5700/api/phonetypes/',
  updatephonetype: 'http://localhost:5700/api/phonetypes/putphonetype',
  addphonetype: 'http://localhost:5700/api/phonetypes/postphonetype',
  removephonetype: 'http://localhost:5700/api/phonetypes/deletephonetype',

  emails: 'http://localhost:5700/api/emails',
  email: 'http://localhost:5700/api/emails/',
  updateemail: 'http://localhost:5700/api/emails/putemail',
  addemail: 'http://localhost:5700/api/emails/postemail',
  removeemail: 'http://localhost:5700/api/emails/deleteemail',

  emailtypes: 'http://localhost:5700/api/emailtypes',
  emailtype: 'http://localhost:5700/api/emailtypes/',
  updateemailtype: 'http://localhost:5700/api/emailtypes/putemailtype',
  addemailtype: 'http://localhost:5700/api/emailtypes/postemailtype',
  removeemailtype: 'http://localhost:5700/api/emailtypes/deleteemailtype',

  socialnetworks: 'http://localhost:5700/api/socialnetworks',
  socialnetwork: 'http://localhost:5700/api/socialnetworks/',
  updatesocialnetwork: 'http://localhost:5700/api/socialnetworks/putsocialnetwork',
  addsocialnetwork: 'http://localhost:5700/api/socialnetworks/postsocialnetwork',
  removesocialnetwork: 'http://localhost:5700/api/socialnetworks/deletesocialnetwork',

  socialnetworktypes: 'http://localhost:5700/api/socialnetworktypes',
  socialnetworktype: 'http://localhost:5700/api/socialnetworktypes/',
  updatesocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/putsocialnetworktype',
  addsocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/postsocialnetworktype',
  removesocialnetworktype: 'http://localhost:5700/api/socialnetworktypes/deletesocialnetworktype',

  securityanswers: 'http://localhost:5700/api/securityanswers',
  securityanswer: 'http://localhost:5700/api/securityanswers/',
  updatesecurityanswer: 'http://localhost:5700/api/securityanswers/putsecurityanswer',
  addsecurityanswer: 'http://localhost:5700/api/securityanswers/postsecurityanswer',
  removesecurityanswer: 'http://localhost:5700/api/securityanswers/deletesecurityanswer',

  securityquestions: 'http://localhost:5700/api/securityquestions',
  securityquestion: 'http://localhost:5700/api/securityquestions/',
  updatesecurityquestion: 'http://localhost:5700/api/securityquestions/putsecurityquestion',
  addsecurityquestion: 'http://localhost:5700/api/securityquestions/postsecurityquestion',
  removesecurityquestion: 'http://localhost:5700/api/securityquestions/deletesecurityquestion',

  uploads: 'http://localhost:5700/api/uploads',
  uploadsattach: 'http://localhost:5700/api/attachements',
  uploadsphysical: 'http://localhost:5700/uploads'
  }
}
