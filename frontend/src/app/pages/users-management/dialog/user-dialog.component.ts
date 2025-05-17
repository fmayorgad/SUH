import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FeathericonsModule } from '../../../shared/icons/feathericons/feathericons.module';
import { MatCardModule } from '@angular/material/card';
import { UsersService } from '../../../services/users.service';
import { SnackbarService } from '../../../shared/snackmessage/snackmessage.component';

enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

enum IdentificationType {
  CC = 'CC',
  CE = 'CE',
  TI = 'TI',
  PASSPORT = 'PASSPORT'
}

enum StateType {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO'
}

enum ContractType {
  CONTRATISTA = 'CONTRATISTA',
  PROFESIONAL_ESPECIALIZADO = 'PROFESIONAL_ESPECIALIZADO',
  PROFESIONAL_UNIVERSITARIO = 'PROFESIONAL_UNIVERSITARIO'
}

interface Profile {
  id: string;
  text: string;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    FeathericonsModule,
    MatCardModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  isEdit: boolean;
  readOnly: boolean;
  dialogTitle: string;
  submitting = false;
  
  genderTypes = Object.values(GenderType);
  identificationTypes = Object.values(IdentificationType);
  stateTypes = Object.values(StateType);
  status = Object.values(ContractType);
  
  profiles: Profile[] = [
    { id: '282aff2b-6611-441f-b36e-556e02a23e26', text: 'Programador' },
    { id: '440dc6b5-5960-4e7d-8819-13254d78c351', text: 'Verificador' },
  ];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private snackMessage: SnackbarService
  ) {
    this.isEdit = data.isEdit;
    this.readOnly = data.readOnly || false;
    
    if (this.readOnly) {
      this.dialogTitle = 'Detalles del Usuario';
    } else {
      this.dialogTitle = this.isEdit ? 'Editar Usuario' : 'Crear Usuario';
    }
    
    this.userForm = this.fb.group({
      name: [{value: '', disabled: this.readOnly}, Validators.required],
      surname: [{value: '', disabled: this.readOnly}, Validators.required],
      lastname: [{value: '', disabled: this.readOnly}],
      birthday: [{value: '', disabled: this.readOnly}],
      gender: [{value: 'MALE', disabled: this.readOnly}],
      identification_type: [{value: 'CC', disabled: this.readOnly}, Validators.required],
      identification_number: [{value: '', disabled: this.readOnly}, Validators.required],
      username: [{value: '', disabled: this.readOnly}, Validators.required],
      password: [{value: '', disabled: this.readOnly || this.isEdit}, this.isEdit ? [] : Validators.required],
      state: [{value: 'ACTIVO', disabled: this.readOnly}],
      planta_code: [{value: '', disabled: this.readOnly}],
      profile: [{value: '', disabled: this.readOnly}, Validators.required],
      status: [{value: 'CONTRATISTA', disabled: this.readOnly}],
      phone: [{value: '', disabled: this.readOnly}],
      email: [{value: '', disabled: this.readOnly}, [Validators.required, Validators.email]]
    });
  }
  
  ngOnInit(): void {
    if ((this.isEdit || this.readOnly) && this.data.user) {
      const user = this.data.user;
      this.userForm.patchValue({
        name: user.name,
        surname: user.surname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        phone: user.phone,
        state: user.state,
        identification_type: user.identification_type || 'CC',
        identification_number: user.identification_number || '',
        gender: user.gender || 'MALE',
        birthday: user.birthday ? new Date(user.birthday) : null,
        planta_code: user.planta_code || '',
        profile: user.profile.id,
        status: user.status || 'CONTRATISTA'
      });
      
      // Don't require password for edit
      if (this.isEdit) {
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      }
    }
  }
  
  async onSubmit(): Promise<void> {
    if (this.userForm.valid) {
      this.submitting = true;
      try {
        const userData = this.userForm.getRawValue(); // Use getRawValue to get values from disabled controls
        
        // Map form field to the backend field name if they're different
        userData.status = userData.status;
        
        let response;
        if (this.isEdit) {
          // Update user
          response = await this.usersService.updateUser(this.data.user.id, userData);
        } else {
          // Create user
          response = await this.usersService.createUser(userData);
        }
        
        if (response && response.ok) {
          this.snackMessage.show({
            type: 'simple',
            message: `Usuario ${this.isEdit ? 'actualizado' : 'creado'} exitosamente`,
            severity: 'success',
          });
          this.dialogRef.close(true);
        } else {
          throw new Error(response?.message || 'Error al procesar la solicitud');
        }
      } catch (error: any) {
        console.error('Error:', error);
        this.snackMessage.show({
          type: 'simple',
          message: `Error al ${this.isEdit ? 'actualizar' : 'crear'} usuario: ${error.message || 'Error desconocido'}`,
          severity: 'error',
        });
      } finally {
        this.submitting = false;
      }
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 