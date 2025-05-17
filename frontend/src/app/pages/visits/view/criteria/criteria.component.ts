import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-visit-criteria',
  templateUrl: './criteria.component.html',
  styleUrls: ['./criteria.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule
  ]
})
export class CriteriaComponent {
  @Input() visitData: any;
} 