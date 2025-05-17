import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
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
import {
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { User } from '@interfaces/users.interface';
import { FeathericonsModule } from '@pages/icons/feathericons/feathericons.module';
import { UsersService } from '@services/users.service';
import { WeeksService } from '@services/weeks.service';
import { SelectCustomComponent } from '@shared/SelectCustomComponent/SelectCustom.component';
import { SnackbarService } from '@shared/snackmessage/snackmessage.component';
import { Record } from '@interfaces/general.interface';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
} from '@ecodev/fab-speed-dial';
import { MatTooltipModule } from '@angular/material/tooltip';
import { take } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import moment from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VeilComponent } from '@shared/veil/veil.component';
@Component({

  selector: 'app-weeks',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    VeilComponent,
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
  ],
  templateUrl: './weeks.component.html',
  styleUrl: './weeks.component.scss',
})
export class WeeksComponent {
  constructor(
    private usersService: UsersService,
    private snackmessage: SnackbarService,
    private weeksService: WeeksService,
    private cdr: ChangeDetectorRef
  ) {}

  loadingTableData = false;

  length = 0;
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
    'initDate',
    'leads',
    'groups',
    'prestadores',
    'state',
    'endDate',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.getWeeks();
  }

  onResetFilter() {
    this.filterForm.reset();
    this.filterForm.patchValue({
      startDate: null,
      endDate: null,
    });
    this.getWeeks();
  }

  getHeight(e: any) {
    return e.offsetHeight;
  }

  getTotalProviders(weekGroups: any[]): number {
    return weekGroups.reduce(
      (acc, group) => acc + group.weekgroupprestadores.length,
      0
    );
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
    } else {
      this.snackmessage.show({
        type: 'simple',
        message: 'Error al consultar los usuarios.',
        severity: 'error',
      });
    }
  }

  async getWeeks() {
    console.log('this.filterForm.value :>> ', this.filterForm.value);
    this.loadingTableData = true;

    const response = await this.weeksService.getAllWeeks({
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

      const data = response.data.map((e: any) => {
        const uniqueLeads = e.weekGroups.reduce((acc: any, curr: any) => {
          if (!acc.some((l: any) => l.id === curr.leadData.id)) {
            acc.push(curr.leadData);
          }
          return acc;
        }, []);

        return {
          ...e,
          weekleadnotrepeated: uniqueLeads,
        };
      });
      this.loadingTableData = false;
      console.log('data :>> ', data, this.loadingTableData);
      this.dataSource.data = data;
      //this.paginator.length = this.length;
      //this.paginator.pageIndex = this.pageIndex;
      //this.paginator.pageSize = this.pageSize;
      //this.dataSource.paginator = this.paginator;

      
    } else {
      this.loadingTableData = false;
      this.snackmessage.show({
        type: 'simple',
        message: 'Error al consultar los usuarios.',
        severity: 'error',
      });
    }
 
  }

  //detect change on pagination and get weeks again
  handlePageEventChange(e: PageEvent) {
    console.log('e :>> ', e);
    console.log('this.pageEvent :>> ', this.pageEvent);
    console.log('e.pageIndex * e.pageSize :>> ', e.pageIndex * e.pageSize);
    console.log(
      'this.length - (e.pageIndex * e.pageSize) :>> ',
      this.length - e.pageIndex * e.pageSize
    );
    console.log('this.paginator :>> ', this.paginator);

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex * e.pageSize;
    this.pageEvent = e;
    this.getWeeks();
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    this.getVerificadores();
    this.getWeeks();
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((values) => {
      console.log('any changes', values);
      this.hideResetfilterButton = Object.values(values).some((value) => value);
      console.log(
        'this.hideResetfilterButton :>> ',
        this.hideResetfilterButton
      );
    });
  }
}
