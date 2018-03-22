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

  private hasInbox: boolean = true;
  private hasSent: boolean = true;
  private hasArchivedInbox: boolean = true;
  private hasArchivedSent: boolean = true;
  private hasRemoved: boolean = true;

  private isFirstLoadInbox: boolean = false;
  private isFirstLoadSent: boolean = false;
  private isFirstLoadArchivedInbox: boolean = false;
  private isFirstLoadArchivedSent: boolean = false;
  private isFirstLoadRemoved: boolean = false;

  private removedInboxId: number = 0;
  private removedSentId: number = 0;
  private removedArchivedInboxId: number = 0;
  private removedArchivedSentId: number = 0
  private deletedRemovedId: number = 0;


  private inboxToArchive: Correspondence;
  private inboxToRemove: Correspondence;
  private sentToArchive: Correspondence;
  private sentToRemove: Correspondence;
  private archivedInboxToRemove: Correspondence;
  private archivedSentToRemove: Correspondence;
  private removedToArchive: Correspondence;
  private removedToActivate: Correspondence;
  private removedToDelete: Correspondence;

  private toggleInbox: boolean = true;
  private toggleSent: boolean = false;
  private toggleArchivedInbox: boolean = false;
  private toggleArchivedSent: boolean = false;
  private toggleRemoved: boolean = false;


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
    this.getRemovedCorrespondence(this.traderId);
  }


  // toggling done with jquery
  ngAfterViewInit() {
    jQuery(document).ready(function () {


      jQuery("#collapseInbox").on("hide.bs.collapse", function () {
        jQuery(".inbox").html('<span class="glyphicon glyphicon-plus"></span>   Inbox');
      });
      jQuery("#collapseInbox").on("show.bs.collapse", function () {
        jQuery(".inbox").html('<span class="glyphicon glyphicon-minus"></span>   Inbox');
      });

      jQuery("#collapseSent").on("hide.bs.collapse", function () {
        jQuery(".sent").html('<span class="glyphicon glyphicon-plus"></span> Sent Mail');
      });
      jQuery("#collapseSent").on("show.bs.collapse", function () {
        jQuery(".sent").html('<span class="glyphicon glyphicon-minus"></span> Sent Mail');
      });

      jQuery("#collapseArchiveInbox").on("hide.bs.collapse", function () {
        jQuery(".archiveinbox").html('<span class="glyphicon glyphicon-plus"></span> Archived  Inbox');
      });
      jQuery("#collapseArchiveInbox").on("show.bs.collapse", function () {
        jQuery(".archiveinbox").html('<span class="glyphicon glyphicon-minus"></span> Archived  Inbox');
      });

      jQuery("#collapseArchiveSent").on("hide.bs.collapse", function () {
        jQuery(".archivesent").html('<span class="glyphicon glyphicon-plus"></span> Archived Sent');
      });
      jQuery("#collapseArchiveSent").on("show.bs.collapse", function () {
        jQuery(".archivesent").html('<span class="glyphicon glyphicon-minus"></span> Archived Sent');
      });

      jQuery("#collapseRemoved").on("hide.bs.collapse", function () {
        jQuery(".removed").html('<span class="glyphicon glyphicon-plus"></span> Removed');
      });
      jQuery("#collapseRemoved").on("show.bs.collapse", function () {
        jQuery(".removed").html('<span class="glyphicon glyphicon-minus"></span> Removed');
      });

    });
  }


  //****************************************************************************************
  // GET CORRESPONDENCE - -- this wil get all correspondence, if there are no any will show the message
  //****************************************************************************************
  private getInbox(traderId: string, statusInboxes: string) {

    this.corresService.getInboxByTraderIdWithStatus(traderId, statusInboxes)
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

    this.corresService.getSentByTraderIdWithStatus(traderId, statusSent)
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

    this.corresService.getInboxByTraderIdWithStatus(traderId, statusArchivedInboxes)
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

    this.corresService.getSentByTraderIdWithStatus(traderId, statusArchivedSent)
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



  private getRemovedCorrespondence(traderId: string) {

    this.corresService.getRemovedCorresByTraderId(traderId)
      .subscribe((returnedRemoved: Correspondence[]) => {
        if (returnedRemoved.length === 0) { this.hasRemoved = false; }
        else {
          this.onSuccessRemoved(returnedRemoved);
        }
      },
      (res: Response) => this.onError(res, "getRemovedCorrespondence"));

  }
  
  private onSuccessRemoved(removed: Correspondence[]) {
    this.dataRemoved = removed;
    this.hasRemoved = true;
    this.isFirstLoadRemoved = true;
    this.onChangeTableRemoved(this.configRemoved);
    this.onPageChangeRemoved(1);
  }


  //*****************************************************
  // SCREEN ITERACTIONS METHODS 
  //*****************************************************
  private showInbox() {
    this.messagesService.emitRoute("nill");
    this.toggleInbox = true;
    this.toggleSent = false;
    this.toggleArchivedInbox = false;
    this.toggleArchivedSent = false;
    this.toggleRemoved = false;
  }

  private showSent() {
    this.messagesService.emitRoute("nill");
    this.toggleInbox = false;
    this.toggleSent = true;
    this.toggleArchivedInbox = false;
    this.toggleArchivedSent = false;
    this.toggleRemoved = false;
  }

  private showArchivedInbox() {
    this.messagesService.emitRoute("nill");
    this.toggleInbox = false;
    this.toggleSent = false;
    this.toggleArchivedInbox = true;
    this.toggleArchivedSent = false;
    this.toggleRemoved = false;
  }

  private showArchivedSent() {
    this.messagesService.emitRoute("nill");
    this.toggleInbox = false;
    this.toggleSent = false;
    this.toggleArchivedInbox = false;
    this.toggleArchivedSent = true;
    this.toggleRemoved = false;
  }

  private showRemoved() {
    this.messagesService.emitRoute("nill");
    this.toggleInbox = false;
    this.toggleSent = false;
    this.toggleArchivedInbox = false;
    this.toggleArchivedSent = false;
    this.toggleRemoved = true;
  }



  private passToModalArchiveInbox(corres: Correspondence) {
    this.inboxToArchive = corres;
  }

  private passToModalRemoveInbox(corres: Correspondence) {
    this.inboxToRemove = corres;
  }

  private passToModalArchiveSent(corres: Correspondence) {
    this.sentToArchive = corres
  }

  private passToModalRemoveSent(corres: Correspondence) {
    this.sentToRemove = corres
  }

  private passToModalRemoveArchivedInbox(corres: Correspondence) {
    this.archivedInboxToRemove = corres
  }

  private passToModalRemoveArchivedSent(corres: Correspondence) {
    this.archivedSentToRemove = corres
  }

  private passToModalArchiveRemoved(corres: Correspondence) {
    this.removedToArchive = corres;
  }

  private passToModalActivateRemoved(corres: Correspondence) {
    this.removedToActivate = corres;
  }


  private passToModalCompletellyDelete(corres: Correspondence) {
    this.removedToDelete = corres;
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

 
  private removeInbox(inboxToRemove: Correspondence) {
    // update the status of the correspondence to deleted 
    inboxToRemove.statusReceiver = "Removed";
    this.corresService.updateCorrespondence(inboxToRemove)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the inbox
        this.getInbox(this.traderId, this.statusInbox);
        this.getRemovedCorrespondence(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "removeInbox"));
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


  private removeSent(sentToRemove: Correspondence) {
    // update the status of the correspondence to deleted 
    sentToRemove.statusSender = "Removed";
    this.corresService.updateCorrespondence(sentToRemove)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the sent
        this.getSent(this.traderId, this.statusSent);
        this.getRemovedCorrespondence(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "deleteSent"));
  }


  private removeArchivedInbox(archiveInboxToRemove: Correspondence) {
    // update the status of the correspondence to deleted 
    archiveInboxToRemove.statusReceiver = "Removed";
    this.corresService.updateCorrespondence(archiveInboxToRemove)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the archived inbox
        this.getArchivedInbox(this.traderId, this.statusArchivedInbox);    
        this.getRemovedCorrespondence(this.traderId);  
      }, (serviceError: Response) => this.onError(serviceError, "deleteArchivedInbox"));
  }


  private removeArchivedSent(archivedSentToDelete: Correspondence) {
    // update the status of the correspondence to deleted 
    archivedSentToDelete.statusSender = "Removed";
    this.corresService.updateCorrespondence(archivedSentToDelete)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the archived sent
        this.getArchivedSent(this.traderId, this.statusArchivedSent);
        this.getRemovedCorrespondence(this.traderId);
      }, (serviceError: Response) => this.onError(serviceError, "deleteArchivedSent"));
  }


  private archiveRemoved(removedToArchive: Correspondence) {
   
    // update the status of the correspondence to archived
    if (removedToArchive.traderIdReceiver === this.traderId) { removedToArchive.statusReceiver = "Archived"; }
    else { removedToArchive.statusSender = "Archived"; }

    this.corresService.updateCorrespondence(removedToArchive)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the inbox and archived inbox       
        this.getArchivedInbox(this.traderId, this.statusArchivedInbox);
        this.getArchivedSent(this.traderId, this.statusArchivedSent);
        this.getRemovedCorrespondence(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "archiveRemoved"));

  }


  private activateRemoved(removedToActivate: Correspondence) {
    // update the status of the correspondence to archived
    if (removedToActivate.traderIdReceiver === this.traderId) { removedToActivate.statusReceiver = "New"; }
    else { removedToActivate.statusSender = "New"; }

    this.corresService.updateCorrespondence(removedToActivate)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the inbox and archived inbox       
        this.getInbox(this.traderId, this.statusInbox);
        this.getSent(this.traderId, this.statusSent);
        this.getRemovedCorrespondence(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "activateRemoved"));
  }



  private deleteRemoved(removedToDelete: Correspondence) {
    // update the status of the correspondence to archived
    if (removedToDelete.traderIdReceiver === this.traderId) { removedToDelete.statusReceiver = "Deleted"; }
    else { removedToDelete.statusSender = "Deleted"; }

    this.corresService.updateCorrespondence(removedToDelete)
      .subscribe((response: Correspondence) => {

        this.messagesService.emitProcessMessage("PMSUCo");
        // get the inbox and archived inbox             
        this.getRemovedCorrespondence(this.traderId);

      }, (serviceError: Response) => this.onError(serviceError, "activateRemoved"));
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
  //Removed Correspondence
  /***********************************************/
  private isDateSentRemovedAsc = true;
  private isSubjectRemovedAsc = true;
  private isStatusRemovedAsc = true;
  private isSenderRemovedAsc = true;

  private sortDateSentRemoved: string = 'desc'
  private sortSubjectRemoved: string = 'desc';
  private sortStatusRemoved: string = 'desc';
  private sortSenderRemoved: string = 'desc';

  private dataRemoved: Array<any> = [];     // full data from the server
  public rowsRemoved: Array<any> = [];      // rows passed to the table
  public maxSizeRemoved: number = 5;
  public numPagesRemoved: number = 1;

  public columnsRemoved: Array<any> =
  [
    { title: 'Sent', name: 'dateSent', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence date sent.' } },
    { title: 'Status', name: 'status', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence status.' } },
    { title: 'Subject', name: 'subject', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence subject' } },
    { title: 'Sender', name: 'sender', sort: true, filtering: { filterString: '', placeholder: 'Filter by correspondence sender.' } }
  ];


  public configRemoved: any = {
    id: 'paginationRemoved',
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
    paging: true,
    sorting: { columns: this.columnsRemoved },
    filtering: { filterString: '' },
    className: ['table-striped', 'table-bordered']
  };


  private onPageChangeRemoved(passedpage: number) {

    this.configRemoved.currentPage = passedpage;
  }


  private onChangeTableRemoved(config: any, page: any = { page: this.configRemoved.currentPage, itemsPerPage: this.configRemoved.itemsPerPage }) {
    if (config.filtering) {
      Object.apply(this.configRemoved.filtering, config.filtering);
    }
    if (config.sorting) {
      (<any>Object).assign(this.configRemoved.sorting, config.sorting);
    }

    if (!this.isFirstLoadRemoved) {
      let removedData = this.changeRemoveRemoved(this.dataRemoved, this.configRemoved);
      let filteredData = this.changeFilterRemoved(removedData, this.configRemoved);
      let sortedData = this.changeSortRemoved(filteredData, this.configRemoved);
      this.rowsRemoved = sortedData;
      this.configRemoved.totalItems = sortedData.length;
    } else {
      this.rowsRemoved = this.dataRemoved;
      this.configRemoved.totalItems = this.dataRemoved.length;
      this.isFirstLoadRemoved = false;
    }
  }


  private sortTableRemoved(column: string) {
    // reset the array of columns
    this.configRemoved.sorting.columns = [];

    switch (column) {

      case 'dateSent':
        this.configRemoved.sorting.columns = [{ name: 'dateSent', sort: this.sortDateSentRemoved }];
        this.onChangeTableRemoved(this.configRemoved);
        this.isDateSentRemovedAsc = !this.isDateSentRemovedAsc;
        this.sortDateSentRemoved = this.isDateSentRemovedAsc ? 'desc' : 'asc';
        break;

      case 'status':
        this.configRemoved.sorting.columns = [{ name: 'status', sort: this.sortStatusRemoved }];
        this.onChangeTableRemoved(this.configRemoved);
        this.isStatusRemovedAsc = !this.isStatusRemovedAsc;
        this.sortStatusRemoved = this.isStatusRemovedAsc ? 'desc' : 'asc';
        break;

      case 'subject':
        this.configRemoved.sorting.columns = [{ name: 'subject', sort: this.sortSubjectRemoved }];
        this.onChangeTableRemoved(this.configRemoved);
        this.isSubjectRemovedAsc = !this.isSubjectRemovedAsc;
        this.sortSubjectRemoved = this.isSubjectRemovedAsc ? 'desc' : 'asc';
        break;

      case 'sender':
        this.configRemoved.sorting.columns = [{ name: 'sender', sort: this.sortSenderRemoved }];
        this.onChangeTableRemoved(this.configRemoved);
        this.isSenderRemovedAsc = !this.isSenderRemovedAsc;
        this.sortSenderRemoved = this.isSenderRemovedAsc ? 'desc' : 'asc';
        break;

      default:
    }
  }


  public changeFilterRemoved(data: any, config: any): any {

    let filteredData: Array<any> = data;

    this.columnsRemoved.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => { return item[column.name].match(column.filtering.filterString); });
      }

    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        item[config.filtering.columnName].match(this.configRemoved.filtering.filterString));
    }

    let tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {

      // find the string in each coloumn
      let flag = false;
      this.columnsRemoved.forEach((column: any) => {
        if (item[column.name].toString().match(this.configRemoved.filtering.filterString)) { flag = true; }
      });
      if (flag) { tempArray.push(item); }

    });

    filteredData = tempArray;

    return filteredData;
  }


  private changeSortRemoved(data: any, config: any) {
    if (!config.sorting) {
      return data;
    }

    let columns = this.configRemoved.sorting.columns || [];
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


  private changeRemoveRemoved(data: any, config: any): any {
    if (this.deletedRemovedId == null) { return data; }

    let removedData: Array<any> = data.filter((item: Correspondence) => item.id !== this.deletedRemovedId);
    this.dataRemoved = null;
    this.dataRemoved = removedData;
    return this.dataRemoved;
  }
}


