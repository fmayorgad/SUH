import {
  Component,
  ElementRef,
  Inject as InjectData,
  inject,
  model,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { PrestadorService } from '@services/prestador.service';
import { RepsResponse } from '@interfaces/external.interface';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackmessageComponent } from '@shared/snackmessage/snackmessage.component';
import { UsersService } from '@services/users.service';
import { User } from '@interfaces/users.interface';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  SelectCustomComponent,
  Record,
} from '@shared/SelectCustomComponent/SelectCustom.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dialog-CreateditWeekGrupoDialogComponent',
  templateUrl: 'create.weekgroup.dialog.component.html',
  styleUrls: ['create.weekgroup.dialog.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatButtonModule,
    FeathericonsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatIconModule,
    AsyncPipe,
    FormsModule,
    SelectCustomComponent,
  ],
})
export class CreateditWeekGrupoDialogComponent {
  constructor(
    public prestadorService: PrestadorService,
    private UsersService: UsersService,
    private snackmessage: MatSnackBar,
    @InjectData(MAT_DIALOG_DATA) public incomingData: any
  ) {}

  @ViewChild('prestadoresList', { static: true }) prestadoresList: ElementRef;

  prestadores: RepsResponse[] | [] = [];
  typesOfShoes: string[] = [
    'Boots',
    'Clogs',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];
  debouceInput = new Subject<string>();
  searchingForPrestadores = false;
  value = '';
  selectedPrestadores: RepsResponse[] = [];
  selectedPrestadoresIds: string[] = [];
  verificadores: User[] = [];
  multipleverificadores: Record[] = [];
  selectedVerificators: User[] = [];
  loading = false;
  

  readonly dialogRef = inject(MatDialogRef<CreateditWeekGrupoDialogComponent>);

  options: string[] = ['One', 'Two', 'Three'];

  myControl = new FormGroup({
    name: new FormControl(this.incomingData?.data?.name || '', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(50),
    ]),
    lead: new FormControl(this.incomingData?.data?.lead.id, [Validators.required]),
    members: new FormControl<{ value: string }[]>(
      this.incomingData?.data?.members || [],
      [Validators.required]
    ),
    description: new FormControl(this.incomingData?.data?.description || '', [
      Validators.maxLength(200),
    ]),
  });

  submit(): void {
    const formValues = this.myControl.value;

    console.log('formValues :>> ', formValues);
    console.log('this.verificadores :>> ', this.verificadores);

    this.dialogRef.close({
      name: formValues.name,
      lead: this.verificadores.find((e) => e.id === formValues.lead),
      members: formValues.members?.map((e) => e.value || e),
      description: formValues.description,
      selectedPrestadores: this.selectedPrestadores,
    });
  }

  search(text: string) {
    this.searchingForPrestadores = true;
    this.prestadorService.getRepsPrestadores(text).subscribe({
      next: (v) => {
        this.prestadores = v as RepsResponse[];

        (v as []).length === 0 &&
          this.snackmessage.openFromComponent(SnackmessageComponent, {
            duration: 8000,
            data: {
              type: 'simple',
              title: 'Error',
              icon: 'check_circle',
              message: `No hay registro para la busqueda "${text}"`,
            },
            panelClass: 'snackError',
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
          });

        this.searchingForPrestadores = false;
      },
      error: (e) => console.error(e),
    });
  }

  deletePrestadorFromSelectedPrestadores(selectedPrestadorIndex: number) {
    this.selectedPrestadores.splice(selectedPrestadorIndex, 1);
    this.selectedPrestadoresIds = this.selectedPrestadores.map((e) => e.id);
  }

  addSelectedElements(addSelectedElementsList: any) {
    this.selectedPrestadores = [
      ...this.selectedPrestadores,
      ...addSelectedElementsList.map((e: any) => e._value),
    ];
    this.selectedPrestadoresIds = this.selectedPrestadores.map((e) => e.id);
    this.prestadores = [];
    this.value = '';
  }

  addSelectedElementsVerificadores(addSelectedElementsList: Record[]): void {
    console.log(addSelectedElementsList);
    this.selectedVerificators = addSelectedElementsList.map((e) => e.value);
  }

  formatMembers(members: any[]): Record[] {
    return members.map((e: any) => {
      return {
        id: e.id,
        text: `${e.name} ${e.surname || ''} ${e.lastname || ''}`,
        checked: false,
        value: e,
      };
    }) as unknown as any;
  }

  ngOnInit() {
    console.log('this.incomingData :>> ', this.incomingData);

    if (this.incomingData?.data) {
      this.selectedPrestadores = this.incomingData?.data?.selectedPrestadores || [];
      this.selectedPrestadoresIds = this.selectedPrestadores.map((e) => e.id);
      this.selectedVerificators = this.incomingData?.data?.members || [];
      this.myControl.get('members')?.setValue(
        this.incomingData?.data?.members?.map((m: any) => {
          return { value: m };
        }) as unknown as any
      );
    }

     
    this.myControl.get('members')?.valueChanges.subscribe((value) => {  
        console.log("value :>> ", value);
        this.selectedVerificators = value?.map((e: any) => e.value) || [];
      }
    );

    this.UsersService.getVerificadores().subscribe({
      next: (v) => {
        this.verificadores = v as User[];
        this.multipleverificadores = this.verificadores.map((e) => {
          return {
            id: e.id,
            text: `${e.name} ${e.surname || ''} ${e.lastname || ''}`,
            checked: false,
            value: e,
          };
        });
      },

      error: (e) => console.error(e),
    });

    this.debouceInput
      .pipe(
        tap({
          next: (val) => {
            this.searchingForPrestadores = true;
          },
        }),
        debounceTime(1500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.searchingForPrestadores = false;
        this.search(value);
      });
  }
}
