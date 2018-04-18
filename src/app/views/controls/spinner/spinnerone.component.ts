'use strict';

import {Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'my-spinner',
    templateUrl: './spinnerone.component.html',
    styleUrls: ['./spinerone.component.scss']
})

export class SpinnerOneComponent implements OnDestroy {

  public str: string;
  public currentTimeout: any;
  public isDelayedRunning: boolean = false;

 @Input() public delay: number = 300;    

 @Input()
 public set isRunning(value: boolean) {

    if (!value) {
        this.cancelTimeout();   
        this.isDelayedRunning = false;                           
    }

    if (this.currentTimeout) { return;}

    this.currentTimeout = setTimeout(() => {
        this.isDelayedRunning = value;
        this.cancelTimeout();
   }, this.delay);

 }

  public cancelTimeout(): void {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = undefined;     
  }

  ngOnDestroy(): any {
      this.cancelTimeout();
  }
}
