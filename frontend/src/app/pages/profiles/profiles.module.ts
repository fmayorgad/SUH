import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeathericonsModule } from '../../shared/icons/feathericons/feathericons.module';
import { SharedModule } from '../../shared/shared.module';

import { ProfilesComponent } from './profiles.component';
import { EditPermissionsDialogComponent } from './dialog/edit-permissions-dialog.component';
import { EcoFabSpeedDialComponent, EcoFabSpeedDialTriggerComponent, EcoFabSpeedDialActionsComponent } from '@ecodev/fab-speed-dial';
import { VeilComponent } from '../../shared/veil/veil.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilesComponent
  }
];

@NgModule({
  declarations: [
    ProfilesComponent,
    EditPermissionsDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FeathericonsModule,
    SharedModule,
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    EcoFabSpeedDialActionsComponent,
    VeilComponent
  ]
})
export class ProfilesModule { } 