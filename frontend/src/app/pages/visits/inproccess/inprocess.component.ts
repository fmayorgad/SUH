import { NgIf, NgFor } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatRadioModule } from '@angular/material/radio';
import { FeathericonsModule } from '@pages/icons/feathericons/feathericons.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SeparateCriteriaDialogComponent } from './../dialogs/separate/separate.dialog.component';
import { VerifyCriteriaDialogComponent } from './../dialogs/verify/verify.dialog.component';

@Component({
  selector: 'app-inprocess-component',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterOutlet,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    FeathericonsModule,
    MatTableModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
  ],
  templateUrl: './inprocess.component.html',
  styleUrl: './inprocess.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class InprocessComponent {
  constructor(public dialog: MatDialog) {}

  checked = true;
  displayedColumns: string[] = [
    'index',
    'description',
    'creator',
    'subgroup',
    'standard',
    'declaredServices',
    'nonDeclaredServices',
    'state',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  expandedElement: any | null;

  myControl = new FormGroup({
    description: new FormControl('', [Validators.maxLength(200)]),
  });

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  openSeparateDialog() {
    const dialogRef = this.dialog.open(SeparateCriteriaDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openVerifyeDialog(data: any): void {
    const dialogRef = this.dialog.open(VerifyCriteriaDialogComponent, {});
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    console.log('weeks');
  }
}

const ELEMENT_DATA: any[] = [
  {
    index: '11.1.5.1',
    description:
      'El prestador de servicios de salud cuenta con una política de seguridad del paciente acorde con los lineamientos del Ministerio de Salud y Proteccion Social.',
    type: 'Específico',
    subgroup: 'Urgencias',
    standard: 'TALENTO HUMANO',
    state: 'closed',
  },

  {
    index: '11.1.5.2',
    description:
      'El prestador de servicios de salud cuenta con un comite o instancia que orienta y promueve la política de seguridad del paciente, el control de infecciones y la optimización del uso de antinbióticos...',
    type: 'Específico',
    subgroup: 'Urgencias',
    standard: 'TALENTO HUMANO',
    state: 'active',
  },
  /* {
		index : '11.1.5.2',
		description : 'El prestador de servicios de salud realiza activididades en	seguridad del paciente.',
		type : 'Específico',
		subgroup : 'Urgencias',
		standard : 'TALENTO HUMANO',
		state : true,
	},
	{
		index : '11.1.5.2',
		description : 'El prestador de servicios de salud cuenta con un comite o instancia que orienta y promueve la política de seguridad del paciente, el control de infecciones y la optimización del uso de antinbióticos...',
		type : 'Específico',
		subgroup : 'Urgencias',
		standard : 'TALENTO HUMANO',
		state : false,
	} */
];
