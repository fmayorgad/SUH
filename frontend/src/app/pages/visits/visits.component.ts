import { NgIf, NgFor } from '@angular/common';
import { Component, ViewChild, OnInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CreateditWeekGrupoDialogComponent } from '../weeks/create/dialogs/create.weekgroup.dialog.components';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FeathericonsModule } from '@pages/icons/feathericons/feathericons.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisitsService } from '../../services/visits.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VeilComponent } from '@shared/veil/veil.component';
import { EcoFabSpeedDialComponent, EcoFabSpeedDialTriggerComponent, EcoFabSpeedDialActionsComponent } from '@ecodev/fab-speed-dial';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SelectCustomComponent } from '@shared/SelectCustomComponent/SelectCustom.component';
import { UsersService } from '@services/users.service';
import { Record } from '@interfaces/general.interface';

@Component({
  selector: 'app-week-groups',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    NgIf,
    NgFor,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FeathericonsModule,
    MatIconModule,
    MatSelectModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    VeilComponent,
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    EcoFabSpeedDialActionsComponent,
    MatFormFieldModule,
    SelectCustomComponent
  ],
  templateUrl: './visits.component.html',
  styleUrl: './visits.component.scss',
})
export class VisitsComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private visitsService: VisitsService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  // Display columns for each tab
  displayedColumns: string[] = [
    'actions',
    'prestador',
    'state',
    'lead',
    'members',
    'services',
  ];

  displayedColumnsPending: string[] = [
    'actions',
    'prestador',
    'lead',
    'members',
    'services',
    'recorridos',
  ];

  displayedColumnsNotInitiated: string[] = [
    'actions',
    'prestador',
    'lead',
    'members',
    'services',
    'recorridos',
    'visitState',
  ];

  displayedColumnsFinished: string[] = [
    'actions',
    'prestador',
    'lead',
    'members',
    'services',
    'recorridos',
  ];

  // Data sources for each tab
  dataSource = new MatTableDataSource<any>([]);
  dataSourceProcess = new MatTableDataSource<any>([]);
  dataSourcePending = new MatTableDataSource<any>([]);
  dataSourceFinish = new MatTableDataSource<any>([]);

  hideResetAllFilterButton = false;
  hideResetProcessFilterButton = false;
  hideResetNotInitiatedFilterButton = false;
  hideResetFinishedFilterButton = false;

  // Pagination settings for each tab
  paginationAll = {
    pageSize: 10,
    pageIndex: 0,
    length: 0
  };

  paginationProcess = {
    pageSize: 10,
    pageIndex: 0,
    length: 0
  };

  paginationNotInitiated = {
    pageSize: 10,
    pageIndex: 0,
    length: 0
  };

  paginationFinished = {
    pageSize: 10,
    pageIndex: 0,
    length: 0
  };

  pageSizeOptions = [10, 12, 16];
  showFirstLastButtons = true;

  // Loading states
  loading = {
    all: false,
    inProcess: false,
    notInitiated: false,
    finished: false
  };

  @ViewChild('allPaginator') allPaginator: MatPaginator;
  @ViewChild('processPaginator') processPaginator: MatPaginator;
  @ViewChild('notInitiatedPaginator') notInitiatedPaginator: MatPaginator;
  @ViewChild('finishedPaginator') finishedPaginator: MatPaginator;

  // Filter form groups for each table
  filterFormAll = new FormGroup({
    searchText: new FormControl(''),
    lead: new FormControl(),
    verificadores: new FormControl(),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  filterFormInProcess = new FormGroup({
    searchText: new FormControl(''),
    lead: new FormControl(),
    verificadores: new FormControl(),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  filterFormNotInitiated = new FormGroup({
    searchText: new FormControl(''),
    lead: new FormControl(),
    verificadores: new FormControl(),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  filterFormFinished = new FormGroup({
    searchText: new FormControl(''),
    lead: new FormControl(),
    verificadores: new FormControl(),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  // Hide reset filter flags for each table
  hideResetFilterAll = false;
  hideResetFilterInProcess = false;
  hideResetFilterNotInitiated = false;
  hideResetFilterFinished = false;

  // Add leads and verificadores arrays
  leads: Record[] = [];
  verificadores: Record[] = [];

  ngOnInit() {
    // Subscribe to form changes for each table
    this.filterFormAll.valueChanges.subscribe((values: any) => {
      this.hideResetFilterAll = Object.values(values).some((value) => value);
    });

    this.filterFormInProcess.valueChanges.subscribe((values: any) => {
      this.hideResetFilterInProcess = Object.values(values).some((value) => value);
    });

    this.filterFormNotInitiated.valueChanges.subscribe((values: any) => {
      this.hideResetFilterNotInitiated = Object.values(values).some((value) => value);
    });

    this.filterFormFinished.valueChanges.subscribe((values: any) => {
      this.hideResetFilterFinished = Object.values(values).some((value) => value);
    });

    // Load initial data
    this.loadAllVisits();
    this.loadInProcessVisits();
    this.loadNotInitiatedVisits();
    this.loadFinishedVisits();
  }

  /**
   * Load visits for the "All" tab
   */
  async loadAllVisits() {
    this.loading.all = true;
    const response = await this.visitsService.getAllVisits({
      ...(this.filterFormAll.value.searchText && {
        searchText: this.filterFormAll.value.searchText,
      }),
      ...(this.filterFormAll.value.lead && {
        lead: this.filterFormAll.value.lead,
      }),
      ...(this.filterFormAll.value.verificadores && {
        verificadores: this.filterFormAll.value.verificadores,
      }),
      take: this.paginationAll.pageSize,
      skip: this.paginationAll.pageIndex,
    });
    
    if (response && response.ok) {
      this.dataSource.data = this.transformVisitData(response.data);
      this.paginationAll.length = response.total;
      
      // Update paginator
      if (this.allPaginator) {
        this.allPaginator.length = response.total;
        this.allPaginator.pageIndex = this.paginationAll.pageIndex / this.paginationAll.pageSize;
      }
      
      this.cdr.detectChanges();
    }
    this.loading.all = false;
  }

  /**
   * Load visits for the "In Process" tab
   */
  async loadInProcessVisits() {
    this.loading.inProcess = true;
    const response = await this.visitsService.getInProcessVisits({
      ...(this.filterFormInProcess.value.searchText && {
        searchText: this.filterFormInProcess.value.searchText,
      }),
      ...(this.filterFormInProcess.value.lead && {
        lead: this.filterFormInProcess.value.lead,
      }),
      ...(this.filterFormInProcess.value.verificadores && {
        verificadores: this.filterFormInProcess.value.verificadores,
      }),
      take: this.paginationProcess.pageSize,
      skip: this.paginationProcess.pageIndex,
    });
    
    if (response && response.ok) {
      this.dataSourceProcess.data = this.transformVisitData(response.data);
      this.paginationProcess.length = response.total;
      
      // Update paginator
      if (this.processPaginator) {
        this.processPaginator.length = response.total;
        this.processPaginator.pageIndex = this.paginationProcess.pageIndex / this.paginationProcess.pageSize;
      }
      
      this.cdr.detectChanges();
    }
    this.loading.inProcess = false;
  }

  /**
   * Load visits for the "Not Initiated" tab
   */
  async loadNotInitiatedVisits() {
    this.loading.notInitiated = true;
    const response = await this.visitsService.getNotInitiatedVisits({
      ...(this.filterFormNotInitiated.value.searchText && {
        searchText: this.filterFormNotInitiated.value.searchText,
      }),
      ...(this.filterFormNotInitiated.value.lead && {
        lead: this.filterFormNotInitiated.value.lead,
      }),
      ...(this.filterFormNotInitiated.value.verificadores && {
        verificadores: this.filterFormNotInitiated.value.verificadores,
      }),
      take: this.paginationNotInitiated.pageSize,
      skip: this.paginationNotInitiated.pageIndex,
    });
    
    if (response && response.ok) {
      this.dataSourcePending.data = this.transformVisitData(response.data);
      this.paginationNotInitiated.length = response.total;
      
      // Update paginator
      if (this.notInitiatedPaginator) {
        this.notInitiatedPaginator.length = response.total;
        this.notInitiatedPaginator.pageIndex = this.paginationNotInitiated.pageIndex / this.paginationNotInitiated.pageSize;
      }
      
      this.cdr.detectChanges();
    }
    this.loading.notInitiated = false;
  }

  /**
   * Load visits for the "Finished" tab
   */
  async loadFinishedVisits() {
    this.loading.finished = true;
    const response = await this.visitsService.getFinishedVisits({
      ...(this.filterFormFinished.value.searchText && {
        searchText: this.filterFormFinished.value.searchText,
      }),
      ...(this.filterFormFinished.value.lead && {
        lead: this.filterFormFinished.value.lead,
      }),
      ...(this.filterFormFinished.value.verificadores && {
        verificadores: this.filterFormFinished.value.verificadores,
      }),
      take: this.paginationFinished.pageSize,
      skip: this.paginationFinished.pageIndex,
    });
    
    if (response && response.ok) {
      this.dataSourceFinish.data = this.transformVisitData(response.data);
      this.paginationFinished.length = response.total;
      
      // Update paginator
      if (this.finishedPaginator) {
        this.finishedPaginator.length = response.total;
        this.finishedPaginator.pageIndex = this.paginationFinished.pageIndex / this.paginationFinished.pageSize;
      }
      
      this.cdr.detectChanges();
    }
    this.loading.finished = false;
  }

  /**
   * Transform API response data to match the expected format for the table
   */
  transformVisitData(data: any[]): any[] {
    return data.map(visit => {
      // Extract members from verificadores fields
      const members = this.extractVerificadores(visit);
      
      // Determine state based on visitState
      let state = 'pending';
      if (visit.state === 'FINISHED' || visit.visitState?.includes('COMPLETADA')) {
        state = 'deactive';
      } else if (visit.state === 'IN_PROCESS' || visit.visitState?.includes('PROCESO')) {
        state = 'active';
      } else if (visit.state === 'NOT_INITIATED') {
        state = 'pending';
      }
      
      return {
        id: visit.id,
        name: visit.prestador?.nombreSede || visit.prestador?.nombrePrestador || 'Sin nombre',
        lead: this.findLeadFromVisit(visit),
        state,
        members,
        visitServicios: visit.visitServicios,
        prestadoresToVisit: this.countServices(visit),
        visitState: visit.visitState || 'PENDIENTE'
      };
    });
  }

  /**
   * Extract verificadores from visitVerificadores array in the visit
   */
  extractVerificadores(visit: any): any[] {
    if (visit.visitVerificadores && Array.isArray(visit.visitVerificadores)) {
      return visit.visitVerificadores.map((verif: { user_id?: { name?: string; lastname?: string; surname?: string } }) => {
        if (verif.user_id) {
          return {
            name: verif.user_id.name || '',
            surname:  verif.user_id.surname || '',
            lastname: verif.user_id.lastname || ''
          };
        }
        return { name: 'Unknown', lastname: 'User' };
      });
    }
    
    // Fallback to old implementation if visitVerificadores is not available
    const verificadoresIds = new Set<string>();
    
    // Collect all verificadores IDs from different service areas
    ['th_verificadores', 'infra_verificadores', 'dotacion_verificadores', 
     'mdi_verificadores', 'procedimientos_verificadores', 'hcr_verificadores', 
     'interdependencias_verificadores'].forEach(field => {
      if (visit[field] && Array.isArray(visit[field])) {
        visit[field].forEach((id: string) => verificadoresIds.add(id));
      }
    });
    
    // For now, return placeholder objects with initials
    // In a real implementation, you would fetch actual user data
    return Array.from(verificadoresIds).map((id, index) => ({
      name: `User${index + 1}`,
      lastname: `Last${index + 1}`
    }));
  }

  /**
   * Find the lead from the visit data using weekgroupVisit.lead
   */
  findLeadFromVisit(visit: any): any {
    if (visit.weekgroupVisit && visit.weekgroupVisit.lead) {
      return {
        name: visit.weekgroupVisit.lead.name || '',
        surname: visit.weekgroupVisit.lead.surname || '',
        lastname: visit.weekgroupVisit.lead.lastname || ''
      };
    }
    
    // Fallback if weekgroupVisit.lead is not available
    return {
      name: 'Lead',
      lastname: 'User'
    };
  }

  /**
   * Count the number of services to verify in the visit
   */
  countServices(visit: any): number {
    // Count non-empty service areas
    let count = 0;
    ['th_todos', 'infra_todos', 'dotacion_todos', 'mdi_todos', 
     'procedimientos_todos', 'hcr_todos', 'interdependencias_todos'].forEach(field => {
      if (visit[field] && visit[field].trim() !== '') {
        count++;
      }
    });
    return count;
  }

  /**
   * Handle page events for all paginators
   */
  onPageChangeAll(event: PageEvent) {
    this.paginationAll.pageSize = event.pageSize;
    this.paginationAll.pageIndex = event.pageIndex * event.pageSize;
    this.loadAllVisits();
  }

  onPageChangeProcess(event: PageEvent) {
    this.paginationProcess.pageSize = event.pageSize;
    this.paginationProcess.pageIndex = event.pageIndex * event.pageSize;
    this.loadInProcessVisits();
  }

  onPageChangeNotInitiated(event: PageEvent) {
    this.paginationNotInitiated.pageSize = event.pageSize;
    this.paginationNotInitiated.pageIndex = event.pageIndex * event.pageSize;
    this.loadNotInitiatedVisits();
  }

  onPageChangeFinished(event: PageEvent) {
    this.paginationFinished.pageSize = event.pageSize;
    this.paginationFinished.pageIndex = event.pageIndex * event.pageSize;
    this.loadFinishedVisits();
  }

  /**
   * Apply filters for each tab
   */
  applyAllFilters() {
    this.paginationAll.pageIndex = 0;
    this.loadAllVisits();
  }

  applyProcessFilters() {
    this.paginationProcess.pageIndex = 0;
    this.loadInProcessVisits();
  }

  applyNotInitiatedFilters() {
    this.paginationNotInitiated.pageIndex = 0;
    this.loadNotInitiatedVisits();
  }

  applyFinishedFilters() {
    this.loadFinishedVisits();
  }

  /**
   * Get the height of an element for the fab-speed-dial
   * @param element The element to get height from
   * @returns The height of the element
   */
  getHeight(element: HTMLElement): string {
    if (element) {
      return element.offsetHeight.toString();
    }
    return '40'; // Default height if element is not available
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateditWeekGrupoDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Reload data if dialog returns a result
        this.loadAllVisits();
        this.loadInProcessVisits();
        this.loadNotInitiatedVisits();
        this.loadFinishedVisits();
      }
    });
  }

  // Filter methods for each table
  onFilterAll() {
    this.loadAllVisits();
  }

  onFilterInProcess() {
    this.loadInProcessVisits();
  }

  onFilterPending() {
    this.loadNotInitiatedVisits();
  }

  onFilterNotInitiated() {
    this.loadNotInitiatedVisits();
  }

  onFilterFinished() {
    this.loadFinishedVisits();
  }

  // Reset filter methods for each table
  onResetFilterAll() {
    this.filterFormAll.reset();
    this.filterFormAll.patchValue({
      startDate: null,
      endDate: null,
    });
    this.loadAllVisits();
  }

  onResetFilterInProcess() {
    this.filterFormInProcess.reset();
    this.filterFormInProcess.patchValue({
      startDate: null,
      endDate: null,
    });
    this.loadInProcessVisits();
  }

  onResetFilterNotInitiated() {
    this.filterFormNotInitiated.reset();
    this.filterFormNotInitiated.patchValue({
      startDate: null,
      endDate: null,
    });
    this.loadNotInitiatedVisits();
  }

  onResetFilterFinished() {
    this.filterFormFinished.reset();
    this.filterFormFinished.patchValue({
      startDate: null,
      endDate: null,
    });
    this.loadFinishedVisits();
  }

  async getVerificadores() {
    const response = await this.usersService.getAllverificadores();

    if (response.ok) {
      this.verificadores = response.map((e: any) => {
        return {
          id: e.id,
          text: `${e.name} ${e.surname || ''} ${e.lastname || ''}`,
          checked: false,
          value: e,
        };
      });

      this.leads = this.verificadores.map((e: any) => {
        return {
          id: e.id,
          text: e.text,
          checked: false,
          value: e,
        };
      });
    }
  }

  async ngAfterViewInit() {
    await this.getVerificadores();
    // ... existing code ...
  }
}
