import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FeatherModule } from 'angular-feather';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SelectCustomComponent } from '../../shared/SelectCustomComponent/SelectCustom.component';
import { VeilComponent } from '../../shared/veil/veil.component';
import { UserDialogComponent } from './dialog/user-dialog.component';
import { UsersService } from '../../services/users.service';
import { SnackbarService } from '../../shared/snackmessage/snackmessage.component';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
} from '@ecodev/fab-speed-dial';

interface User {
  id: string;
  name: string;
  surname: string;
  lastname: string | null;
  username: string;
  email: string;
  phone: string | null;
  state: string;
  birthday: string | null;
  gender: string;
  identification_type: string;
  identification_number: string;
  planta_code: string;
  profile: {
    id: string;
    name: string;
    state: string;
    enumName: string;
  };
}

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return 'Error desconocido';
}

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterModule,
    ReactiveFormsModule,
    FeatherModule,
    SelectCustomComponent,
    VeilComponent,
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    EcoFabSpeedDialActionsComponent
  ],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss']
})
export class UsersManagementComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'name', 'username', 'email', 'profile', 'state'];
  dataSource: User[] = [];
  filterForm: FormGroup;
  
  // Pagination properties
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [ 10, 25, 50];
  showFirstLastButtons = true;
  showPageSizeOptions = true;
  hidePageSize = false;
  
  loadingTableData = false;
  hideResetfilterButton = false;
  
  profiles = [
    { id: '282aff2b-6611-441f-b36e-556e02a23e26', text: 'Programador' },
    { id: '440dc6b5-5960-4e7d-8819-13254d78c351', text: 'Verificador' },
    { id: '509d8b14-88fb-4322-84e6-95746d9ccdfe', text: 'Líder' },
    { id: '8f300f40-a5e8-472f-82cc-00b85bc0c2de', text: 'Administrador' }
  ];
  
  states = [
    { id: 'ACTIVO', text: 'Activo' },
    { id: 'INACTIVO', text: 'Inactivo' }
  ];
  
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private usersService: UsersService,
    private snackMessage: SnackbarService
  ) {
    this.filterForm = this.fb.group({
      searchText: [''],
      profile: [''],
      state: ['']
    });
  }
  
  ngOnInit(): void {
    // Reset pagination state on initialization
    this.pageIndex = 0;
    this.pageSize = 10;
    
    // Load initial data
    this.loadUsers();
    
    // Monitor filter form changes to show/hide reset button
    this.filterForm.valueChanges.subscribe((values) => {
      this.hideResetfilterButton = Object.values(values).some(value => value);
    });
  }
  
  async loadUsers(): Promise<void> {
    this.loadingTableData = true;
    
    try {
      console.log('Loading users with filters:', {
        searchText: this.filterForm.value.searchText,
        profile: this.filterForm.value.profile,
        state: this.filterForm.value.state,
        take: this.pageSize,
        skip: this.pageIndex
      });
      
      const response = await this.usersService.getAllUsers({
        ...(this.filterForm.value.searchText && {
          searchText: this.filterForm.value.searchText,
        }),
        ...(this.filterForm.value.profile && { 
          profileId: this.filterForm.value.profile 
        }),
        ...(this.filterForm.value.state && { 
          state: this.filterForm.value.state 
        }),
        take: this.pageSize,
        skip: this.pageIndex,
      });
      
      console.log('API Response:', response);
      
      if (response.ok) {
        // Check if response is an array or has a data property
        if (Array.isArray(response.data)) {
          this.dataSource = response.data;
          this.length = response.total || response.data.length;
          console.log('Loaded data source:', this.dataSource);
        } else {
          this.dataSource = [];
          this.length = 0;
          console.error('Unexpected response format:', response);
        }
      } else {
        this.snackMessage.show({
          type: 'simple',
          message: 'Error al consultar los usuarios.',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.snackMessage.show({
        type: 'simple',
        message: 'Error al consultar los usuarios.',
        severity: 'error',
      });
    } finally {
      this.loadingTableData = false;
    }
  }
  
  onFilter(): void {
    this.pageIndex = 0;
    this.loadUsers();
  }
  
  onResetFilter(): void {
    this.filterForm.reset();
    this.hideResetfilterButton = false;
    this.pageIndex = 0;
    this.loadUsers();
  }
  
  handlePageEventChange(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex * this.pageSize;
    console.log('Page changed:', { pageSize: this.pageSize, pageIndex: this.pageIndex });
    this.loadUsers();
  }
  
  openUserDialog(user?: User): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.data = { user: user, isEdit: !!user };
    dialogConfig.panelClass = 'custom-dialog-container';
    
    const dialogRef = this.dialog.open(UserDialogComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }
  
  async toggleUserState(user: User): Promise<void> {
    try {
      // Toggle the current state
      const newState = user.state === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
      
      const response = await this.usersService.updateUserState(user.id, newState);
      
      if (response && response.ok) {
        this.snackMessage.show({
          type: 'simple',
          message: `Usuario ${newState === 'ACTIVO' ? 'activado' : 'desactivado'} exitosamente`,
          severity: 'success',
        });
        this.loadUsers();
      } else {
        throw new Error(response?.message || `Error al ${newState === 'ACTIVO' ? 'activar' : 'desactivar'} usuario`);
      }
    } catch (error) {
      console.error('Error updating user state:', error);
      this.snackMessage.show({
        type: 'simple',
        message: `Error al cambiar estado del usuario: ${getErrorMessage(error)}`,
        severity: 'error',
      });
    }
  }
  
  viewUserDetails(user: User): void {
    // Open user dialog in read-only mode
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.data = { user: user, isEdit: false, readOnly: true };
    dialogConfig.panelClass = 'custom-dialog-container';
    
    this.dialog.open(UserDialogComponent, dialogConfig);
  }
  
  getHeight(element: HTMLElement): number {
    return element.offsetHeight;
  }

  // Function to get full name
  getFullName(user: User): string {
    return `${user.name} ${user.surname} ${user.lastname || ''}`.trim();
  }
} 