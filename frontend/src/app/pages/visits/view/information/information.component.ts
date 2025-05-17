import { Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule, MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-visit-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatChipsModule,
    MatTabsModule,
    MatTooltipModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatButtonToggleModule
  ]
})
export class InformationComponent implements AfterViewInit, OnChanges {
  @Input() visitData: any;
  selectedFiscalYearIndex: number = 0;
  
  // Table related properties
  serviciosDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  serviceDisplayColumns: string[] = ['codigo', 'nombre', 'complejidad', 'modalidades', 'estado', 'horario'];
  complejidadFilter: string | null = null;
  
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('serviciosPaginator') paginator!: MatPaginator;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  
  // Fields to exclude from additional info display (already shown in main sections)
  private excludedFiscalInfoFields: string[] = [
    'id', 'correoPrestador', 'telefonoPrestador', 'codigoSede', 'nombreSede', 
    'correoSede', 'telefonoSede', 'direccionSede', 'nombre_prestador', 
    'habi_codigo_habilitacion', 'codigo_habilitacion', 'numero_sede', 'nits_nit', 
    'dv', 'representante_legal', 'correoRepresentante'
  ];

  // Store the original data and current text filter
  private originalServices: any[] = [];
  private currentTextFilter: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    // When visitData changes, update the data source
    if (changes['visitData'] && changes['visitData'].currentValue) {
      setTimeout(() => {
        this.setupDataSource();
      });
    }
  }

  ngAfterViewInit(): void {
    // Setup paginator and sort
    this.connectSortAndPaginator();
    
    // Listen for tab changes to reinitialize components if needed
    if (this.tabGroup) {
      this.tabGroup.selectedTabChange.subscribe((tabChange: MatTabChangeEvent) => {
        // If switching to the services tab (index 1)
        if (tabChange.index === 1) {
          setTimeout(() => {
            this.connectSortAndPaginator();
          });
        }
      });
    }
  }

  connectSortAndPaginator(): void {
    // Connect the sort and paginator
    if (this.serviciosDataSource) {
      if (this.sort) {
        this.serviciosDataSource.sort = this.sort;
      }
      
      if (this.paginator) {
        this.serviciosDataSource.paginator = this.paginator;
        if (this.serviciosDataSource.data.length > 0) {
          this.paginator.length = this.serviciosDataSource.data.length;
          this.paginator.pageIndex = 0;
        }
        console.log('Paginator initialized with', this.serviciosDataSource.data.length, 'records');
      }
    }
  }

  setupDataSource(): void {
    if (!this.visitData?.prestador?.fiscalYearServicios) {
      console.log('No services data available');
      return;
    }
    
    // Store original data for filtering
    this.originalServices = this.visitData.prestador.fiscalYearServicios || [];
    console.log('Setting up data source with', this.originalServices.length, 'services');
    
    // Initialize data source
    this.serviciosDataSource = new MatTableDataSource(this.originalServices);
    
    // Initialize filter variables
    this.complejidadFilter = null;
    this.currentTextFilter = '';
    
    // Connect sort and paginator if already available
    if (this.sort || this.paginator) {
      this.connectSortAndPaginator();
    }
  }

  // Direct method called from template
  filterByComplejidad(value: string | null): void {
    this.complejidadFilter = value;
    
    if (!this.originalServices || !this.serviciosDataSource) {
      console.warn('No data source or original services available');
      return;
    }
    
    // Apply both text and complexity filters
    let filteredData = [...this.originalServices]; // Start with a copy of all services
    
    // Apply text filter if any
    if (this.currentTextFilter) {
      const searchText = this.currentTextFilter.toLowerCase();
      filteredData = filteredData.filter(service => 
        service.servicio?.name?.toLowerCase().includes(searchText) || 
        service.servicio?.code?.toLowerCase().includes(searchText)
      );
    }
    
    // Apply complexity filter if not null
    if (this.complejidadFilter !== null) {
      filteredData = filteredData.filter(service => 
        service.complejidades === this.complejidadFilter
      );
    }
    
    console.log(`Filtered to ${filteredData.length} of ${this.originalServices.length} services`);
    
    // Update the data source
    this.serviciosDataSource.data = filteredData;
    
    // Reset to first page if paginator exists
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  
  // Apply text filter
  applyServiceFilter(event: Event): void {
    this.currentTextFilter = (event.target as HTMLInputElement).value.trim();
    // Reuse the same filter logic
    this.filterByComplejidad(this.complejidadFilter);
  }
  
  formatFechaReps(fecha: string): string {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES');
  }
  
  formatHorario(horario: string): string {
    if (!horario) return 'No disponible';
    return horario;
  }
  
  /**
   * Check if the fiscal information object has additional fields to display
   * beyond the basic fields already shown in the main sections
   */
  hasAdditionalFiscalInfo(fiscalInfo: any): boolean {
    if (!fiscalInfo) return false;
    
    const allKeys = Object.keys(fiscalInfo);
    return allKeys.some(key => !this.excludedFiscalInfoFields.includes(key));
  }
  
  /**
   * Get fiscal info entries excluding the basic fields already shown in main sections
   */
  getFilteredFiscalInfoEntries(fiscalInfo: any): [string, any][] {
    if (!fiscalInfo) return [];
    
    return Object.entries(fiscalInfo).filter(
      ([key]) => !this.excludedFiscalInfoFields.includes(key)
    );
  }
  
  /**
   * Formats a camelCase or snake_case label into a more readable format
   */
  formatLabel(label: string): string {
    if (!label) return '';
    
    // Replace underscores and hyphens with spaces
    let formatted = label.replace(/[_-]/g, ' ');
    
    // Insert space before capital letters
    formatted = formatted.replace(/([A-Z])/g, ' $1');
    
    // Capitalize first letter and trim
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).trim();
  }
} 