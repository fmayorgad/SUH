import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProfilesService } from '../../services/profiles.service';
import { EditPermissionsDialogComponent } from './dialog/edit-permissions-dialog.component';
import { SnackbarService } from '../../shared/snackmessage/snackmessage.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['actions', 'name', 'description', 'createdAt', 'state'];
  dataSource = new MatTableDataSource<any>([]);
  loadingTableData = false;
  filterForm: FormGroup;
  hideResetfilterButton = true;

  // Pagination
  length = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25, 100];
  showFirstLastButtons = true;
  showPageSizeOptions = true;
  hidePageSize = false;

  constructor(
    private profilesService: ProfilesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {
    this.filterForm = this.fb.group({
      searchText: [''],
      state: [[]]
    });
  }

  ngOnInit(): void {
    this.loadProfiles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async loadProfiles() {
    this.loadingTableData = true;
    
    try {
      const filters = {
        ...this.filterForm.value,
        skip: this.pageIndex * this.pageSize,
        take: this.pageSize
      };

      const result = await this.profilesService.getAllProfiles(filters);
      
      if (result.ok) {
        this.dataSource.data = result.data;
        this.length = result.total;
      } else {
        this.snackbarService.show({
          severity: 'error',
          message: 'Error al cargar perfiles: ' + result.message
        });
      }
    } catch (error) {
      this.snackbarService.show({
        severity: 'error',
        message: 'Error al cargar perfiles'
      });
      console.error(error);
    } finally {
      this.loadingTableData = false;
    }
  }

  handlePageEventChange(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadProfiles();
  }

  onFilter() {
    this.pageIndex = 0;
    this.loadProfiles();
  }

  onResetFilter() {
    this.filterForm.reset({
      searchText: '',
      state: []
    });
    this.pageIndex = 0;
    this.loadProfiles();
  }

  openEditPermissionsDialog(profile: any) {
    const dialogRef = this.dialog.open(EditPermissionsDialogComponent, {
      width: '600px',
      maxHeight: '90vh',
      data: { profile }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbarService.show({
          severity: 'success',
          message: 'Permisos actualizados correctamente'
        });
      }
    });
  }

  getHeight(element: HTMLElement): number {
    return element ? element.clientHeight : 48;
  }
} 