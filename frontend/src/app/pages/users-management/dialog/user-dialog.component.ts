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
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
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
  
  // Signature-related properties
  selectedSignatureFile: File | null = null;
  signaturePreviewUrl: string | null = null;
  currentSignatureUrl: string | null = null;
  
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
      email: [{value: '', disabled: this.readOnly}, [Validators.required, Validators.email]],
      signature: [{value: null, disabled: this.readOnly}, this.isEdit ? [] : Validators.required] // Required for new users
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
      
      // Set current signature URL if exists
      if (user.signature) {
        this.currentSignatureUrl = `${this.usersService.url}/users/signature/${user.signature.split('/').pop()}`;
      }
      
      // Don't require password for edit
      if (this.isEdit) {
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        // Make signature optional for edit
        this.userForm.get('signature')?.clearValidators();
        this.userForm.get('signature')?.updateValueAndValidity();
      }
    }
  }

  // Method to trigger file input click
  triggerFileInput(): void {
    const fileInput = document.getElementById('signature-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  onSignatureFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
        this.snackMessage.show({
          type: 'simple',
          message: 'Solo se permiten archivos de imagen (JPG, JPEG, PNG, GIF)',
          severity: 'error',
        });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.snackMessage.show({
          type: 'simple',
          message: 'El archivo no debe superar los 5MB',
          severity: 'error',
        });
        return;
      }
      
      this.selectedSignatureFile = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.signaturePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Update form control
      this.userForm.patchValue({ signature: file });
    }
  }
  
  removeSignature(): void {
    this.selectedSignatureFile = null;
    this.signaturePreviewUrl = null;
    this.userForm.patchValue({ signature: null });
    
    // Reset file input
    const fileInput = document.getElementById('signature-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  async onSubmit(): Promise<void> {
    if (this.userForm.valid || (this.isEdit && this.isFormValidForEdit())) {
      this.submitting = true;
      try {
        const formData = new FormData();
        const userData = this.userForm.getRawValue();
        
        // Append all user data to FormData
        Object.keys(userData).forEach(key => {
          if (key !== 'signature' && userData[key] !== null && userData[key] !== undefined) {
            // Handle date fields specially
            if (key === 'birthday' && userData[key]) {
              // Convert date to YYYY-MM-DD format to avoid timezone issues
              const date = new Date(userData[key]);
              if (!isNaN(date.getTime())) {
                const formattedDate = date.getFullYear() + '-' + 
                  String(date.getMonth() + 1).padStart(2, '0') + '-' + 
                  String(date.getDate()).padStart(2, '0');
                formData.append(key, formattedDate);
              }
            } else {
              formData.append(key, userData[key]);
            }
          }
        });
        
        // Handle profile mapping
        if (userData.profile) {
          formData.append('profile_id', userData.profile);
        }
        
        // Append signature file if selected
        if (this.selectedSignatureFile) {
          formData.append('signature', this.selectedSignatureFile);
        }
        
        let response;
        if (this.isEdit) {
          // Update user
          response = await this.usersService.updateUserWithSignature(this.data.user.id, formData);
        } else {
          // Create user
          response = await this.usersService.createUserWithSignature(formData);
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
  
  private isFormValidForEdit(): boolean {
    // For edit mode, we only require certain fields
    const requiredFields = ['name', 'surname', 'identification_type', 'identification_number', 'username', 'email', 'profile'];
    return requiredFields.every(field => {
      const control = this.userForm.get(field);
      return control && control.value && control.value.toString().trim() !== '';
    });
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