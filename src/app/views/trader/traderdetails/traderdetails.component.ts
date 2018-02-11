import { Component, OnInit, NgModule, VERSION, AfterViewInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

import { PersonalDetailsService } from '../../../services/personaldetails/personaldetails.service';
import { ContactDetailsService } from '../../../services/contactdetails/contactdetails.service';
import { TradeApiService } from '../../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';

import { UserSession, UserIdentity, Authentication, Trade, PageTitle, PersonalDetails, ContactDetails, Address, Phone, Email, SocialNetwork } from '../../../helpers/classes';

@Component({
  selector: 'app-traderdetails',
  templateUrl: './traderdetails.component.html',
  styleUrls: ['./traderdetails.component.scss']
})
export class TraderDetailsComponent implements OnInit {

  private traderId: string;
  private session: UserSession;
  private identity: UserIdentity = new UserIdentity;
  private isRequesting: boolean = false;
  private isAuthenticated: boolean = false; 
 
  private personal: PersonalDetails = new PersonalDetails();
  private contact: ContactDetails = new ContactDetails();

  private hasPersonal: boolean = true;
  private hasContact: boolean = true;
  private hasTrades: boolean = false;
  private hasHistory: boolean = false;
  private hasAddress: boolean = false;
  private hasMiddleName: boolean = false;


  constructor(    
    private personalService: PersonalDetailsService,
    private contactService: ContactDetailsService,
    private tradeService: TradeApiService,    
    private route: ActivatedRoute,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) { }


  ngOnInit() {

    this.route.queryParams.subscribe(params => { this.traderId = params['id']; });

    this.getUseridentity();

    this.initialiseComponent();

    this.getPersonalDetails(this.traderId);

    this.getContactDetails(this.traderId) 

    this.getTradesCurrent(this.traderId);

    this.getTradesHistory(this.traderId);

  }


  // toggling done with jquery
  ngAfterViewInit() {

    jQuery(document).ready(function () {


      jQuery("#collapsePersonal").on("hide.bs.collapse", function () {
           jQuery(".personal").html('<span class="glyphicon glyphicon-plus"></span> Personal Details');
      });
      jQuery("#collapsePersonal").on("show.bs.collapse", function () {
           jQuery(".personal").html('<span class="glyphicon glyphicon-minus"></span> Personal Details');
      });

      jQuery("#collapseContact").on("hide.bs.collapse", function () {
            jQuery(".contact").html('<span class="glyphicon glyphicon-plus"></span> Contact Details');
      });
      jQuery("#collapseContact").on("show.bs.collapse", function () {
            jQuery(".contact").html('<span class="glyphicon glyphicon-minus"></span> Contact Details');
      });

      jQuery("#collapseTrades").on("hide.bs.collapse", function () {
        jQuery(".currenttrades").html('<span class="glyphicon glyphicon-plus"></span> My Trades Status');
      });
      jQuery("#collapseTrades").on("show.bs.collapse", function () {
        jQuery(".currenttrades").html('<span class="glyphicon glyphicon-minus"></span> My Trades Status');
      });

      jQuery("#collapseHistory").on("hide.bs.collapse", function () {
        jQuery(".tradinghistory").html('<span class="glyphicon glyphicon-plus"></span> Trading History');
      });
      jQuery("#collapseHistory").on("show.bs.collapse", function () {
        jQuery(".tradinghistory").html('<span class="glyphicon glyphicon-minus"></span> Trading History');
      });

   

    });
  }




  //**************************************************************************************
  // GET TRADES -- this will get all trades for the trader closed and open, if there are no any will show message
  //**************************************************************************************
  private getPersonalDetails(traderId) {
    this.personalService.getPersonalDetailsByTraderId(traderId)
      .subscribe((returnedPersonalDetails:PersonalDetails) => {
        if (returnedPersonalDetails === null) { this.hasPersonal = false; }
        else {
          this.personal = this.TransformDataPersonal(returnedPersonalDetails);
          this.hasPersonal = true;
        }             
      },
      (res: Response) => this.onError(res, "getPersonalDetails"));
  }


  private getContactDetails(traderId) {

    this.contactService.getContactDetailsByTraderId(traderId)
      .subscribe((returnedContactDetails:ContactDetails) => {
        if (returnedContactDetails === null) { this.hasContact = false; }
        else {
          this.contact = this.TransformDataContact(returnedContactDetails);
          this.hasContact = true;
        }
      },
      (res: Response) => this.onError(res, "getContactDetails"));
  }


  private getTradesCurrent(traderId: string, status: string = "Open") {

    this.tradeService.getTradesWithStatusOrAll(traderId, status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) { this.hasTrades = false; }
        else {
            this.data = this.TransformData(returnedTrades),
            this.hasTrades = true,
            this.onChangeTable(this.config),
            this.onPageChange(1)
        }
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  private getTradesHistory(traderId: string, status: string = "Closed") {

    this.tradeService.getTradesWithStatusOrAll(traderId, status)
      .subscribe((returnedTrades: Trade[]) => {
        if (returnedTrades.length === 0) { this.hasHistory = false; }
        else {
            this.dataHis = this.TransformData(returnedTrades),
            this.hasHistory = true,
            this.onChangeTableHis(this.configHis),
            this.onPageChangeHis(1)
        }
      },
      (res: Response) => this.onError(res, "getTrades"));

  }


  //*****************************************************
  // HELPER METHODS 
  //*****************************************************
  private getUseridentity() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.isAuthenticated = this.session.authentication.isAuthenticated;
        this.identity.roles = this.session.userIdentity.roles;     
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.isRequesting = true;  
    this.pageTitleService.emitPageTitle(new PageTitle("Trader Details"));    
    this.messagesService.emitRoute("nill");
  }


  private TransformData(returnedTrades: Trade[]): Array<any> {

    let transformedData = new Array<Trade>();

    returnedTrades.forEach(function (value) {
      let trd = new Trade;

      trd.total = value.total;
      trd.tradeIdStr = value.tradeId.toString();
      trd.tradeId = value.tradeId;
      trd.datePublished = value.datePublished;
      trd.status = value.status;
      trd.name = value.name;
      trd.description = value.description;
      trd.categoryDescription = value.categoryDescription;
      trd.tradeFor = value.tradeFor;        

      trd.traderId = value.traderId;
      trd.traderFirstName = value.traderFirstName;
      trd.traderMiddleName = value.traderMiddleName;
      trd.traderLastName = value.traderLastName;
      trd.traderFullName = trd.traderFirstName + " " + trd.traderMiddleName + " " + trd.traderLastName;

      transformedData.push(trd);

    });
    return transformedData;
  }


  private TransformDataPersonal(returnedPersonalDetails: PersonalDetails): PersonalDetails {

    let trd = new PersonalDetails;  

    trd.firstName = returnedPersonalDetails.firstName;
    trd.middleName = returnedPersonalDetails.middleName;
    trd.lastName = returnedPersonalDetails.lastName;
    trd.traderId = returnedPersonalDetails.traderId;
    trd.personalDetailsId = returnedPersonalDetails.personalDetailsId;
    trd.addresses = returnedPersonalDetails.addresses;
   
    returnedPersonalDetails.addresses.forEach(function (value) {
      if (value.preferred === "true") { trd.preferredAddress = value; }
    });    
    if (trd.addresses.length === 0) { this.hasAddress = false; }
    else { this.hasAddress = true; }
    if (trd.middleName.length === 0) { this.hasMiddleName = false; }
    else { this.hasMiddleName = true; }
     
    return trd;;
  }


  private TransformDataContact(returnedContactDetails: ContactDetails): ContactDetails {  

    let trd = new ContactDetails;

    trd.traderId = returnedContactDetails.traderId;
    trd.contactDetailsId = returnedContactDetails.contactDetailsId;

    trd.phones = returnedContactDetails.phones;
    returnedContactDetails.phones.forEach(function (value) {      
      if (value.preferred === "true") { trd.preferredPhone = value;}
    });    
  

    trd.emails = returnedContactDetails.emails;
    returnedContactDetails.emails.forEach(function (value) {
      if (value.preferred === "true") { trd.preferredEmail = value; }
    });     

    trd.socialNetworks = returnedContactDetails.socialNetworks;    
    returnedContactDetails.socialNetworks.forEach(function (value) {
      if (value.preferred === "true") { trd.preferredSocialNetwork = value; }
    });     

    return trd;
  }



  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

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
    else if (serviceError.error !== null) { this.messagesService.emitProcessMessage("PME", serviceError.error); }
    else { this.messagesService.emitProcessMessage("PMEUEO"); } // unexpected error
  }
 



  /**********************************************/
  //trade section
  /***********************************************/
  private isIdAsc = true;
  private isTradeIdAsc = true;
  private isDateAsc = true;
  private isStatusAsc = true;

  private sortId: string = 'desc'
  private sortTradeId: string = 'desc';
  private sortStatus: string = 'desc';
  private sortDate: string = 'desc';

  private data: Array<any> = [];     // full data from the server
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


  private onPageChange(passedpage: number) {

    this.config.currentPage = passedpage;
  }


  private onChangeTable(config: any, page: any = { page: this.config.currentPage, itemsPerPage: this.config.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.config.sorting, config.sorting);
    }

    let filteredData = this.changeFilter(this.data, this.config);
    let sortedData = this.changeSort(filteredData, this.config);
    this.rows = sortedData;
    this.config.totalItems = sortedData.length;
  }


  private sortTable(column: string) {
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
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.config.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columns.forEach((column: any) => {
        if (item[column.name].toString().match(this.config.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSort(data: any, config: any) {
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
  private isIdHisAsc = true;
  private isTradeIdHisAsc = true;
  private isDateHisAsc = true;
  private isStatusHisAsc = true;

  private sortIdHis: string = 'desc'
  private sortTradeIdHis: string = 'desc';
  private sortStatusHis: string = 'desc';
  private sortDateHis: string = 'desc';

  private dataHis: Array<any> = [];     // full data from the server
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


  private onPageChangeHis(passedpage: number) {

    this.configHis.currentPage = passedpage;
  }


  private onChangeTableHis(config: any, page: any = { page: this.configHis.currentPage, itemsPerPage: this.configHis.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configHis.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configHis.sorting, config.sorting);
    }

    let filteredData = this.changeFilterHis(this.dataHis, this.configHis);
    let sortedData = this.changeSortHis(filteredData, this.configHis);
    this.rowsHis = sortedData;
    this.configHis.totalItems = sortedData.length;
  }


  private sortTableHis(column: string) {
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


  private changeSortHis(data: any, config: any) {
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
