import { Component, OnInit } from '@angular/core';
import { LocalDataSource, ServerDataSource } from 'ng2-smart-table';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Http } from '@angular/http';

import { CONFIG } from '../../config';
import { ProcessMessageService } from '../../services/processmessage/processmessage.service';
import { PageTitleService } from '../../services/pagetitle/pagetitle.service';
import { TradeApiService } from '../../services/tradeapi/tradeapi.service';
import { LoggerService } from '../../services/logger/logger.service';

import { PageTitle, Trade } from '../../helpers/classes';
import { CustomEditorComponent } from '../controls/custom-edit-view/custom-editor.component';
import { CustomRenderComponent } from '../controls/custom-edit-view//custom-render.component';


@Component({
  selector: 'app-smarttable',
  templateUrl: './smarttable.component.html',
  styleUrls: ['./smarttable.component.scss']
})

export class SmarttableComponent implements OnInit {

  sourcedata: LocalDataSource = new LocalDataSource();

  constructor(
    private httpService: Http,
    private tardeApiService: TradeApiService,
    private messagesService: ProcessMessageService,
    private titleService: PageTitleService,
  ) {

    this.titleService.emitPageTitle(new PageTitle("Smart Table"));
    this.messagesService.emitRoute("nill");

    this.tardeApiService.getTradesApi(0).subscribe
      ((data: Trade[]) => {
        this.sourcedata.load(data);
      });

    // directly from the server  - does not work at the moment
    //this.sourcedata = new ServerDataSource(httpService, { endPoint: 'http://localhost:4200/api/trades' });

  }

  ngOnInit() {
  }


  settings = {    
    columns: {
        title: { title: 'Title', filter:true },
        traderName: { title: 'Trader Name', filter: true, type: 'custom', renderComponent: CustomRenderComponent},
        categoryType: { title: 'Category', filter: true },
        datePublished: { title: 'Published', filter: true }
    }
  };



  //sourcedata = [
  //  {
  //    id: 1,
  //    name: "Leanne Graham",
  //    username: "Bret",
  //    email: "Sincere@april.biz"
  //  },
  //  {
  //    id: 2,
  //    name: "Ervin Howell",
  //    username: "Antonette",
  //    email: "Shanna@melissa.tv"
  //  },

  //  {
  //    id: 3,
  //    name: "Nicholas DuBuque",
  //    username: "Nicholas.Stanton",
  //    email: "Rey.Padberg@rosamond.biz"
  //  },
  //    {
  //    id: 4,
  //    name: "Leanne Graham",
  //    username: "Bret",
  //    email: "Sincere@april.biz"
  //  },
  //  {
  //    id: 5,
  //    name: "Ervin Howell",
  //    username: "Antonette",
  //    email: "Shanna@melissa.tv"
  //  },
  //  {
  //    id: 6,
  //    name: "Nicholas DuBuque",
  //    username: "Nicholas.Stanton",
  //    email: "Rey.Padberg@rosamond.biz"
  //  }
  //    {
  //    id: 7,
  //    name: "Leanne Graham",
  //    username: "Bret",
  //    email: "Sincere@april.biz"
  //  },
  //  {
  //    id: 8,
  //    name: "Ervin Howell",
  //    username: "Antonette",
  //    email: "Shanna@melissa.tv"
  //  },
  //  {
  //    id: 9,
  //    name: "Nicholas DuBuque",
  //    username: "Nicholas.Stanton",
  //    email: "Rey.Padberg@rosamond.biz"
  //  },
  //  {
  //    id: 10,
  //    name: "Leanne Graham",
  //    username: "Bret",
  //    email: "Sincere@april.biz"
  //  },
  //  {
  //    id: 11,
  //    name: "Ervin Howell",
  //    username: "Antonette",
  //    email: "Shanna@melissa.tv"
  //  },

  //  {
  //    id: 12,
  //    name: "Nicholas DuBuque",
  //    username: "Nicholas.Stanton",
  //    email: "Rey.Padberg@rosamond.biz"
  //  },
  //  {
  //    id: 13,
  //    name: "Leanne Graham",
  //    username: "Bret",
  //    email: "Sincere@april.biz"
  //  },
  //  {
  //    id: 14,
  //    name: "Ervin Howell",
  //    username: "Antonette",
  //    email: "Shanna@melissa.tv"
  //  },
  //  {
  //    id: 15,
  //    name: "Nicholas DuBuque",
  //    username: "Nicholas.Stanton",
  //    email: "Rey.Padberg@rosamond.biz"
  //  }
  //    {
  //    id: 16,
  //    name: "Leanne Graham",
  //    username: "Bret",
  //    email: "Sincere@april.biz"
  //  },
  //  {
  //    id: 17,
  //    name: "Ervin Howell",
  //    username: "Antonette",
  //    email: "Shanna@melissa.tv"
  //  },
  //  {
  //    id: 18,
  //    name: "Nicholas DuBuque",
  //    username: "Nicholas.Stanton",
  //    email: "Rey.Padberg@rosamond.biz"
  //  }
  //];


}


//settings = {
//  mode: "external",
//  actions: { add: false, position: 'right', custom: [{ name: 'View', title: `<i class="fa fa-eye" aria-hidden="true"></i>` }] },
//  edit: {
//    editButtonContent: '<i class="fa fa-pencil-square" aria-hidden="true"></i>',
//    saveButtonContent: '<i class="ion-checkmark"></i>',
//    cancelButtonContent: '<i class="ion-close"></i>',
//  },
//  delete: {
//    deleteButtonContent: '<i class="fa fa-trash" aria-hidden="true"></i>',
//    confirmDelete: true
//  },