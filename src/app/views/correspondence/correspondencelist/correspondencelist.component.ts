import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';

// services
import { CorrespondenceService } from '../../../services/correspondence/correspondence.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { ProcessMessageService } from '../../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../../services/pagetitle/pagetitle.service';
// components
import { UserSession, Trade, PageTitle, Correspondence, PersonalDetails } from '../../../helpers/classes';
import { SpinnerOneComponent } from '../../controls/spinner/spinnerone.component';

@Component({
  selector: 'app-correspondencelist',
  templateUrl: './correspondencelist.component.html',
  styleUrls: ['./correspondencelist.component.scss']
})
export class CorrespondenceListComponent implements OnInit {
  private traderId: string;
  private session: UserSession;
  private isRequesting: boolean = false;

  private statusInbox: string = "New";
  private statusSent: string = "New";
  private statusArchivedInbox: string = "Archived";
  private statusArchivedSent: string = "Archived";
  private statusDeleted: string = "Deleted";

  private hasInbox: boolean = true;
  private hasSent: boolean = true;
  private hasArchivedInbox: boolean = true;
  private hasArchivedSent: boolean = true;
  private hasDeleted: boolean = true;

  private isFirstLoadInbox: boolean = false;
  private isFirstLoadSent: boolean = false;
  private isFirstLoadArchivedInbox: boolean = false;
  private isFirstLoadArchivedSent: boolean = false;
  private isFirstLoadDeleted: boolean = false;

  private removedInboxId: number = 0;
  private removedSentId: number = 0;
  private removedArchivedInboxId: number = 0;
  private removedArchivedSentId: number = 0
  private removedDeletedId: number = 0;

  private inboxToArchive: Correspondence;
  private inboxToDelete: Correspondence;
  private sentToArchive: Correspondence;
  private sentToDelete: Correspondence;
  private archiveInboxToDelete: Correspondence;
  private archiveSentToDelete: Correspondence;
  private deletedToArchive: Correspondence;
  private deletedToActivate: Correspondence;


  constructor(  
    private corresService: CorrespondenceService,
    private route: ActivatedRoute,
    private messagesService: ProcessMessageService,
    private pageTitleService: PageTitleService,
    private router: Router,
    private loggerService: LoggerService) {}
 

  ngOnInit() {

    this.getUserSession();
    this.initialiseComponent();
    this.getInbox(this.traderId, this.statusInbox);    
    this.getSent(this.traderId, this.statusInbox);    
    this.getArchivedInbox(this.traderId, this.statusArchivedInbox);
    this.getArchivedSent(this.traderId, this.statusArchivedSent);
    this.getDeletedCorrespondence(this.traderId);
  }


  // toggling done with jquery
  ngAfterViewInit() {
    jQuery(document).ready(function () {


      jQuery("#collapseInbox").on("hide.bs.collapse", function () {
        jQuery(".inbox").html('<span class="glyphicon glyphicon-plus"></span>   Received Mail');
      });
      jQuery("#collapseInbox").on("show.bs.collapse", function () {
        jQuery(".inbox").html('<span class="glyphicon glyphicon-minus"></span>   Received Mail');
      });

      jQuery("#collapseSent").on("hide.bs.collapse", function () {
        jQuery(".sent").html('<span class="glyphicon glyphicon-plus"></span> Sent Mail');
      });
      jQuery("#collapseSent").on("show.bs.collapse", function () {
        jQuery(".sent").html('<span class="glyphicon glyphicon-minus"></span> Sent Mail');
      });

      jQuery("#collapseArchiveInbox").on("hide.bs.collapse", function () {
        jQuery(".archiveinbox").html('<span class="glyphicon glyphicon-plus"></span> Archived  Received Mail');
      });
      jQuery("#collapseArchiveInbox").on("show.bs.collapse", function () {
        jQuery(".archiveinbox").html('<span class="glyphicon glyphicon-minus"></span> Archived  Received Mail');
      });

      jQuery("#collapseArchiveSent").on("hide.bs.collapse", function () {
        jQuery(".archivesent").html('<span class="glyphicon glyphicon-plus"></span> Archived Sent Mail');
      });
      jQuery("#collapseArchiveSent").on("show.bs.collapse", function () {
        jQuery(".archivesent").html('<span class="glyphicon glyphicon-minus"></span> Archived Sent Mail');
      });

      jQuery("#collapseDeleted").on("hide.bs.collapse", function () {
        jQuery(".deleted").html('<span class="glyphicon glyphicon-plus"></span> Deleted Mail');
      });
      jQuery("#collapseDeleted").on("show.bs.collapse", function () {
        jQuery(".deleted").html('<span class="glyphicon glyphicon-minus"></span> Deleted Mail');
      });

    });
  }


  //****************************************************************************************
  // GET CORRESPONDENCE - -- this wil get all correspondence, if there are no any will show the message
  //****************************************************************************************
  private getInbox(traderId: string, statusInboxes: string) {

    this.corresService.getInboxByTraderIdWithStatusOrAll(traderId, statusInboxes)
      .subscribe((returnedInboxes: Correspondence[]) => {
        if (returnedInboxes.length === 0) { this.hasInbox = false; }
        else {
          this.onSuccessInbox(returnedInboxes);
        }
      },
      (res: Response) => this.onError(res, "getInboxes"));

  }

  private onSuccessInbox(inboxes:Correspondence[]) {
    this.dataInbox = inboxes;
    this.hasInbox = true;
    this.isFirstLoadInbox = true;
    this.onChangeTableInbox(this.configInbox);
    this.onPageChangeInbox(1);
  }



  private getSent(traderId: string, statusSent: string) {

    this.corresService.getSentByTraderIdWithStatusOrAll(traderId, statusSent)
      .subscribe((returnedSent: Correspondence[]) => {
        if (returnedSent.length === 0) { this.hasSent = false; }
        else {
          this.onSuccessSent(returnedSent);
        }
      },
      (res: Response) => this.onError(res, "getInboxes"));

  }

  private onSuccessSent(sent: Correspondence[]) {
    this.dataSent = sent;
    this.hasSent = true;
    this.isFirstLoadSent = true;
    this.onChangeTableSent(this.configSent);
    this.onPageChangeSent(1);
  }



  private getArchivedInbox(traderId: string, statusArchivedInboxes: string = "Archived") {

    this.corresService.getInboxByTraderIdWithStatusOrAll(traderId, statusArchivedInboxes)
      .subscribe((returnedArchivedInboxes: Correspondence[]) => {
        if (returnedArchivedInboxes.length === 0) { this.hasArchivedInbox = false; }
        else {
          this.onSuccessArchivedInbox(returnedArchivedInboxes);
        }
      },
      (res: Response) => this.onError(res, "getInboxes"));

  }

  private onSuccessArchivedInbox(archivedinboxes: Correspondence[]) {
    this.dataArchivedInbox = archivedinboxes;
    this.hasArchivedInbox = true;
    this.isFirstLoadArchivedInbox = true;
    this.onChangeTableArchivedInbox(this.configArchivedInbox);
    this.onPageChangeArchivedInbox(1);
  }



  private getArchivedSent(traderId: string, statusArchivedSent: string = "Archived") {

    this.corresService.getSentByTraderIdWithStatusOrAll(traderId, statusArchivedSent)
      .subscribe((returnedArchivedSent: Correspondence[]) => {
        if (returnedArchivedSent.length === 0) { this.hasArchivedSent = false; }
        else {
          this.onSuccessArchivedSent(returnedArchivedSent);
        }
      },
      (res: Response) => this.onError(res, "getInboxes"));

  }

    private onSuccessArchivedSent(archivedsent: Correspondence[]) {
    this.dataArchivedSent = archivedsent;
    this.hasArchivedSent = true;
    this.isFirstLoadArchivedSent = true;
    this.onChangeTableArchivedSent(this.configArchivedSent);
    this.onPageChangeArchivedSent(1);
  }



  private getDeletedCorrespondence(traderId: string) {

    this.corresService.getDeletedCorresByTraderId(traderId)
      .subscribe((returnedDeleted: Correspondence[]) => {
        if (returnedDeleted.length === 0) { this.hasDeleted = false; }
        else {
          this.onSuccessDeleted(returnedDeleted);
        }
      },
      (res: Response) => this.onError(res, "getDeletedCorrespondence"));

  }
  
  private onSuccessDeleted(deleted: Correspondence[]) {
    this.dataDeleted = deleted;
    this.hasDeleted = true;
    this.isFirstLoadDeleted = true;
    this.onChangeTableDeleted(this.configDeleted);
    this.onPageChangeDeleted(1);
  }


  //*****************************************************
  // SCREEN ITERACTIONS METHODS 
  //*****************************************************
  private passToModalArchiveInbox(corres: Correspondence) {
    this.inboxToArchive = corres;
  }

  private passToModalDeleteInbox(corres: Correspondence) {
    this.inboxToDelete = corres;
  }

  private passToModalArchiveSent(corres: Correspondence) {
    this.sentToArchive = corres
  }

  private passToModalDeleteSent(corres: Correspondence) {
    this.sentToDelete = corres
  }

  private passToModalDeleteArchiveInbox(corres: Correspondence) {
    this.archiveInboxToDelete = corres
  }

  private passToModalDeleteArchiveSent(corres: Correspondence) {
    this.archiveSentToDelete = corres
  }

  private passToModalArchiveDeleted(corres: Correspondence) {
    this.deletedToArchive = corres;
  }

  private passToModalActivateDeleted(corres: Correspondence) {
    this.deletedToActivate = corres;
  }

  
  private archiveInbox(inboxToArchive: Correspondence) {
    // update the status of the correspondence to archived
    inboxToArchive.statusReceiver = "Archived";
    this.corresService.updateCorrespondence(inboxToArchive)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");  
        // get the inbox and archived inbox
        this.getInbox(this.traderId, this.statusInbox);  
        this.getArchivedInbox(this.traderId, this.statusArchivedInbox);

    }, (serviceError: Response) => this.onError(serviceError, "archiveInbox"));
  }

 
  private deleteInbox(inboxToDelete: Correspondence) {
    // update the status of the correspondence to deleted 
    inboxToDelete.statusReceiver = "Deleted";
    this.corresService.updateCorrespondence(inboxToDelete)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the inbox
        this.getInbox(this.traderId, this.statusInbox);
        this.getDeletedCorrespondence(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "deleteInbox"));
  }


  private archiveSent(sentToArchive: Correspondence) {
    // update the status of the correspondence to archived
    sentToArchive.statusSender = "Archived";
    this.corresService.updateCorrespondence(sentToArchive)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the sent and archived sent
        this.getSent(this.traderId, this.statusSent);
        this.getArchivedSent(this.traderId, this.statusArchivedSent);

      }, (serviceError: Response) => this.onError(serviceError, "archiveSent"));
  }


  private deleteSent(sentToDelete: Correspondence) {
    // update the status of the correspondence to deleted 
    sentToDelete.statusSender = "Deleted";
    this.corresService.updateCorrespondence(sentToDelete)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the sent
        this.getSent(this.traderId, this.statusSent);
        this.getDeletedCorrespondence(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "deleteSent"));
  }


  private deleteArchivedInbox(archiveInboxToDelete: Correspondence) {
    // update the status of the correspondence to deleted 
    archiveInboxToDelete.statusReceiver = "Deleted";
    this.corresService.updateCorrespondence(archiveInboxToDelete)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the archived inbox
        this.getArchivedInbox(this.traderId, this.statusArchivedInbox);      
      }, (serviceError: Response) => this.onError(serviceError, "deleteArchivedInbox"));
  }


  private deleteArchivedSent(archivedSentToDelete: Correspondence) {
    // update the status of the correspondence to deleted 
    archivedSentToDelete.statusSender = "Deleted";
    this.corresService.updateCorrespondence(archivedSentToDelete)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the archived sent
        this.getArchivedSent(this.traderId, this.statusArchivedSent);
      }, (serviceError: Response) => this.onError(serviceError, "deleteArchivedSent"));
  }


  private archiveDeleted(deletedToArchive: Correspondence) {
  }


  private activateDeleted(deletedToActivate: Correspondence) {
  }


  //*****************************************************
  // HELPER METHODS 
  //*****************************************************
  private getUserSession() {
    if (sessionStorage["UserSession"] != "null") {
      try {
        this.session = JSON.parse(sessionStorage["UserSession"])
        this.traderId = this.session.userIdentity.userId;
      }
      catch (ex) {
        this.messagesService.emitProcessMessage("PMG");
      }
    }
  }


  private initialiseComponent() {
    this.pageTitleService.emitPageTitle(new PageTitle("All Correspondence"));
    this.messagesService.emitRoute("nill");
  }


  //****************************************************
  // LOGGING METHODS
  //****************************************************
  private onError(serviceError: any, operation: string) {

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
  //Inbox Correspondence
  /***********************************************/
  private isDateSentInboxAsc = true;
  private isSubjectInboxAsc = true;
  private isStatusInboxAsc = true;
  private isSenderInboxAsc = true;

  private sortDateSentInbox: string = 'desc'
  private sortSubjectInbox: string = 'desc';
  private sortStatusInbox: string = 'desc';
  private sortSenderInbox: string = 'desc';

  private dataInbox: Array<any> = [];     // full data from the server
  public rowsInbox: Array<any> = [];      // rows passed to the table
  public maxSizeInbox: number = 5;
  public numPagesInbox: number = 1;

  public columnsInbox: Array<any> =
  [
    { title: 'Sent', name: 'dateSent', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence date sent.' } },
    { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence status.' } },
    { title: 'Subject', name: 'subject', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence subject' } },
    { title: 'Sender', name: 'sender', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence sender.' } }
  ];


  public configInbox: any = {
    id: 'paginationInbox',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsInbox },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChangeInbox(passedpage: number) {

    this.configInbox.currentPage = passedpage;
  }


  private onChangeTableInbox(config: any, page: any = { page: this.configInbox.currentPage, itemsPerPage: this.configInbox.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configInbox.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configInbox.sorting, config.sorting);
    }

    if (!this.isFirstLoadInbox) {
      let removedData = this.changeRemoveInbox(this.dataInbox, this.configInbox);
      let filteredData = this.changeFilterInbox(removedData, this.configInbox);    
      let sortedData = this.changeSortInbox(filteredData, this.configInbox);
      this.rowsInbox = sortedData;
      this.configInbox.totalItems = sortedData.length;
    } else {
      this.rowsInbox = this.dataInbox;
      this.configInbox.totalItems = this.dataInbox.length;
      this.isFirstLoadInbox = false;
    }
  }


  private sortTableInbox(column: string) {
    // reset the array of columns
    this.configInbox.sorting.columns = [];

    switch (column) {

      case 'dateSent':
        this.configInbox.sorting.columns = [{ name: 'dateSent', sort: this.sortDateSentInbox }];
        this.onChangeTableInbox(this.configInbox);
        this.isDateSentInboxAsc = !this.isDateSentInboxAsc;
        this.sortDateSentInbox = this.isDateSentInboxAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configInbox.sorting.columns = [{ name: 'status', sort: this.sortStatusInbox }];
        this.onChangeTableInbox(this.configInbox);
        this.isStatusInboxAsc = !this.isStatusInboxAsc;
        this.sortStatusInbox = this.isStatusInboxAsc ? 'desc' : 'asc';
        break;

      case 'subject':
        this.configInbox.sorting.columns = [{ name: 'subject', sort: this.sortSubjectInbox }];
        this.onChangeTableInbox(this.configInbox);
        this.isSubjectInboxAsc = !this.isSubjectInboxAsc;
        this.sortSubjectInbox = this.isSubjectInboxAsc ? 'desc' : 'asc';
        break;

      case 'sender':
        this.configInbox.sorting.columns = [{ name: 'sender', sort: this.sortSenderInbox }];
        this.onChangeTableInbox(this.configInbox);
        this.isSenderInboxAsc = !this.isSenderInboxAsc;
        this.sortSenderInbox = this.isSenderInboxAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterInbox(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsInbox.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configInbox.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsInbox.forEach((column: any) => {
        if (item[column.name].toString().match(this.configInbox.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSortInbox(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configInbox.sorting.columns || [];
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


  private changeRemoveInbox(data: any, config: any): any {
    if (this.removedInboxId == null) { return data; }

    let removedData: Array<any> = data.filter((item: Correspondence) => item.id !== this.removedInboxId);
    this.dataInbox = null;
    this.dataInbox = removedData;
    return this.dataInbox;
  }



  /**********************************************/
  //Archived Inbox Correspondence
  /***********************************************/
  private isDateSentArchivedInboxAsc = true;
  private isSubjectArchivedInboxAsc = true;
  private isStatusArchivedInboxAsc = true;
  private isSenderArchivedInboxAsc = true;

  private sortDateSentArchivedInbox: string = 'desc'
  private sortSubjectArchivedInbox: string = 'desc';
  private sortStatusArchivedInbox: string = 'desc';
  private sortSenderArchivedInbox: string = 'desc';

  private dataArchivedInbox: Array<any> = [];     // full data from the server
  public rowsArchivedInbox: Array<any> = [];      // rows passed to the table
  public maxSizeArchivedInbox: number = 5;
  public numPagesArchivedInbox: number = 1;

  public columnsArchivedInbox: Array<any> =
  [
    { title: 'Sent', name: 'dateSent', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence date sent.' } },
    { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence status.' } },
    { title: 'Subject', name: 'subject', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence subject' } },
    { title: 'Sender', name: 'sender', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence sender.' } }
  ];


  public configArchivedInbox: any = {
    id: 'paginationArchivedInbox',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsArchivedInbox },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChangeArchivedInbox(passedpage: number) {

    this.configArchivedInbox.currentPage = passedpage;
  }


  private onChangeTableArchivedInbox(config: any, page: any = { page: this.configArchivedInbox.currentPage, itemsPerPage: this.configArchivedInbox.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configArchivedInbox.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configArchivedInbox.sorting, config.sorting);
    }

    if (!this.isFirstLoadArchivedInbox) {
      let removedData = this.changeRemoveArchivedInbox(this.dataArchivedInbox, this.configArchivedInbox);
      let filteredData = this.changeFilterArchivedInbox(removedData, this.configArchivedInbox);
      let sortedData = this.changeSortArchivedInbox(filteredData, this.configArchivedInbox);
      this.rowsArchivedInbox = sortedData;
      this.configArchivedInbox.totalItems = sortedData.length;
    } else {
      this.rowsArchivedInbox = this.dataArchivedInbox;
      this.configArchivedInbox.totalItems = this.dataArchivedInbox.length;
      this.isFirstLoadArchivedInbox = false;
    }
  }


  private sortTableArchivedInbox(column: string) {
    // reset the array of columns
    this.configArchivedInbox.sorting.columns = [];

    switch (column) {

      case 'dateSent':
        this.configArchivedInbox.sorting.columns = [{ name: 'dateSent', sort: this.sortDateSentArchivedInbox }];
        this.onChangeTableArchivedInbox(this.configArchivedInbox);
        this.isDateSentArchivedInboxAsc = !this.isDateSentArchivedInboxAsc;
        this.sortDateSentArchivedInbox = this.isDateSentArchivedInboxAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configArchivedInbox.sorting.columns = [{ name: 'status', sort: this.sortStatusArchivedInbox }];
        this.onChangeTableArchivedInbox(this.configArchivedInbox);
        this.isStatusArchivedInboxAsc = !this.isStatusArchivedInboxAsc;
        this.sortStatusArchivedInbox = this.isStatusArchivedInboxAsc ? 'desc' : 'asc';
        break;

      case 'subject':
        this.configArchivedInbox.sorting.columns = [{ name: 'subject', sort: this.sortSubjectArchivedInbox }];
        this.onChangeTableArchivedInbox(this.configArchivedInbox);
        this.isSubjectArchivedInboxAsc = !this.isSubjectArchivedInboxAsc;
        this.sortSubjectArchivedInbox = this.isSubjectArchivedInboxAsc ? 'desc' : 'asc';
        break;

      case 'sender':
        this.configArchivedInbox.sorting.columns = [{ name: 'sender', sort: this.sortSenderArchivedInbox }];
        this.onChangeTableArchivedInbox(this.configArchivedInbox);
        this.isSenderArchivedInboxAsc = !this.isSenderArchivedInboxAsc;
        this.sortSenderArchivedInbox = this.isSenderArchivedInboxAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterArchivedInbox(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsArchivedInbox.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configArchivedInbox.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsArchivedInbox.forEach((column: any) => {
        if (item[column.name].toString().match(this.configArchivedInbox.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSortArchivedInbox(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configArchivedInbox.sorting.columns || [];
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


  private changeRemoveArchivedInbox(data: any, config: any): any {
    if (this.removedArchivedInboxId == null) { return data; }

    let removedData: Array<any> = data.filter((item: Correspondence) => item.id !== this.removedArchivedInboxId);
    this.dataArchivedInbox = null;
    this.dataArchivedInbox = removedData;
    return this.dataArchivedInbox;
  }



  /**********************************************/
  //Sent Correspondence
  /***********************************************/
  private isDateSentSentAsc = true;
  private isSubjectSentAsc = true;
  private isStatusSentAsc = true;
  private isSenderSentAsc = true;

  private sortDateSentSent: string = 'desc'
  private sortSubjectSent: string = 'desc';
  private sortStatusSent: string = 'desc';
  private sortSenderSent: string = 'desc';

  private dataSent: Array<any> = [];     // full data from the server
  public rowsSent: Array<any> = [];      // rows passed to the table
  public maxSizeSent: number = 5;
  public numPagesSent: number = 1;

  public columnsSent: Array<any> =
  [
    { title: 'Sent', name: 'dateSent', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence date sent.' } },
    { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence status.' } },
    { title: 'Subject', name: 'subject', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence subject' } },
    { title: 'Sender', name: 'sender', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence sender.' } }
  ];


  public configSent: any = {
    id: 'paginationSent',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsSent },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChangeSent(passedpage: number) {

    this.configSent.currentPage = passedpage;
  }


  private onChangeTableSent(config: any, page: any = { page: this.configSent.currentPage, itemsPerPage: this.configSent.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configSent.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configSent.sorting, config.sorting);
    }

    if (!this.isFirstLoadSent) {
      let removedData = this.changeRemoveSent(this.dataSent, this.configSent);
      let filteredData = this.changeFilterSent(removedData, this.configSent);       
      let sortedData = this.changeSortSent(filteredData, this.configSent);
      this.rowsSent = sortedData;
      this.configSent.totalItems = sortedData.length;
    } else {
      this.rowsSent = this.dataSent;
      this.configSent.totalItems = this.dataSent.length;
      this.isFirstLoadSent = false;
    }
  }


  private sortTableSent(column: string) {
    // reset the array of columns
    this.configSent.sorting.columns = [];

    switch (column) {

      case 'dateSent':
        this.configSent.sorting.columns = [{ name: 'dateSent', sort: this.sortDateSentSent }];
        this.onChangeTableSent(this.configSent);
        this.isDateSentSentAsc = !this.isDateSentSentAsc;
        this.sortDateSentSent = this.isDateSentSentAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configSent.sorting.columns = [{ name: 'status', sort: this.sortStatusSent }];
        this.onChangeTableSent(this.configSent);
        this.isStatusSentAsc = !this.isStatusSentAsc;
        this.sortStatusSent = this.isStatusSentAsc ? 'desc' : 'asc';
        break;

      case 'subject':
        this.configSent.sorting.columns = [{ name: 'subject', sort: this.sortSubjectSent }];
        this.onChangeTableSent(this.configSent);
        this.isSubjectSentAsc = !this.isSubjectSentAsc;
        this.sortSubjectSent = this.isSubjectSentAsc ? 'desc' : 'asc';
        break;

      case 'sender':
        this.configSent.sorting.columns = [{ name: 'sender', sort: this.sortSenderSent }];
        this.onChangeTableSent(this.configSent);
        this.isSenderSentAsc = !this.isSenderSentAsc;
        this.sortSenderSent = this.isSenderSentAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterSent(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsSent.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configSent.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsSent.forEach((column: any) => {
        if (item[column.name].toString().match(this.configSent.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSortSent(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configSent.sorting.columns || [];
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


  private changeRemoveSent(data: any, config: any): any {
    if (this.removedSentId == null) { return data; }

    let removedData: Array<any> = data.filter((item: Correspondence) => item.id !== this.removedSentId);
    this.dataSent = null;
    this.dataSent = removedData;
    return this.dataSent;
  }



  /**********************************************/
  //Archive Sent Correspondence
  /***********************************************/
  private isDateSentArchivedSentAsc = true;
  private isSubjectArchivedSentAsc = true;
  private isStatusArchivedSentAsc = true;
  private isSenderArchivedSentAsc = true;

  private sortDateSentArchivedSent: string = 'desc'
  private sortSubjectArchivedSent: string = 'desc';
  private sortStatusArchivedSent: string = 'desc';
  private sortSenderArchivedSent: string = 'desc';

  private dataArchivedSent: Array<any> = [];     // full data from the server
  public rowsArchivedSent: Array<any> = [];      // rows passed to the table
  public maxSizeArchivedSent: number = 5;
  public numPagesArchivedSent: number = 1;

  public columnsArchivedSent: Array<any> =
  [
    { title: 'Sent', name: 'dateSent', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence date sent.' } },
    { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence status.' } },
    { title: 'Subject', name: 'subject', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence subject' } },
    { title: 'Sender', name: 'sender', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence sender.' } }
  ];


  public configArchivedSent: any = {
    id: 'paginationArchivedSent',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsArchivedSent },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChangeArchivedSent(passedpage: number) {

    this.configArchivedSent.currentPage = passedpage;
  }


  private onChangeTableArchivedSent(config: any, page: any = { page: this.configArchivedSent.currentPage, itemsPerPage: this.configArchivedSent.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configArchivedSent.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configArchivedSent.sorting, config.sorting);
    }

    if (!this.isFirstLoadArchivedSent) {
      let removedData = this.changeRemoveArchivedSent(this.dataArchivedSent, this.configArchivedSent);
      let filteredData = this.changeFilterArchivedSent(removedData, this.configArchivedSent);    
      let sortedData = this.changeSortArchivedSent(filteredData, this.configArchivedSent);
      this.rowsArchivedSent = sortedData;
      this.configArchivedSent.totalItems = sortedData.length;
    } else {
      this.rowsArchivedSent = this.dataArchivedSent;
      this.configArchivedSent.totalItems = this.dataArchivedSent.length;
      this.isFirstLoadArchivedSent = false;
    }
  }


  private sortTableArchivedSent(column: string) {
    // reset the array of columns
    this.configArchivedSent.sorting.columns = [];

    switch (column) {

      case 'dateSent':
        this.configArchivedSent.sorting.columns = [{ name: 'dateSent', sort: this.sortDateSentArchivedSent }];
        this.onChangeTableArchivedSent(this.configArchivedSent);
        this.isDateSentArchivedSentAsc = !this.isDateSentArchivedSentAsc;
        this.sortDateSentArchivedSent = this.isDateSentArchivedSentAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configArchivedSent.sorting.columns = [{ name: 'status', sort: this.sortStatusArchivedSent }];
        this.onChangeTableArchivedSent(this.configArchivedSent);
        this.isStatusArchivedSentAsc = !this.isStatusArchivedSentAsc;
        this.sortStatusArchivedSent = this.isStatusArchivedSentAsc ? 'desc' : 'asc';
        break;

      case 'subject':
        this.configArchivedSent.sorting.columns = [{ name: 'subject', sort: this.sortSubjectArchivedSent }];
        this.onChangeTableArchivedSent(this.configArchivedSent);
        this.isSubjectArchivedSentAsc = !this.isSubjectArchivedSentAsc;
        this.sortSubjectArchivedSent = this.isSubjectArchivedSentAsc ? 'desc' : 'asc';
        break;

      case 'sender':
        this.configArchivedSent.sorting.columns = [{ name: 'sender', sort: this.sortSenderArchivedSent }];
        this.onChangeTableArchivedSent(this.configArchivedSent);
        this.isSenderArchivedSentAsc = !this.isSenderArchivedSentAsc;
        this.sortSenderArchivedSent = this.isSenderArchivedSentAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterArchivedSent(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsArchivedSent.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configArchivedSent.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsArchivedSent.forEach((column: any) => {
        if (item[column.name].toString().match(this.configArchivedSent.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSortArchivedSent(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configSent.sorting.columns || [];
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


  private changeRemoveArchivedSent(data: any, config: any): any {
    if (this.removedArchivedSentId == null) { return data; }

    let removedData: Array<any> = data.filter((item: Correspondence) => item.id !== this.removedArchivedSentId);
    this.dataArchivedSent = null;
    this.dataArchivedSent = removedData;
    return this.dataArchivedSent;
  }



  /**********************************************/
  //Deleted Correspondence
  /***********************************************/
  private isDateSentDeletedAsc = true;
  private isSubjectDeletedAsc = true;
  private isStatusDeletedAsc = true;
  private isSenderDeletedAsc = true;

  private sortDateSentDeleted: string = 'desc'
  private sortSubjectDeleted: string = 'desc';
  private sortStatusDeleted: string = 'desc';
  private sortSenderDeleted: string = 'desc';

  private dataDeleted: Array<any> = [];     // full data from the server
  public rowsDeleted: Array<any> = [];      // rows passed to the table
  public maxSizeDeleted: number = 5;
  public numPagesDeleted: number = 1;

  public columnsDeleted: Array<any> =
  [
    { title: 'Sent', name: 'dateSent', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence date sent.' } },
    { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence status.' } },
    { title: 'Subject', name: 'subject', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence subject' } },
    { title: 'Sender', name: 'sender', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence sender.' } }
  ];


  public configDeleted: any = {
    id: 'paginationDeleted',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsDeleted },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChangeDeleted(passedpage: number) {

    this.configDeleted.currentPage = passedpage;
  }


  private onChangeTableDeleted(config: any, page: any = { page: this.configDeleted.currentPage, itemsPerPage: this.configDeleted.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configDeleted.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configDeleted.sorting, config.sorting);
    }

    if (!this.isFirstLoadDeleted) {
      let removedData = this.changeRemoveDeleted(this.dataDeleted, this.configDeleted);
      let filteredData = this.changeFilterDeleted(removedData, this.configDeleted);
      let sortedData = this.changeSortDeleted(filteredData, this.configDeleted);
      this.rowsDeleted = sortedData;
      this.configDeleted.totalItems = sortedData.length;
    } else {
      this.rowsDeleted = this.dataDeleted;
      this.configDeleted.totalItems = this.dataDeleted.length;
      this.isFirstLoadDeleted = false;
    }
  }


  private sortTableDeleted(column: string) {
    // reset the array of columns
    this.configDeleted.sorting.columns = [];

    switch (column) {

      case 'dateSent':
        this.configDeleted.sorting.columns = [{ name: 'dateSent', sort: this.sortDateSentDeleted }];
        this.onChangeTableDeleted(this.configDeleted);
        this.isDateSentDeletedAsc = !this.isDateSentDeletedAsc;
        this.sortDateSentDeleted = this.isDateSentDeletedAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configDeleted.sorting.columns = [{ name: 'status', sort: this.sortStatusDeleted }];
        this.onChangeTableDeleted(this.configDeleted);
        this.isStatusDeletedAsc = !this.isStatusDeletedAsc;
        this.sortStatusDeleted = this.isStatusDeletedAsc ? 'desc' : 'asc';
        break;

      case 'subject':
        this.configDeleted.sorting.columns = [{ name: 'subject', sort: this.sortSubjectDeleted }];
        this.onChangeTableDeleted(this.configDeleted);
        this.isSubjectDeletedAsc = !this.isSubjectDeletedAsc;
        this.sortSubjectDeleted = this.isSubjectDeletedAsc ? 'desc' : 'asc';
        break;

      case 'sender':
        this.configDeleted.sorting.columns = [{ name: 'sender', sort: this.sortSenderDeleted }];
        this.onChangeTableDeleted(this.configDeleted);
        this.isSenderDeletedAsc = !this.isSenderDeletedAsc;
        this.sortSenderDeleted = this.isSenderDeletedAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterDeleted(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsDeleted.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configDeleted.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsDeleted.forEach((column: any) => {
        if (item[column.name].toString().match(this.configDeleted.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSortDeleted(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configDeleted.sorting.columns || [];
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


  private changeRemoveDeleted(data: any, config: any): any {
    if (this.removedDeletedId == null) { return data; }

    let removedData: Array<any> = data.filter((item: Correspondence) => item.id !== this.removedDeletedId);
    this.dataDeleted = null;
    this.dataDeleted = removedData;
    return this.dataDeleted;
  }
}


