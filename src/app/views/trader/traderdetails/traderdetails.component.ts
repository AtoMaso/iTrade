import { Component, OnInit, NgModule, VERSION, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { EmailsService } from '../../../services/emails/emails.service';
import { PhonesService } from '../../../services/phones/phones.service';
import { SocialNetworksService } from '../../../services/socialnetworks/social-networks.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { AddressService } from '../../../services/address/address.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

import { UserSession, UserIdentity, Authentication, Trade, PageTitle, PersonalDetails, Address, Phone, Email, SocialNetwork } from '../../../helpers/classes';

@Component({
  selector: 'app-traderdetails',
  templateUrl: './traderdetails.component.html',
  styleUrls: ['./traderdetails.component.scss']
})
export class TraderDetailsComponent implements OnInit {

  public traderId: string;
  public session: UserSession;
  public isRequesting: boolean = false;
 
  public personal: PersonalDetails = new PersonalDetails();
  public emails: Email[] = [];
  public phones: Phone[] = [];
  public socialnetworks: SocialNetwork[] = [];
  public addresses: Address[] = [];

  public hasPersonal: boolean = false;
  public hasEmails: boolean = false;
  public hasPhones: boolean = false;
  public hasSocials: boolean = false;
  public hasTrades: boolean = false;
  public hasHistory: boolean = false;
  public hasAddress: boolean = false;
  public hasMiddleName: boolean = false;
  public isNewLoad: boolean = false;
  public isNewLoadHis: boolean = false;

  public prefEmail: Email= new Email();
  public prefPhone: Phone = new Phone();
  public prefSocial: SocialNetwork = new SocialNetwork();
  public prefAddress: Address = new Address();

  constructor(    
    private personalService: PersonalDetailsService,
    private emailsService: EmailsService,
    private phonesService: PhonesService,
    private socialslNetworksService: SocialNetworksService,
    private tradeService: TradeApiService,    
    private addressService: AddressService,
    private route: ActivatedRoute,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) { }


  public ngOnInit() {

    this.route.queryParams.subscribe(params => { this.traderId = params['id']; });

    this.getUserSession();

    this.initialiseComponent();

    this.getPersonalDetails(this.traderId);

  }


 // toggling done with jquery
  public ngAfterViewInit() {

    setTimeout(() => {

      jQuery(document).ready(function () {

        jQuery("#collapsePersonal").on("hide.bs.collapse", function () {
          jQuery(".personal").html('<span class="glyphicon glyphicon-plus"></span> <span class="smalltext text-uppercase textlightcoral"> Personal Details</span>');
        });
        jQuery("#collapsePersonal").on("show.bs.collapse", function () {
          jQuery(".personal").html('<span class="glyphicon glyphicon-minus"></span> <span class="smalltext text-uppercase textlightcoral"> Personal Details</span>');
        });

        jQuery("#collapseContact").on("hide.bs.collapse", function () {
          jQuery(".contact").html('<span class="glyphicon glyphicon-plus"></span> <span class="smalltext text-uppercase textlightcoral"> Contact Details</span>');
        });
        jQuery("#collapseContact").on("show.bs.collapse", function () {
          jQuery(".contact").html('<span class="glyphicon glyphicon-minus"></span> <span class="smalltext text-uppercase textlightcoral"> Contact Details</span>');
        });

        jQuery("#collapseTrades").on("hide.bs.collapse", function () {
          jQuery(".currenttrades").html('<span class="glyphicon glyphicon-plus"></span> Current Trades');
        });
        jQuery("#collapseTrades").on("show.bs.collapse", function () {
          jQuery(".currenttrades").html('<span class="glyphicon glyphicon-minus"></span> Current Trades');
        });

        jQuery("#collapseHistory").on("hide.bs.collapse", function () {
          jQuery(".tradinghistory").html('<span class="glyphicon glyphicon-plus"></span> Trading History');
        });
        jQuery("#collapseHistory").on("show.bs.collapse", function () {
          jQuery(".tradinghistory").html('<span class="glyphicon glyphicon-minus"></span> Trading History');
        });

      });

    }, 50);
  }



  //***********************************************************
  // GET Personal Details
  //***********************************************************
  public getPersonalDetails(traderId) {
    this.isRequesting = true;  

    this.personalService.getPersonalDetailsByTraderId(traderId)
      .subscribe((returnedPersonalDetails: PersonalDetails) => {
        this.onSuccessPersonal(returnedPersonalDetails);    
      },
      (res: Response) => this.onError(res, "getPersonalDetails"));
  }


  public onSuccessPersonal(personal: PersonalDetails) {
    if (personal.id === 0) { this.hasPersonal = false; }
    else {
      this.personal = this.TransformDataPersonal(personal);
      this.hasPersonal = true;      
    }             
    // call now get addresses 
    this.gePreferredAddress(this.traderId);
  }


  public gePreferredAddress(traderId: string) {

    this.addressService.getPreferredAddress(traderId, "Yes")
      .subscribe((addressResult: Address) => {
        this.onSuccessAddresses(addressResult);
       
      }, (serviceError: Response) => this.onError(serviceError, "getAddresses"));
  }


  public onSuccessAddresses(address: Address) {
     // handles the zero record
    if (address.id == 0 ) { this.hasAddress = false; }
    else {
      this.prefAddress = address;
      this.hasAddress = true;    
    }
  
    // get contact details
    this.getPreferredEmails(this.traderId);
  }


  //***********************************************************
  // GET Contact Details 
  //***********************************************************
  public getPreferredEmails(traderId) {

    this.emailsService.getPreferredEmail(traderId, "Yes")
      .subscribe((returnedEmail:Email) => {
        this.onSuccessEmail(returnedEmail);
      },
      (res: Response) => this.onError(res, "getPreferredEmail"));
  }


  public onSuccessEmail(email: Email) {
    // new phone is returned when there is no record in a webapi
    if (email.id == 0) { this.hasEmails = false; }
    else {
      this.prefEmail = email;
      this.hasEmails = true;
    }

    // now call the get phones
    this.getPreferredPhone(this.traderId);
  }


  public getPreferredPhone(traderId) {
    this.phonesService.getPreferredPhone(traderId, "Yes")
      .subscribe((returnedPhone: Phone) => {
        this.onSuccessPhones(returnedPhone);
      },
      (res: Response) => this.onError(res, "getPreferredPhone"));
  }


  public onSuccessPhones(phone: Phone) {
      // handles the zero record
    if (phone.id == 0) { this.hasPhones = false; }
    else {
      this.prefPhone = phone;   
      this.hasPhones = true;
    }

    // now get the social networks
    this.getPreferredSocial(this.traderId);  
  }


  public getPreferredSocial(traderId) {
    this.socialslNetworksService.getPreferredSocialNetwork(traderId, "Yes")
      .subscribe((returnedSocial: SocialNetwork) => {
        this.onSuccessSocial(returnedSocial);
      },
      (res: Response) => this.onError(res, "getPreferredSocialNetwork"));
  }


  public onSuccessSocial(social: SocialNetwork) {
  
    // handles the zero record
    if (social.id == 0) { this.hasSocials = false; }
    else {
      this.prefSocial = social;     
      this.hasSocials = true;
      }  

    // now call the get trades
    this.getTradesCurrent(this.traderId);
  }


 //***********************************************************
 // GET Trades 
 //***********************************************************
  public getTradesCurrent(traderId: string, status: string = "Open") {

    this.tradeService.getTradesWithStatusOrAll(traderId, status)
      .subscribe((returnedTrades: Trade[]) => {
        this.onSuccessTrades(returnedTrades);
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  public onSuccessTrades(trades: Trade[]) {
   
    if (trades.length === 0) { this.hasTrades = false; }
    else {
        this.data = this.TransformData(trades),
        this.hasTrades = true,
        this.isNewLoad = true;
        this.onChangeTable(this.config),
        this.onPageChange(1)
    }

    // now call the history
    this.getTradesHistory(this.traderId);   
  }



 //***********************************************************
 // GET Trade History
 //***********************************************************
  public getTradesHistory(traderId: string, status: string = "Closed") {

    this.isRequesting = false; // finish requesting

    this.tradeService.getTradesWithStatusOrAll(traderId, status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) { this.hasHistory = false; }
        else {
          this.dataHis = this.TransformData(returnedTrades),          
            this.hasHistory = true;
            this.isNewLoadHis = true;
            this.onChangeTableHis(this.configHis),
            this.onPageChangeHis(1)
        }
      },
      (res: Response) => this.onError(res, "getTrades"));
  }

 

  //*****************************************************
  // HELPER METHODS 
  //*****************************************************
  public getUserSession() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])        
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  public initialiseComponent() { 
    this.pageTitleService.emitPageTitle(new PageTitle("Trader Details"));    
    this.messagesService.emitRoute("nill");
  }


  public TransformData(returnedTrades: Trade[]): Array<any> {

    let transformedData = new Array<Trade>();

    returnedTrades.forEach(function (value) {
      let trd = new Trade;

      trd.total = value.total;
      trd.tradeIdStr = value.tradeId.toString();
      trd.tradeId = value.tradeId;      
      trd.name = value.name;
      trd.description = value.description;
      trd.category = value.category;
      trd.datePublished = value.datePublished;
      trd.status = value.status;
      trd.tradeFor = value.tradeFor;        
      trd.place = value.place;
      trd.state = value.state;

      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;

      transformedData.push(trd);

    });
    return transformedData;
  }


  public TransformDataPersonal(returnedPersonalDetails: PersonalDetails): PersonalDetails {

    let pd = new PersonalDetails;  

    pd.firstName = returnedPersonalDetails.firstName;
    pd.middleName = returnedPersonalDetails.middleName;
    pd.lastName = returnedPersonalDetails.lastName;
    pd.traderId = returnedPersonalDetails.traderId;
    pd.id = returnedPersonalDetails.id;
     
    if (pd.middleName.length === 0) { this.hasMiddleName = false; }
    else { this.hasMiddleName = true; }
     
    return pd;;
  }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  public onError(serviceError: any, operation: string) {

    this.isRequesting = false;
    let message: string = "";

    // audit log the error passed
    this.loggerService.addError(serviceError, `${operation} failed: ${serviceError.message},  the URL: ${serviceError.url}, was:  ${serviceError.statusText}`);

    // PME used to pass the message 
    if (serviceError.error === undefined) {

      var data = serviceError.json();

      if (data.ModelState !== undefined) {

        for (var key in data.ModelState) {
          for (var i = 0; i < data.ModelState[key].length; i++) {

            if (message == null) { message = data.ModelState[key][i]; }
            else { message = message + data.ModelState[key][i]; }
          }
        }
      }
      this.messagesService.emitProcessMessage("PME", message);
    }
    else if (serviceError.error.ModelState !== undefined) { this.messagesService.emitProcessMessage("PME", serviceError.error.ModelState.Message); }
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error.Message); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error
  }
 



  /**********************************************/
  //trade section
  /***********************************************/
  public isIdAsc = true;
  public isTradeIdAsc = true;
  public isDateAsc = true;
  public isStatusAsc = true;

  public sortId: string = 'desc'
  public sortTradeId: string = 'desc';
  public sortStatus: string = 'desc';
  public sortDate: string = 'desc';

  public data: Array<any> = [];     // full data from the server
  public rows: Array<any> = [];      // rows passed to the table
  public maxSize: number = 5;
  public numPages: number = 1;

  public columns: Array<any> =
  [
    { title: 'Published', name: 'datePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade date.' } },
    { title: 'Action', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade status.' } }
  ];


  public config: any = {
    id: 'pagination',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columns },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  public onPageChange(passedpage: number) {

    this.config.currentPage = passedpage;
  }


  public onChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.config.sorting, config.sorting);
    }

    if (!this.isNewLoad) {
            let filteredData = this.changeFilter(this.data, this.config);
            let sortedData = this.changeSort(filteredData, this.config);
            this.rows = sortedData;
            this.config.totalItems = sortedData.length;
    } else {
            this.rows = this.data;
            this.config.totalItems = this.data.length;
            this.isNewLoad = false;
    }    
  }


  public sortTable(column: string) {
    // reset the array of columns
    this.config.sorting.columns = [];

    switch (column) {

      case 'datePublished':
        this.config.sorting.columns = [{ name: 'datePublished', sort: this.sortDate }];
        this.onChangeTable(this.config);
        this.isDateAsc = !this.isDateAsc;
        this.sortDate = this.isDateAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.config.sorting.columns = [{ name: 'status', sort: this.sortStatus }];
        this.onChangeTable(this.config);
        this.isStatusAsc = !this.isStatusAsc;
        this.sortStatus = this.isStatusAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilter(data: any, config: any): any {

          let filteredData: Array<any> = data;

          this.columns.forEach((column: any) => {

            if (column.filtering) {
                filteredData = filteredData.filter((item: any) => {
                      return item[column.name].match(column.filtering.filterString);
              });
            }

          });

          if (!config.filtering) {
            return filteredData;
          }

          if (config.filtering.columnName) {
            return filteredData.filter((item: any) => item[config.filtering.columnName].match(this.config.filtering.filterString));
          }

          let tempArray: Array<any> = [];
          filteredData.forEach((item: any) => {

              // find the string in each coloumn
              let flag = false;
            this.columns.forEach((column: any) => { if (item[column.name].toString().toLowerCase().match(this.config.filtering.filterString.str.toLowerCase())) { flag = true; }  });
              if (flag) { tempArray.push(item); }

          });

          filteredData = tempArray;

          return filteredData;
  }


  public changeSort(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.config.sorting.columns || [];
    let columnName: string = null;
    let sort: string = null;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort != '') {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }
    if (!columnName) {
      return data;
    }

    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }





  /**********************************************/
  //trade history section
  /***********************************************/
  public isIdHisAsc = true;
  public isTradeIdHisAsc = true;
  public isDateHisAsc = true;
  public isStatusHisAsc = true;

  public sortIdHis: string = 'desc'
  public sortTradeIdHis: string = 'desc';
  public sortStatusHis: string = 'desc';
  public sortDateHis: string = 'desc';

  public dataHis: Array<any> = [];     // full data from the server
  public rowsHis: Array<any> = [];      // rows passed to the table
  public maxSizeHis: number = 5;
  public numPagesHis: number = 1;

  public columnsHis: Array<any> =
  [
    { title: 'Published', name: 'datePublished', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade date.' } },
    { title: 'Action', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by trade status.' } }
  ];


  public configHis: any = {
    id: 'paginationHis',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsHis },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  public onPageChangeHis(passedpage: number) {

    this.configHis.currentPage = passedpage;
  }


  public onChangeTableHis(config: any, page: any = { page: this.configHis.currentPage, itemsPerPage: this.configHis.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configHis.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configHis.sorting, config.sorting);
    }


    if (!this.isNewLoadHis) {
      let filteredData = this.changeFilterHis(this.dataHis, this.configHis);
      let sortedData = this.changeSortHis(filteredData, this.configHis);
      this.rowsHis = sortedData;
      this.configHis.totalItems = sortedData.length;
    } else {
      this.rowsHis = this.dataHis;
      this.configHis.totalItems = this.dataHis.length;
      this.isNewLoadHis = false;
    }    
  }


  public sortTableHis(column: string) {
    // reset the array of columns
    this.configHis.sorting.columns = [];

    switch (column) {

      case 'datePublished':
        this.configHis.sorting.columns = [{ name: 'datePublished', sort: this.sortDateHis }];
        this.onChangeTableHis(this.configHis);
        this.isDateHisAsc = !this.isDateHisAsc;
        this.sortDateHis = this.isDateHisAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configHis.sorting.columns = [{ name: 'status', sort: this.sortStatusHis }];
        this.onChangeTableHis(this.configHis);
        this.isStatusHisAsc = !this.isStatusHisAsc;
        this.sortStatusHis = this.isStatusHisAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterHis(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsHis.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configHis.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsHis.forEach((column: any) => {
        if (item[column.name].toString().match(this.configHis.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  public changeSortHis(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configHis.sorting.columns || [];
    let columnName: string = null;
    let sort: string = null;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort != '') {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }
    if (!columnName) {
      return data;
    }

    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

}
