import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SnackmessageComponent, ShowSnackMessage} from './snackmessage/snackmessage.component';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
    declarations: [
        SnackmessageComponent,
        ShowSnackMessage
    ],
    imports: [
        CommonModule,
        MatIconModule
        // Add other modules here
    ],
    exports: [
        SnackmessageComponent, ShowSnackMessage
    ]
})
export class SharedModule { }