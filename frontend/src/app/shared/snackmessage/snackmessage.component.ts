import {
  Component,
  type OnInit,
  Input,
  OnChanges,
  inject,
  InjectionToken,
  Inject,
  Injectable,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarHorizontalPosition,
  MatSnackBarRef,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { NgIf, NgFor } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-snackmessage',
  standalone: true,
  imports: [NgIf, NgFor, MatIconModule, MatButton, MatIconButton],
  templateUrl: './snackmessage.component.html',
  styleUrls: ['./snackmessage.component.scss'],
})
export class SnackmessageComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
  snackBarRef = inject(MatSnackBarRef);

  ngOnInit() {}
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private _snackBar: MatSnackBar) {}

  show(messageData: {
    horizontalPosition?: MatSnackBarHorizontalPosition;
    verticalPosition?: MatSnackBarVerticalPosition;
    duration?: number;
    type?: 'simple' | 'detailed';
    severity : 'success' | 'error' | 'info' | 'warning';
    message: string;
    title?: string;
    errors? : string[] | string
  }) {

    let severityClass;

    if(messageData.severity === 'success') {severityClass = 'snackSuccess'}
    if(messageData.severity === 'error') {severityClass = 'snackError'}
    if(messageData.severity === 'info') {severityClass = 'snackInfo'}
    if(messageData.severity === 'warning') {severityClass = 'snackWarning'}

    this._snackBar.openFromComponent(SnackmessageComponent, {
      duration: messageData.duration ?? 8000,
      data: {
        type: messageData.type || 'simple',
        title: messageData.title  || 'Error',
        icon: 'check_circle',
        message: messageData.message,
        errors: messageData.errors
      },
      panelClass: severityClass,
      horizontalPosition:
        (messageData.horizontalPosition as MatSnackBarHorizontalPosition) ||
        'right',
      verticalPosition:
        (messageData.verticalPosition as MatSnackBarVerticalPosition) ||
        'bottom',
    });
  }
}

