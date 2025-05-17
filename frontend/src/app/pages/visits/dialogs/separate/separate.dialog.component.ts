import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeathericonsModule } from '@icons/feathericons/feathericons.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SnackmessageComponent } from '@shared/snackmessage/snackmessage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog-separate-creteria',
  templateUrl: 'separate.dialog.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    FeathericonsModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    NgScrollbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MatDatepickerModule, MatNativeDateModule],
})
export class SeparateCriteriaDialogComponent {
  constructor(private snackmessage: MatSnackBar) {}

  readonly panelOpenState = signal(false);
  recorridos = [];

  file: File;
  filename1 = 'Seleccionar archivo';
  filename2 = 'Seleccionar archivo';

  onclick(): void {
    this.snackmessage.openFromComponent(SnackmessageComponent, {
      duration: 8000,
      data: {
        type: 'simple',
        title: 'Error',
        icon: 'check_circle',
        message: `Error en la transacción`,
      },
      panelClass: 'snackError',
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  onFilechangeService(event: any) {
    console.log(event.target.files[0]);
    this.filename1 = event.target.files[0].name;
  }

  onFilechangeCapacity(event: any) {
    console.log(event.target.files[0]);
    this.filename2 = event.target.files[0].name;
  }

  addRecorridos(): void {
    console.log('test');
  }
}
