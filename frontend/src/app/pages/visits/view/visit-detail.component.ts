import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { VisitsService } from '@services/visits.service';
import { SnackmessageComponent } from '@shared/snackmessage/snackmessage.component';
import { VeilComponent } from '@shared/veil/veil.component';
import { InformationComponent } from './information/information.component';
import { DocumentsComponent } from './documents/documents.component';
import { CriteriaComponent } from './criteria/criteria.component';
import { SnackbarService } from '@shared/snackmessage/snackmessage.component';
@Component({
  selector: 'app-visit-detail',
  templateUrl: './visit-detail.component.html',
  styleUrls: ['./visit-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatCardModule,
    MatListModule,
    MatTabsModule,
    MatTooltipModule,
    VeilComponent,
    InformationComponent,
    DocumentsComponent,
    CriteriaComponent
  ]
})
export class VisitDetailComponent implements OnInit {
  visitId: string = '';
  visitData: any = null;
  gettingData: boolean = false;
  visitStatusMap: { [key: string]: string } = {
    'AGENDADA': 'AGENDADA',
    'COMPLETADA': 'COMPLETADA',
    'COMUNICADO_PENDIENTE_GENERACION': 'PENDIENTE DE GENERACIÓN',
    'COMUNICADO_GENERADO': 'COMUNICADO GENERADO',
    'ACTIVO': 'ACTIVO'
  };

  constructor(
    private route: ActivatedRoute,
    private visitsService: VisitsService,
    private snackmessage: SnackbarService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.visitId = params['id'];
      if (this.visitId) {
        this.getVisitData();
      }
    });
  }

  async getVisitData() {
    this.gettingData = true;
    try {
      const response = await this.visitsService.getVisitById(this.visitId);

      if (response.ok && response.data) {
        this.visitData = response.data;
        console.log('Visit data:', this.visitData);
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      console.error('Error fetching visit data:', error);
      this.showError(error.message);
    } finally {
      this.gettingData = false;
    }
  }

  getVisitStateName(state: string): string {
    return this.visitStatusMap[state] || state;
  }

  getFormattedDate(date: string): string {
    if (!date) return 'No disponible';
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private showError(message: string) {
    console.log('Error:', message);
    this.snackmessage.show({
      type: 'simple',
      message: message,
      severity: 'error',
    });
  }
} 