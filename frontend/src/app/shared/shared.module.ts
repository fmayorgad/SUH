import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarService } from './snackmessage/snackmessage.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MatIconModule
        // Add other modules here
    ],
    exports: [],
    providers: [
        SnackbarService
    ]
})
export class SharedModule { }