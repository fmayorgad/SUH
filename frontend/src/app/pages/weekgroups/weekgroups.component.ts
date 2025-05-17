import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
} from '@ecodev/fab-speed-dial';
import { FeathericonsModule } from '@pages/icons/feathericons/feathericons.module';
import { UsersService } from '@services/users.service';
import { WeekGroupsService } from '@services/weekgroups.service';
import { SelectCustomComponent } from '@shared/SelectCustomComponent/SelectCustom.component';
import { SnackbarService } from '@shared/snackmessage/snackmessage.component';
import { Record } from '@interfaces/general.interface';
import { User } from '@interfaces/users.interface';
import moment from 'moment';
import { take } from 'rxjs';
import { CreateditWeekGrupoDialogComponent } from '@pages/weeks/create/dialogs/create.weekgroup.dialog.components';
import { MatDialog } from '@angular/material/dialog';
import { VeilComponent } from '@shared/veil/veil.component';

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-weekgroups',
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
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    FeathericonsModule,
    MatDatepickerModule,
    SelectCustomComponent,
    EcoFabSpeedDialComponent,
    EcoFabSpeedDialTriggerComponent,
    EcoFabSpeedDialActionsComponent,
    MatTooltipModule,
    MatProgressSpinnerModule,
    VeilComponent,
  ],
  templateUrl: './weekgroups.component.html',
  styleUrls: ['./weekgroups.component.scss'],
})
export class WeekGroupsComponent { 
  route: any;
  loading: boolean;
  constructor(
    private usersService: UsersService,
    private snackmessage: SnackbarService,
    private weekGroupsService: WeekGroupsService,
    public dialog: MatDialog,
  ) {}

  loadingTableData = false;

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [10, 20, 50];

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  hideResetfilterButton = false;

  pageEvent: PageEvent;

  displayedColumns: string[] = [
    'actions',
    'name',
    'lead',
    'members',
    'prestadores',
    'weekState',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  getHeight(e: any) {
    return e.offsetHeight;
  }

  getTotalProviders(weekGroups: any[]): number {
    return weekGroups.reduce(
      (acc, group) => acc + group.weekgroupprestadores.length,
      0
    );
  }



  filterForm = new FormGroup({
    searchText: new FormControl(''),
    lead: new FormControl(),
    verificadores: new FormControl(),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  verificadores: Record[] = [];
  leads: Record[] = [];

  onFilter() {
    this.getWeekGroups();
  }

  openCreateDialog() {
      const dialogRef = this.dialog.open(CreateditWeekGrupoDialogComponent, {
        data: {
            message: 'Se agregará un nuevo Grupo de Semana ACTIVA en este momento.',
        },
      });
      dialogRef.afterClosed().subscribe(async (result: any) => {
        if (result) {
          console.log('result :>> ', result);
  
          const payload = {
            name: result.name,
            lead: result.lead.id,
            description: result.description,
            weekgroupusers: result.members.map((member: any) => member.id),
            weekgroupprestadores: result.selectedPrestadores.map(
              (prestador: any) => prestador.id
            ),
          };
  
          const request = await this.weekGroupsService.createWeekGroup(payload);
  
          if (request.ok) {
            this.snackmessage.show({
              type: 'simple',
              message: 'Grupo de Semana agregado correctamente.',
              severity: 'success',
            });
  
            this.getWeekGroups();
            this.loading = false;
          } else {
            this.snackmessage.show({
              type: 'detailed',
              title: 'Error',
              message: 'Se encontraron los siguientes errores:',
              errors: request.description,
              severity: 'error',
            });
          }
  
          console.log('payload :>> ', payload);
  
          /* this.addedWeekGroups.push(result);
          this.dataSource = new MatTableDataSource<{
            name: string;
            lead: string;
            members: string[];
            actions: string;
          }>(this.addedWeekGroups);
          this.dataSource.paginator = this.paginator; */
        }
      });
    }
    getbyId() {
        throw new Error('Method not implemented.');
    }

  onResetFilter() {
    this.filterForm.reset();
    this.filterForm.patchValue({
      startDate: null,
      endDate: null,
    });
    this.getWeekGroups();
  }

  async getVerificadores() {
    const response = await this.usersService.getAllverificadores();

    if (response.ok) {
      this.verificadores = response.map((e: any) => ({
        id: e.id,
        text: `${e.name} ${e.surname || ''} ${e.lastname || ''}`,
        checked: false,
        value: e,
      }));

      this.leads = this.verificadores.map((e: any) => ({
        id: e.id,
        text: e.text,
        checked: false,
        value: e,
      }));
    } else {
      this.snackmessage.show({
        type: 'simple',
        message: 'Error al consultar los usuarios.',
        severity: 'error',
      });
    }
  }

  async getWeekGroups() {
    this.loadingTableData = true;

    const response = await this.weekGroupsService.getAllWeekGroups({
      ...(this.filterForm.value.startDate && {
        startDate: this.filterForm.value.startDate,
      }),
      ...(this.filterForm.value.endDate && {
        endDate: moment(this.filterForm.value.endDate).format('YYYY-MM-DD'),
      }),
      ...(this.filterForm.value.searchText && {
        searchText: this.filterForm.value.searchText,
      }),
      ...(this.filterForm.value.lead && { lead: this.filterForm.value.lead }),
      ...(this.filterForm.value.verificadores && {
        verificadores: this.filterForm.value.verificadores,
      }),
      take: this.pageSize,
      skip: this.pageIndex,
    });

    if (response.ok) {
      this.length = response.total;

      console.log('response.data.total :>> ', response.data);

      this.dataSource.data = response.data;
    } else {
      this.snackmessage.show({
        type: 'simple',
        message: 'Error al consultar los grupos.',
        severity: 'error',
      });
    }
    this.loadingTableData = false;
  }

  handlePageEventChange(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex * e.pageSize;
    this.pageEvent = e;
    this.getWeekGroups();
  }

  ngAfterViewInit() {
    this.getVerificadores();
    this.getWeekGroups();
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((values) => {
      this.hideResetfilterButton = Object.values(values).some((value) => value);
    });
  }
}
