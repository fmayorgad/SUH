import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FeathericonsModule } from "@icons/feathericons/feathericons.module";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgScrollbarModule } from "ngx-scrollbar";
import { ChangeDetectionStrategy, signal } from "@angular/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SnackmessageComponent } from "@shared/snackmessage/snackmessage.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VisitsService } from "@services/visits.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { VeilComponent } from "@shared/veil/veil.component";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

// No need to import PDF.js since we're using the iframe approach
// import * as pdfjsLib from 'pdfjs-dist';

@Component({
	selector: "app-view-document-visit",
	templateUrl: "view.dialog.component.html",
	standalone: true,
	styles: [`
		.error-container {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 500px;
			text-align: center;
			padding: 20px;
		}

		.dialogContent{
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}

		.formcontainerstyled{
		    height: 100%;
    		overflow-y: auto;
   			overflow-x: hidden;
		}

		.formcontainer{
			width: 350px;
			padding: 0px 15px;
    		height: 100%;
			overflow: auto;
		}
		
		.error-container mat-icon {
			font-size: 48px;
			height: 48px;
			width: 48px;
			margin-bottom: 16px;
		}
		
		.error-container p {
			color: #666;
			font-size: 16px;
		}
		
		.dialog-actions {
			display: flex;
			justify-content: flex-end;
			padding: 16px;
			gap: 10px;
			border-top: 1px solid rgba(0, 0, 0, 0.12);
		}
		
		#pdfViewerCanvas {
			width: 100%;
			height: 100%;
			overflow: auto;
		}
	`],
	imports: [
		CommonModule,
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
		PdfViewerModule,
		VeilComponent,
		ReactiveFormsModule,
		FormsModule
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [MatDatepickerModule, MatNativeDateModule],
})
export class ViewVisitDocumentComponent implements OnInit, OnDestroy, AfterViewInit {
	// No need for ViewChild since we're using getElementById
	// @ViewChild('pdfViewerCanvas') pdfViewerCanvas: ElementRef | null = null;

	constructor(
		private snackmessage: MatSnackBar,
		private visitsService: VisitsService,
		private sanitizer: DomSanitizer,
		private fb: FormBuilder,
		private http: HttpClient,
		public dialogRef: MatDialogRef<ViewVisitDocumentComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { visitId: string }
	) { }

	readonly panelOpenState = signal(false);
	readonly isLoading = signal(false);
	readonly hasError = signal(false);
	readonly visitId = signal('');
	readonly pdfTitle = signal('COMUNICADO DE VISITA');

	showAlert = true;
	completeVisitForm!: FormGroup;
	isSendingData = signal(false);

	dismissAlert() {
		this.showAlert = false;
	}

	// We need to keep track of blob URL for cleanup
	private blobUrl: string | null = null;

	// No longer needed since we're not using PDF.js
	// useNativePdfJs = true;

	// PDF viewer error handler
	handleError = (error: any) => {
		console.error('PDF viewer error:', error);
		this.hasError.set(true);
		this.showError('Error al renderizar el PDF: ' + (error.message || 'Error desconocido'));
	}

	async ngOnInit() {
		this.initForm();

		if (this.data?.visitId) {
			this.visitId.set(this.data.visitId);
			// Loading moved to ngAfterViewInit
		} else {
			this.showError('No se proporcionó el ID de la visita');
			this.hasError.set(true);
		}
	}

	initForm() {
		this.completeVisitForm = this.fb.group({
			visitDate: ['', ],
			sade: ['', ],
			representativeName: ['', ],
			correoRepresentante: ['', [ Validators.email]]
		});
	}

	// Filter function for date picker to only allow dates within the visit week range
	filterByWeekRange = (d: Date | null): boolean => {
		// This is just a placeholder. In a real scenario, you would get the valid date range 
		// from the visit data and apply the filter accordingly
		const today = new Date();
		const minDate = new Date(today);
		minDate.setDate(today.getDate() - 30); // Allow dates from 30 days ago

		const maxDate = new Date(today);
		maxDate.setDate(today.getDate() + 30); // Allow dates up to 30 days in the future

		return d ? d >= minDate && d <= maxDate : false;
	}

	async ngAfterViewInit() {
		// Load PDF after the view is initialized to ensure container is available
		if (this.data?.visitId) {
			await this.loadComunicadoPdf();
		}
	}

	ngOnDestroy() {
		// Clean up blob URL when component is destroyed
		this.cleanupBlobUrl();
	}

	private cleanupBlobUrl() {
		if (this.blobUrl) {
			URL.revokeObjectURL(this.blobUrl);
			this.blobUrl = null;
		}
	}

	async loadComunicadoPdf() {
		this.isLoading.set(true);
		this.hasError.set(false);

		try {
			const response = await this.visitsService.getComunicado(this.visitId());

			// Clean up previous URL if it exists
			this.cleanupBlobUrl();

			// Render the PDF using the iframe approach
			await this.renderPdf(response);

		} catch (error) {
			console.error('Error loading PDF:', error);
			this.showError('No se pudo cargar el PDF del comunicado');
			this.hasError.set(true);
		} finally {
			this.isLoading.set(false);
		}
	}

	/**
	 * Render PDF using iframe approach
	 */
	private async renderPdf(buffer: ArrayBuffer): Promise<void> {
		try {
			// Wait for the DOM element to be available
			await this.waitForElement('pdfViewerCanvas');

			// Get the container div
			const containerDiv = document.getElementById('pdfViewerCanvas');
			if (!containerDiv) {
				throw new Error('PDF container element not found');
			}

			// Clear any previous content
			containerDiv.innerHTML = '';

			// Create a blob from the buffer
			const blob = new Blob([buffer], { type: 'application/pdf' });
			this.blobUrl = URL.createObjectURL(blob);

			// Use an iframe to display the PDF
			const iframe = document.createElement('iframe');
			iframe.style.width = '100%';
			iframe.style.height = '99%';
			iframe.style.border = 'none';
			iframe.src = this.blobUrl;

			containerDiv.appendChild(iframe);
			console.log('PDF rendered in iframe');
		} catch (error: any) {
			console.error('Error rendering PDF:', error);
			this.hasError.set(true);
			this.showError('Error al renderizar el PDF: ' + (error.message || 'Error desconocido'));
		}
	}

	/**
	 * Wait for an element to be available in the DOM
	 */
	private waitForElement(elementId: string, maxAttempts = 10): Promise<void> {
		return new Promise((resolve, reject) => {
			let attempts = 0;

			const checkElement = () => {
				const element = document.getElementById(elementId);
				if (element) {
					console.log(`Element ${elementId} found in the DOM`);
					resolve();
					return;
				}

				attempts++;
				if (attempts >= maxAttempts) {
					reject(new Error(`Element ${elementId} not found after ${maxAttempts} attempts`));
					return;
				}

				console.log(`Waiting for element ${elementId}, attempt ${attempts}/${maxAttempts}`);
				setTimeout(checkElement, 100);
			};

			checkElement();
		});
	}

	onClose(): void {
		this.dialogRef.close();
	}

	async modifyVisit(): Promise<void> {

		try {
			this.isSendingData.set(true);

			const formValues = this.completeVisitForm.value;

			// Transform form data to match the expected API format

			//We dont send values empty or null or undefined
			const formData = {
				...(formValues.sade && { sade: formValues.sade }),
				...(formValues.representativeName && { nombre_representante_legal: formValues.representativeName }),
				...(formValues.visitDate && { visit_date: formValues.visitDate instanceof Date ?
					formValues.visitDate.toISOString().split('T')[0] : // Format as YYYY-MM-DD
					formValues.visitDate,
				}),
				...(formValues.correoRepresentante && { correo_representante: formValues.correoRepresentante })
			};

			// Send data to backend
			await this.visitsService.updateVisitData(this.visitId(), formData);

			this.showSuccess('Datos de la visita actualizados correctamente');

			// Close dialog after successful update
			this.dialogRef.close(true);
		} catch (error: any) {
			console.error('Error updating visit data:', error);
			this.showError(error.error.message);
		} finally {
			this.isSendingData.set(false);
		}
	}

	async notifyVisit(): Promise<void> {
		try {
			this.isSendingData.set(true);

			// Call service to send notification
			await this.visitsService.sendVisitNotification(this.visitId());

			this.showSuccess('Notificación enviada correctamente');

			// Close dialog after successful notification
			this.dialogRef.close(true);
		} catch (error) {
			console.error('Error sending notification:', error);
			this.showError('No se pudo enviar la notificación');
		} finally {
			this.isSendingData.set(false);
		}
	}

	private showError(message: string) {
		this.snackmessage.openFromComponent(SnackmessageComponent, {
			duration: 5000,
			data: {
				type: 'simple',
				icon: 'error',
				message: message,
				severity: 'error',
			},
			panelClass: 'snackError',
			horizontalPosition: 'right',
			verticalPosition: 'bottom',
		});
	}

	private showSuccess(message: string) {
		this.snackmessage.openFromComponent(SnackmessageComponent, {
			duration: 5000,
			data: {
				type: 'simple',
				icon: 'check',
				message: message,
				severity: 'success',
			},
			panelClass: 'snackSuccess',
			horizontalPosition: 'right',
			verticalPosition: 'bottom',
		});
	}
}
