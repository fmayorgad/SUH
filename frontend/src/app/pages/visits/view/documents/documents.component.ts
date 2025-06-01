import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ViewVisitDocumentComponent } from '@pages/visits/view/dialogs/view/view.dialog.component';
import { VisitsService } from '@services/visits.service';
import { ViewCommunicationDocumentComponent } from '../dialogs/view-communication/view-communication.component';
import { CreateNotaAclaratoriaDialogComponent } from '../dialogs/create-nota-aclaratoria/create-nota-aclaratoria.dialog.component';

@Component({
  selector: 'app-visit-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DocumentsComponent implements OnInit {
  @Input() visitData: any;
  @Output() visitDataChange = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog,
    private visitsService: VisitsService
  ) {}

  ngOnInit(): void {
    console.log('Visit data in documents component:', this.visitData);
  }

  /**
   * Opens the document view dialog based on notification status
   */
  openViewDocumentVisit() {
    // Determine which dialog to open based on notification status
    if (this.visitData?.notification_sended) {
      // For visits that have been notified, open read-only view
      this.dialog.open(ViewCommunicationDocumentComponent, {
        data: {
          visitId: this.visitData?.id
        },
        width: '90vw',
        maxWidth: '90vw',
        height: '90vh'
      }).afterClosed().subscribe();
    } else {
      // For visits that haven't been notified, open editable view
      this.dialog.open(ViewVisitDocumentComponent, {
        data: {
          visitId: this.visitData?.id
        },
        width: '90vw',
        maxWidth: '90vw',
        height: '90vh'
      }).afterClosed().subscribe(result => {
        if (result) {
          // Reload parent component if needed
          this.visitDataChange.emit(this.visitData);
        }
      });
    }
  }

  /**
   * Gets the completion status text for a step
   */
  getStepStatus(stepNumber: number): string {
    if (stepNumber === 1) {
      return this.visitData?.notification_sended ? 'Completado' : 'En proceso';
    }
    if (stepNumber === 2) {
      return this.visitData?.notification_sended ? 'En proceso' : 'Pendiente';
    }
    return 'Pendiente';
  }

  /**
   * Opens the create nota aclaratoria dialog
   */
  openCreateNotaAclaratoria() {
    this.dialog.open(CreateNotaAclaratoriaDialogComponent, {
      data: {
        visitId: this.visitData?.id
      },
      width: '80vw',
      maxWidth: '800px',
      height: 'auto',
      maxHeight: '90vh'
    }).afterClosed().subscribe(result => {
      if (result) {
        // Reload visit data to show the new note
        this.visitDataChange.emit(this.visitData);
      }
    });
  }

  /**
   * Opens a dialog to view a specific visit note
   */
  viewNota(nota: any) {
    // For now, we'll use a simple alert to show the note content
    // You can create a dedicated dialog component for viewing notes later
    const noteContent = `
      Tipo: ${nota.type || 'N/A'}
      Acta N°: ${nota.acta_number || 'N/A'}
      Justificación: ${nota.justification || 'N/A'}
      Contenido: ${nota.body || 'N/A'}
      Fecha de creación: ${nota.createdAt ? new Date(nota.createdAt).toLocaleString('es-ES') : 'N/A'}
    `;
    
    alert(`Detalles de la Nota:\n\n${noteContent}`);
    
    // TODO: Create a proper dialog component for viewing notes
    // this.dialog.open(ViewNotaDialogComponent, {
    //   data: { nota },
    //   width: '80vw',
    //   maxWidth: '800px',
    //   height: 'auto',
    //   maxHeight: '90vh'
    // });
  }
} 