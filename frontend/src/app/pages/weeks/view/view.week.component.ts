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
import { CreateditWeekGrupoDialogComponent } from './../create/dialogs/create.weekgroup.dialog.components';
import { SnackbarService } from '@shared/snackmessage/snackmessage.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { WeeksService, WeekGroupsService } from '@services/index';
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
  selector: 'app-view-week',
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
  templateUrl: './view.week.component.html',
  styleUrl: './view.week.component.scss',
})
export class ViewWeekComponent {
  constructor(
    public dialog: MatDialog,
    private snackmessage: SnackbarService,
    private weeksService: WeeksService,
    private weekGroupsService: WeekGroupsService,
    private route: ActivatedRoute
  ) {}

  actionFromRoute = 'VIEW';
  currentWeekId: string;

  prestadoresToVisit = 0;
  prestadoresVisited = 0;
  completedVisits = 0;

  weekData: Record<string, string> = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    week_state: '',
  };

  displayedColumns: string[] = [
    'name',
    'lead',
    'members',
    'prestadores',
    ...(this.actionFromRoute === 'EDIT' ? ['actions'] : []),
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

  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading = false;
  gettingData = false;

  ngOnInit() {}

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateditWeekGrupoDialogComponent, {
      data: {},
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        console.log('result :>> ', result);

        const payload = {
          name: result.name,
          lead: result.lead.id,
          id_week: this.route.snapshot.params['id'],
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

          this.getbyId();
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

  async getbyId() {
    this.gettingData = true;
    const request = await this.weeksService.getWeekById(
      this.route.snapshot.params['id']
    );
    if (request.ok) {
      this.weekData = request;
      this.addedWeekGroups = request.weekGroups.map((group: any) => {
        this.prestadoresToVisit += group.weekgroupprestadores.length;
        this.completedVisits =
          this.prestadoresToVisit - this.prestadoresVisited;
        return {
          id: group.id,
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
    } else {
      this.snackmessage.show({
        type: 'simple',
        title: 'Error',
        message: request.description,
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

    this.getbyId();
  }
}
