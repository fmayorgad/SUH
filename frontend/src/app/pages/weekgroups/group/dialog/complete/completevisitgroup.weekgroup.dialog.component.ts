import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SnackmessageComponent } from '@shared/snackmessage/snackmessage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiciosService } from '@services/servicios.service';
import { Servicio } from '@interfaces/servicio.interface';
import { SelectCustomComponent, Record } from '@shared/SelectCustomComponent/SelectCustom.component';
import { MatChipsModule } from '@angular/material/chips';
import { VisitsService } from '@services/visits.service';
import moment from 'moment';
@Component({
  selector: 'app-dialog-complete-visit-group',
  templateUrl: 'completevisitgroup.dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FeathericonsModule,
    MatExpansionModule,
    MatDialogModule,
    MatCardModule,
    NgScrollbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    SelectCustomComponent,
    MatChipsModule,
  ],
  styles: [`
    .selected-chips-container {
      margin-top: 15px;
    }
    .servicio-chip {
      margin: 4px;
      background-color: #f0f7ff;
      color: #2c3e50;
      font-weight: 500;
    }
    .remove-icon {
      width: 16px;
      height: 16px;
      margin-left: 5px;
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MatDatepickerModule, MatNativeDateModule, DatePipe],
})
export class CompleteVisitGroupDialogComponent implements OnInit, AfterViewInit {

  @ViewChild(SelectCustomComponent) serviciosSelect: SelectCustomComponent;

  completeVisitForm: FormGroup;
  loading = false;
  servicios: Servicio[] = [];
  serviciosOptions: Record[] = []; // For SelectCustomComponent
  loadingServicios = false;
  selectedServicios: Record[] = []; // Store selected services for display in chips

  constructor(
    private fb: FormBuilder,
    private snackmessage: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public incomingData: any,
    private datePipe: DatePipe,
    private serviciosService: ServiciosService,
    public dialogRef: MatDialogRef<CompleteVisitGroupDialogComponent>,
    private visitsService: VisitsService
  ) { }

  readonly panelOpenState = signal(false);
  recorridos = [];

  // Properties for file handling
  serviciosFile: File | null = null;
  capacidadFile: File | null = null;
  filename1 = 'Seleccionar archivo';
  filename2 = 'Seleccionar archivo';

  showAlert = true;

  dismissAlert() {
    this.showAlert = false;
  }

  async onSubmit(): Promise<void> {
    this.loading = true;

    // Create FormData for file upload
    const formData = new FormData();

    // Add form values to formData
    const formValues = this.completeVisitForm.value;
    for (const key in formValues) {
      if (key !== 'serviciosFile' && key !== 'capacidadFile') {
        // Handle arrays like members and servicios
        if (Array.isArray(formValues[key])) {
          formValues[key].forEach((item: any, index: number) => {
            formData.append(`${key}[${index}]`, item.id || item);
          });
        } else if (formValues[key] !== null && formValues[key] !== undefined) {
          // Convert dates to ISO format
          if (key === 'visitDate' && formValues[key] instanceof Date) {
            formData.append(key, formValues[key].toISOString());
          } else {
            formData.append(key, formValues[key]);
          }
        }
      }
    }

    // Validate required files
    if (!this.serviciosFile) {
      this.snackmessage.openFromComponent(SnackmessageComponent, {
        duration: 5000,
        data: {
          type: 'simple',
          title: 'Error',
          icon: 'error',
          message: 'El archivo de Servicios es requerido',
        },
        panelClass: 'snackError',
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
      this.loading = false;
      return;
    }

    if (!this.capacidadFile) {
      this.snackmessage.openFromComponent(SnackmessageComponent, {
        duration: 5000,
        data: {
          type: 'simple',
          title: 'Error',
          icon: 'error',
          message: 'El archivo de Capacidad Instalada es requerido',
        },
        panelClass: 'snackError',
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
      this.loading = false;
      return;
    }
   
    // Add the files if they exist
    if (this.serviciosFile) {
      formData.append('serviciosFile', this.serviciosFile, this.serviciosFile.name);
    }

    if (this.capacidadFile) {
      formData.append('capacidadFile', this.capacidadFile, this.capacidadFile.name);
    }

    // Add the weekgroupVisitId
    formData.append('weekgroupVisitId', this.incomingData.visit.id);


    try {
      const response = await this.visitsService.createVisit(formData);

      if (response.ok) {
        this.snackmessage.openFromComponent(SnackmessageComponent, {
          duration: 5000,
          data: {
            type: 'simple',
            title: 'Éxito',
            icon: 'check_circle',
            message: `Visita completada correctamente.`,
          },
          panelClass: 'snackSuccess',
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
        this.dialogRef.close(response);
      }
      else {
        this.snackmessage.openFromComponent(SnackmessageComponent, {
          duration: 5000,
          data: {
            type: 'detailed',
            title: 'Error',
            icon: 'error',
            message: 'Se encontraron los siguientes errores:',
            errors: response.description,
          },
          panelClass: 'snackError',
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      }
    } catch (error) {
      this.snackmessage.openFromComponent(SnackmessageComponent, {
        duration: 5000,
        data: {
          type: 'detailed',
          title: 'Error',
          icon: 'error',
          message: 'Se produjo un error al completar la visita',
          errors: error instanceof Error ? [error.message] : ['Error desconocido'],
        },
        panelClass: 'snackError',
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    } finally {
      this.loading = false;
    
    }
  }

  onFilechangeService(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.serviciosFile = file;
      this.filename1 = file.name;
      this.completeVisitForm.get('serviciosFile')?.setValue(file);
    }
  }

  onFilechangeCapacity(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.capacidadFile = file;
      this.filename2 = file.name;
      this.completeVisitForm.get('capacidadFile')?.setValue(file);
    }
  }

  addRecorridos(): void {
    console.log('addRecorridos called');
  }

  filterByWeekRange = (date: Date | null): boolean => {
    if (!date || !this.incomingData?.weekgroup?.weeks?.startDate) return false;

    const startDate = moment(this.incomingData.weekgroup.weeks.startDate);
		const endDate = moment(this.incomingData.weekgroup.weeks.endDate);
    const currentDate = moment(date);

 
    return currentDate >= startDate && currentDate <= endDate;
  }

  async loadServicios() {
    this.loadingServicios = true;
    try {
      if (this.incomingData?.prestador?.id) {
        const response = await this.serviciosService.getServiciosByPrestador(this.incomingData.prestador.id);
        if (response.ok && response.data && response.data.length > 0) {
          this.servicios = response.data;
          this.mapServiciosToSelectCustomFormat();
          this.loadingServicios = false;
          return;
        }
      }

      const response = await this.serviciosService.getAllServicios();
      if (response.ok) {
        this.servicios = response || [];
        this.mapServiciosToSelectCustomFormat();
      } else {
        this.snackmessage.openFromComponent(SnackmessageComponent, {
          duration: 5000,
          data: {
            type: 'simple',
            title: 'Error',
            icon: 'error',
            message: `No se pudieron cargar los servicios: ${response.description || 'Error desconocido'}`,
          },
          panelClass: 'snackError',
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        });
      }
    } catch (error) {
      console.error('Error loading servicios:', error);
      this.snackmessage.openFromComponent(SnackmessageComponent, {
        duration: 5000,
        data: {
          type: 'simple',
          title: 'Error',
          icon: 'error',
          message: 'No se pudieron cargar los servicios. Por favor, intente de nuevo más tarde.',
        },
        panelClass: 'snackError',
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
    } finally {
      this.loadingServicios = false;
    }
  }

  mapServiciosToSelectCustomFormat() {
    this.serviciosOptions = this.servicios.map(servicio => ({
      id: servicio.id,
      name: `${servicio.code} - ${servicio.name}`,
      data: servicio.grupoServicio || '',
      identification_number: servicio.code || '',
      text: `${servicio.code} - ${servicio.name}`
    }));
  }

  // Method to handle removing a service from selection
  removeServicio(servicioId: string): void {
    // Use the new removeById method from the select component if it's available
    if (this.serviciosSelect) {
      this.serviciosSelect.removeById(servicioId);
      // Since this is for the chips, update our locally tracked selectedServicios as well
      this.selectedServicios = this.selectedServicios.filter(s => s.id !== servicioId);
    } else {
      // Fallback if select component isn't available
      const currentSelection = this.completeVisitForm.get('servicios')?.value || [];
      const updatedSelection = Array.isArray(currentSelection)
        ? currentSelection.filter((s: any) => s.id !== servicioId)
        : [];

      this.completeVisitForm.get('servicios')?.setValue(updatedSelection);
      this.selectedServicios = this.selectedServicios.filter(s => s.id !== servicioId);
    }
  }

  // Update the selected services array for display in chips
  updateSelectedServiciosDisplay(): void {
    const selection = this.completeVisitForm.get('servicios')?.value;

    if (Array.isArray(selection)) {
      this.selectedServicios = selection;
    } else if (selection) {
      this.selectedServicios = [selection];
    } else {
      this.selectedServicios = [];
    }
  }

  // Subscribe to form changes to update chips
  setupFormValueChanges(): void {
    this.completeVisitForm.get('servicios')?.valueChanges.subscribe(selection => {
      this.updateSelectedServiciosDisplay();
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.loadServicios();

    if (this.incomingData && this.incomingData.visitData && this.incomingData.visitData.visit) {
      const visit = this.incomingData.visitData.visit;
      this.completeVisitForm.patchValue({
        visitDate: visit.visitDate ? new Date(visit.visitDate) : null,
        members: [visit.lead?.id].filter(id => id),
      });

      if (visit.servicios && Array.isArray(visit.servicios)) {
        setTimeout(() => {
          const servicioIds = visit.servicios.map((s: any) => s.id || s);
          if (servicioIds.length > 0) {
            this.completeVisitForm.patchValue({
              servicios: servicioIds
            });
            this.updateSelectedServiciosDisplay();
          }
        }, 500);
      }
    }

    this.setupFormValueChanges();
  }

  createForm(): void {
    this.completeVisitForm = this.fb.group({
      visitDate: ['', Validators.required],
      sade: ['', Validators.required],
      members: [[], Validators.required],
      servicios: [[], Validators.required],
      serviciosFile: [null, Validators.required],
      capacidadFile: [null, Validators.required],

      // Verificadores
      th_verificadores: [[]],
      th_todos: [''],
      th_propios: [''],
      infra_verificadores: [[]],
      infra_todos: [''],
      infra_propios: [''],
      dotacion_verificadores: [[]],
      dotacion_todos: [''],
      dotacion_propios: [''],
      mdi_verificadores: [[]],
      mdi_todos: [''],
      mdi_propios: [''],
      procedimientos_verificadores: [[]],
      procedimientos_todos: [''],
      procedimientos_propios: [''],
      hcr_verificadores: [[]],
      hcr_todos: [''],
      hcr_propios: [''],
      interdependencias_verificadores: [[]],
      interdependencias_todos: [''],
      interdependencias_propios: [''],
    });
  }

  ngAfterViewInit(): void {
    // We can now safely access the select component
    setTimeout(() => {
      // Add a slight delay to ensure everything is rendered
      if (this.serviciosSelect) {
        // Observe the selected options directly from the component to keep our chips in sync
        this.serviciosSelect.seletedItemEvent.subscribe((selectedItems: Record[]) => {
          this.selectedServicios = selectedItems;
        });
      }
    }, 100);
  }
}
