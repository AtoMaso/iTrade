import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-smarttable',
  templateUrl: './smarttable.component.html',
  styleUrls: ['./smarttable.component.scss']
})
export class SmarttableComponent implements OnInit {

  constructor() { }

  settings = {
    columns: {
      id: {
        title: 'ID'
      },
      name: {
        title: 'Full Name'
      },
      username: {
        title: 'User Name'
      },
      email: {
        title: 'Email'
      }
    }
  };

  ngOnInit() {
  }

}
