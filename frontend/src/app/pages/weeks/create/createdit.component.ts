import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink, NavigationCancel, ActivatedRoute } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CreateditWeekGrupoDialogComponent } from './dialogs/create.weekgroup.dialog.components';
import { SnackbarService } from '@shared/snackmessage/snackmessage.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { WeeksService } from '@services/index';
import { VeilComponent } from '@shared/veil/veil.component';

//interfaces
import { Week, Weekgroup, Users } from '@interfaces/index';

import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-createdit-weeks',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDatepickerModule,
    MatTableModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatNativeDateModule,
    RouterLink,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FeathericonsModule,
    MatIconModule,
    CommonModule,
    MatTooltipModule,
    TitleCasePipe,
    MatProgressSpinnerModule,
    VeilComponent,
  ],
  templateUrl: './createdit.component.html',
  styleUrl: './createdit.component.scss',
})
export class CreateditWeeksComponent {
  constructor(
    public dialog: MatDialog,
    private snackmessage: SnackbarService,
    private weeksService: WeeksService,
    private route: ActivatedRoute
  ) {}

  actionFromRoute = '';
  currentWeekId: string;

  displayedColumns: string[] = [
    'name',
    'lead',
    'members',
    'prestadores',
    ...(['CREATE', 'VIEW'].includes(this.actionFromRoute) ? ['actions'] : []),
  ];
  dataSource = new MatTableDataSource<{
    name: string;
    lead: any;
    members: any[];
    actions: string;
    selectedPrestadores?: any[];
    description?: string;
  }>([]);
  addedWeekGroups: {
    name: string;
    lead: any;
    members: any[];
    actions: string;
    selectedPrestadores?: any[];
    description?: string;
  }[] = [];

  createWeekForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    description: new FormControl('', [Validators.maxLength(200)]),
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading = false;
  gettingData = false;

  async onSubmitEdit(): Promise<void> {
    const weekFormValues = this.createWeekForm.getRawValue();
    weekFormValues.startDate = weekFormValues.startDate
      ? new Date(weekFormValues.startDate).toISOString()
      : null;
    weekFormValues.endDate = weekFormValues.endDate
      ? new Date(weekFormValues.endDate).toISOString()
      : null;


    const payload = {
      ...this.createWeekForm.getRawValue(),
    };

    const request = await this.weeksService.updateWeek( this.currentWeekId, payload);

    if (request.ok) {
      this.snackmessage.show({
        type: 'simple',
        message: 'Semana editada correctamente.',
        severity: 'success',
      });

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
  }

  async onSubmitCreate(): Promise<void> {
    const weekFormValues = this.createWeekForm.getRawValue();
    weekFormValues.startDate = weekFormValues.startDate
      ? new Date(weekFormValues.startDate).toISOString()
      : null;
    weekFormValues.endDate = weekFormValues.endDate
      ? new Date(weekFormValues.endDate).toISOString()
      : null;

    //removed the values and just let uuids for weekgroups
    const weekGroups = this.addedWeekGroups.map((group) => {
      return {
        name: group.name,
        description: group.description,
        lead: group.lead.id,
        weekgroupusers: group.members.map((member) => member.id),
        weekgroupprestadores: group.selectedPrestadores?.map(
          (prestador) => prestador.id
        ),
      };
    });

    const payload = {
      ...this.createWeekForm.getRawValue(),
      weekGroups,
    };

    const request = await this.weeksService.createWeek(payload);

    if (request.ok) {
      this.snackmessage.show({
        type: 'simple',
        message: 'Semana creada correctamente.',
        severity: 'success',
      });

      this.loading = false;
      this.createWeekForm.reset();
      this.addedWeekGroups = [];
      this.dataSource = new MatTableDataSource<{
        name: string;
        lead: string;
        members: string[];
        actions: string;
      }>(this.addedWeekGroups);
      this.dataSource.paginator = this.paginator;
    } else {
      this.snackmessage.show({
        type: 'detailed',
        title: 'Error',
        message: 'Se encontraron los siguientes errores:',
        errors: request.description,
        severity: 'error',
      });
    }
  }

  ngOnInit() {
    this.createWeekForm.get('endDate')?.valueChanges.subscribe(() => {
      //reset enddate if startdate past
      if (
        this.createWeekForm.controls.startDate.value &&
        this.createWeekForm.controls.endDate.value &&
        new Date(this.createWeekForm.controls.startDate.value) >
          new Date(this.createWeekForm.controls.endDate.value)
      ) {
        this.createWeekForm.controls.startDate.setValue(null);
      }

      //detech if the labor days between startDate and endDate are less than 5
      const startDate = new Date(
        this.createWeekForm.controls.startDate.value || ''
      );
      const endDateValue = this.createWeekForm.controls.endDate.value;
      const endDate = endDateValue ? new Date(endDateValue) : null;
      const diffTime = endDate
        ? Math.abs(endDate.getTime() - startDate.getTime())
        : 0;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log('diffDays :>> ', diffDays);
      if (diffDays > 5) {
        this.snackmessage.show({
          type: 'simple',
          message: 'Se recomienda un rango no superior a 5',
          severity: 'warning',
        });
      }
    });
  }

  deleteAddedWeekGroup(index: number) {
    this.addedWeekGroups.splice(index, 1);
    this.dataSource = new MatTableDataSource<{
      name: string;
      lead: string;
      members: string[];
      actions: string;
    }>(this.addedWeekGroups);
    this.dataSource.paginator = this.paginator;
  }

  openEditDialog(index: number, rowData: any) {

    console.log('rowData :>> ', rowData);
    const dialogRef = this.dialog.open(CreateditWeekGrupoDialogComponent, {
      data: {data: rowData},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('result :>> ', result);
        this.addedWeekGroups[index] = result;
        this.dataSource = new MatTableDataSource<{
          name: string;
          lead: string;
          members: string[];
          actions: string;
        }>(this.addedWeekGroups);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateditWeekGrupoDialogComponent, {
      data: {}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('result :>> ', result);
        this.addedWeekGroups.push(result);
        this.dataSource = new MatTableDataSource<{
          name: string;
          lead: string;
          members: string[];
          actions: string;
        }>(this.addedWeekGroups);
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  async getbyId() {
    this.gettingData = true;
    const request = await this.weeksService.getWeekById(this.currentWeekId);
    if (request.ok) {
      this.createWeekForm.patchValue({
        name: request.name,
        startDate: request.startDate,
        endDate: request.endDate,
        description: request.description,
      });
      this.addedWeekGroups = request.weekGroups.map((group: any) => {
        return {
          name: group.name,
          lead: group.leadData,
          members: group.weekgroupusers.map((user: any) => user.members),
          actions: 'actions',
          selectedPrestadores: group.weekgroupprestadores,
          description: group.description,
        };
      });

      this.dataSource = new MatTableDataSource<{
        name: string;
        lead: string;
        members: string[];
        actions: string;
      }>(this.addedWeekGroups);
      this.dataSource.paginator = this.paginator;
    }
    else{

      this.snackmessage.show({
        type: 'simple',
        title: 'Error',
        message:  request.description,
        severity: 'error',
      });
    }
    this.gettingData = false;
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<{
      name: string;
      lead: string;
      members: string[];
      actions: string;
    }>([]);
    this.dataSource.paginator = this.paginator;

    this.route.data.subscribe(async (v) => {
      console.log('v :>> ', v);
      this.actionFromRoute = v['permission'];

      if (this.actionFromRoute === 'EDIT') {
        this.currentWeekId = this.route.snapshot.params['id'];
        this.getbyId();
      }

      this.displayedColumns= [
        'name',
        'lead',
        'members',
        'prestadores',
        ...(['CREATE'].includes(this.actionFromRoute) ? ['actions'] : []),
      ];
    });
  }
}

const weektest: any = {
  name: 'semana 13',
  startDate: '2025-04-01T05:00:00.000Z',
  endDate: '2025-04-11T05:00:00.000Z',
  description: 'grupo grande',
  weekGroups: [
    {
      name: 'grupo sura',
      lead: '5e8f9faf-f4ad-4d5f-9976-1aff09222dd0',
      weekgroupusers: [
        '5e8f9faf-f4ad-4d5f-9976-1aff09222dd0',
        '50edd007-f62e-4ecb-b77a-ccb5d3695d47',
      ],
      description: 'nada',
      weekgroupprestadores: ['61494bbd-2328-41e6-9658-cd4984846dcd'],
    },
    {
      name: 'grupo colsaitas',
      lead: '50edd007-f62e-4ecb-b77a-ccb5d3695d47',
      weekgroupusers: ['50edd007-f62e-4ecb-b77a-ccb5d3695d47'],
      description: 'otro',
      weekgroupprestadores: ['2561b8a9-8988-45b8-8896-869514aa28e7'],
    },
  ],
};
