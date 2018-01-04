'use strict';

import {Component, Input, OnDestroy} from '@angular/core';

@Component({
    selector: 'my-spinner',
    templateUrl: './spinnerone.component.html'
})

export class SpinnerOneComponent implements OnDestroy {

  private str: string;
    private currentTimeout: number;
    private isDelayedRunning: boolean = true;

    @Input()
    public delay: number = 3000;    

    @Input()
    public set isRunning(value: boolean) {
        if (!value) {
            this.cancelTimeout();   
            this.isDelayedRunning = true;                           
        }

        if (this.currentTimeout) {
            return;
        }

        this.currentTimeout = setTimeout(() => {
            this.isDelayedRunning = value;
            this.cancelTimeout();
        }, this.delay);
    }

    private cancelTimeout(): void {
        clearTimeout(this.currentTimeout);
        this.currentTimeout = undefined;
    }

    ngOnDestroy(): any {
        this.cancelTimeout();
    }
}
