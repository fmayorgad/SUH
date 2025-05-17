import { Component, Inject, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FeathericonsModule } from "@icons/feathericons/feathericons.module";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { SnackmessageComponent } from "@shared/snackmessage/snackmessage.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VisitsService } from "@services/visits.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { VeilComponent } from "@shared/veil/veil.component";
import { ChangeDetectionStrategy, signal } from "@angular/core";

@Component({
	selector: "app-view-communication-document",
	template: `
		<div class="largeVerticalDialogContainer">
			<h3 mat-dialog-title>
				COMUNICADO DE VISITA ENVIADO
			</h3>

			<ng-container >
				<div class="pdf-container" style="width: 100%; height: calc(100% - 144px);; overflow: auto;">
					<!-- Using just ID without #reference for pure JS access -->
					<div id="pdfViewerCanvas" style="width: 100%;"></div>
				</div>
			</ng-container>

			<div *ngIf="hasError()" class="error-container">
				<mat-icon color="warn">error</mat-icon>
				<p>No se pudo cargar el documento. Por favor, intente nuevamente más tarde.</p>
			</div>

			<div class="dialog-actions">
				<div class="infoText">
					<p class="mb-0 flexi">
						<mat-icon color="primary" class="align-middle">info</mat-icon>
						Este comunicado ya ha sido enviado al prestador y no puede ser modificado.
					</p>
				</div>
				<button mat-button color="primary" [disabled]="isLoading()" (click)="onClose()">CERRAR</button>
			</div>
		</div>
	`,
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
			justify-content: space-between;
			align-items: center;
			padding: 16px;
			gap: 10px;
			border-top: 1px solid rgba(0, 0, 0, 0.12);
		}
		
		.infoText {
			display: flex;
			align-items: center;
		}
		
		.infoText mat-icon {
			margin-right: 8px;
		}
		
		#pdfViewerCanvas {
			width: 100%;
			height: 100%;
			overflow: auto;
		}
	`],
	standalone: true,
	imports: [
		CommonModule,
		MatDialogModule,
		MatButtonModule,
		FeathericonsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		VeilComponent
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewCommunicationDocumentComponent implements OnInit, OnDestroy, AfterViewInit {
	constructor(
		private snackmessage: MatSnackBar,
		private visitsService: VisitsService,
		private sanitizer: DomSanitizer,
		public dialogRef: MatDialogRef<ViewCommunicationDocumentComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { visitId: string }
	) { }

	readonly isLoading = signal(false);
	readonly hasError = signal(false);
	readonly visitId = signal('');

	// We need to keep track of blob URL for cleanup
	private blobUrl: string | null = null;

	async ngOnInit() {
		if (this.data?.visitId) {
			this.visitId.set(this.data.visitId);
			// Loading moved to ngAfterViewInit
		} else {
			this.showError('No se proporcionó el ID de la visita');
			this.hasError.set(true);
		}
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
} 