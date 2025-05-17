import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ViewVisitDocumentComponent } from '@pages/visits/view/dialogs/view/view.dialog.component';
import { VisitsService } from '@services/visits.service';
import { ViewCommunicationDocumentComponent } from '../dialogs/view-communication/view-communication.component';

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
          window.location.reload();
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
    return 'Pendiente';
  }
} 