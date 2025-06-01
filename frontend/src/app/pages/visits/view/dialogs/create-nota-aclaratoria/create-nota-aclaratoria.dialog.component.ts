import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { VisitsService } from '@services/visits.service';
import { SnackbarService } from '@shared/snackmessage/snackmessage.component';
import { FeathericonsModule } from '@shared/icons/feathericons/feathericons.module';

@Component({
  selector: 'app-create-nota-aclaratoria-dialog',
  templateUrl: './create-nota-aclaratoria.dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    ReactiveFormsModule,
    QuillModule,
    FeathericonsModule
  ]
})
export class CreateNotaAclaratoriaDialogComponent implements OnInit {
  loading = false;
  
  notaAclaratoriaForm = new FormGroup({
    numeroActaInforme: new FormControl('', [Validators.required]),
    tipoDocumento: new FormControl('', [Validators.required]),
    contenido: new FormControl('', [Validators.required])
  });

  // Quill editor configuration without image upload
  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link']
      // Removed 'image' from toolbar to disable image uploads
    ]
  };

  constructor(
    public dialogRef: MatDialogRef<CreateNotaAclaratoriaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { visitId: string },
    private visitsService: VisitsService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    // Initialize any required data
  }

  async onSubmit(): Promise<void> {
    if (this.notaAclaratoriaForm.valid && !this.loading) {
      this.loading = true;
      
      try {
        const formData = {
          visitId: this.data.visitId,
          numeroActaInforme: this.notaAclaratoriaForm.value.numeroActaInforme,
          tipoDocumento: this.notaAclaratoriaForm.value.tipoDocumento,
          contenido: this.notaAclaratoriaForm.value.contenido
        };

        const response = await this.visitsService.createNotaAclaratoria(formData);

        if (response.ok) {
          this.snackbarService.show({
            type: 'simple',
            message: 'Nota aclaratoria creada correctamente.',
            severity: 'success'
          });
          
          this.dialogRef.close(true);
        } else {
          this.snackbarService.show({
            type: 'detailed',
            title: 'Error',
            message: 'Se encontraron los siguientes errores:',
            errors: response.description || ['Error desconocido'],
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Error creating nota aclaratoria:', error);
        this.snackbarService.show({
          type: 'simple',
          message: 'Error al crear la nota aclaratoria.',
          severity: 'error'
        });
      } finally {
        this.loading = false;
      }
    }
  }
} 