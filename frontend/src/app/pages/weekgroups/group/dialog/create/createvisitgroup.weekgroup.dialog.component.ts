import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FeathericonsModule } from "../../../../icons/feathericons/feathericons.module";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackmessageComponent } from "@shared/snackmessage/snackmessage.component";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { WeekgroupVisitsService } from "@services/weekgroup-visits.service";
import { VisitTypesEnum } from "@enums/visit-types.enum";
import { SnackbarService } from "@shared/snackmessage/snackmessage.component";
import moment from "moment";
// Add this interface
interface VisitData {
	id: string;
	lead: string | { id: string, name?: string, surname?: string };
	visitType: keyof typeof VisitTypesEnum;
	visitDate: string | Date;
	description?: string;
	notes?: string;
	state?: string;
	prestador?: { id: string, name?: string, code?: string };
}

@Component({
	selector: "app-dialog-create-visit-group",
	templateUrl: "createvisitgroup.dialog.component.html",
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatButtonModule,
		FeathericonsModule,
		MatDialogModule,
		MatCardModule,
		NgScrollbarModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatAutocompleteModule,
		ReactiveFormsModule
	],
	providers: [MatDatepickerModule, MatNativeDateModule],
})
export class CreateVisitGroupDialogComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private weekgroupVisitsService: WeekgroupVisitsService,
		private snackbarService: SnackbarService,
		public dialogRef: MatDialogRef<CreateVisitGroupDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public incomingData: any
	) {
		this.isEdit = !!this.incomingData?.isEdit;
		this.createForm();
	}

	visitTypes = VisitTypesEnum;
	visitForm: FormGroup;
	loading = false;
	isEdit = false;

	filterByWeekRange = (date: Date | null): boolean => {
		if (!date || !this.incomingData?.weekgroup?.weeks?.startDate) return false;

		const startDate = moment(this.incomingData.weekgroup.weeks.startDate);
		const endDate = moment(this.incomingData.weekgroup.weeks.endDate);
		const currentDate = moment(date);

 
		return currentDate >= startDate && currentDate <= endDate;
	}

	createForm(): void {
		this.visitForm = this.fb.group({
			lead: ['', Validators.required],
			visitType: ['', Validators.required],
			visitDate: ['', Validators.required],
			description: [''],
			notes: ['']
		});
	}

	ngOnInit(): void {
		// If editing, populate form with existing visit data
		if (this.isEdit && this.incomingData.visitData && this.incomingData.visitData.visit) {
			const visit: VisitData = this.incomingData.visitData.visit;

			// Convert lead to ID if it's an object
			const leadId = typeof visit.lead === 'object' ? visit.lead.id : visit.lead;

			// Ensure visitDate is a Date object
			const visitDate = visit.visitDate ? new Date(visit.visitDate) : null;

			this.visitForm.patchValue({
				lead: leadId || '',
				visitType: visit.visitType || '',
				visitDate: visitDate,
				description: visit.description || '',
				notes: visit.notes || ''
			});
		}
	}

	async onSubmit(): Promise<void> {
		if (this.visitForm.invalid) {
			this.visitForm.markAllAsTouched();
			return;
		}

		this.loading = true;

		try {
			const formValue = this.visitForm.value;

			const payload = {
				description: formValue.description,
				state: this.isEdit ? this.incomingData.visitData.visit.state : 'ACTIVO',
				visitDate: formValue.visitDate,
				visitType: formValue.visitType,
				weekgroup: this.incomingData.weekgroup.id,
				lead: formValue.lead,
				prestador: this.incomingData.prestador?.id,
				notes: formValue.notes
			};

			let result;

			if (this.isEdit) {
				// Update existing visit
				result = await this.weekgroupVisitsService.updateWeekgroupVisit(
					this.incomingData.visitData.visit.id,
					payload
				);
			} else {
				// Create new visit
				result = await this.weekgroupVisitsService.createWeekgroupVisit(payload);
			}

			if (result.ok) {
				this.snackbarService.show({
					duration: 5000,
					type: 'simple',
					title: 'Éxito',
					message: this.isEdit ? 'Visita actualizada correctamente' : 'Visita agendada correctamente',
					severity: 'success'
				});
				this.dialogRef.close(result);
			} else {
				this.snackbarService.show({
					type: 'simple',
					title: 'Error',
					message: result.description || (this.isEdit ? 'Error al actualizar la visita' : 'Error al agendar la visita'),
					severity: 'error'
				});
			}
		} catch (error) {
			this.snackbarService.show({
				type: 'simple',
				title: 'Error',
				message: this.isEdit ? 'Error al actualizar la visita' : 'Error al agendar la visita',
				severity: 'error'
			});
		} finally {
			this.loading = false;
		}
	}
}
