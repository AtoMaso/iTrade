import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'render',
  template: `  {{renderValue}}`,
})

export class RenderComponent implements ViewCell, OnInit {

  renderValue: string;
  @Input() value: string | number;
  @Input() rowData: any;


  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }

}