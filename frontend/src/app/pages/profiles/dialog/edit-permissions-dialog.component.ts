import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfilesService } from '../../../services/profiles.service';
import { SnackbarService } from '../../../shared/snackmessage/snackmessage.component';

interface Module {
  id: string;
  name: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  action: string;
}

@Component({
  selector: 'app-edit-permissions-dialog',
  templateUrl: './edit-permissions-dialog.component.html',
  styleUrls: ['./edit-permissions-dialog.component.scss']
})
export class EditPermissionsDialogComponent implements OnInit {
  profileId: string;
  profileName: string;
  modules: Module[] = [];
  permissions: Permission[] = [];
  currentPermissions: any[] = [];
  profileData: any = null;
  loading = false;
  saving = false;
  panelOpenState: { [key: string]: boolean } = {};
  permissionsByModule: { [moduleId: string]: string[] } = {};

  constructor(
    private dialogRef: MatDialogRef<EditPermissionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profilesService: ProfilesService,
    private snackbarService: SnackbarService
  ) {
    this.profileId = data.profile.id;
    this.profileName = data.profile.name;
    console.log('Constructor - Profile ID:', this.profileId);
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      console.log('Loading data...');
      
      // Load modules
      const modulesResult = await this.profilesService.getAllModules();
      if (modulesResult.ok) {
        this.modules = modulesResult.data;
        console.log('Modules loaded:', this.modules);
      } else {
        this.snackbarService.show({
          severity: 'error',
          message: 'Error al cargar módulos'
        });
      }

      // Load permissions
      const permissionsResult = await this.profilesService.getAllPermissions();
      if (permissionsResult.ok) {
        this.permissions = permissionsResult.data;
        console.log('Permissions loaded:', this.permissions);
      } else {
        this.snackbarService.show({
          severity: 'error',
          message: 'Error al cargar permisos'
        });
      }

      // Load current permissions for this profile
      const profilePermissionsResult = await this.profilesService.getProfilePermissions(this.profileId);
      if (profilePermissionsResult.ok) {
        this.profileData = profilePermissionsResult.data;
        console.log('Profile data loaded:', this.profileData);
        
        // Initialize permissionsByModule regardless of data format
        this.initPermissionsByModule();
        
        // Convert to the format needed for saving
        this.preparePermissionsForSaving();
      } else {
        this.snackbarService.show({
          severity: 'error',
          message: 'Error al cargar permisos del perfil'
        });
      }

      // Set initial panel state
      this.modules.forEach(module => {
        this.panelOpenState[module.id] = false;
      });
    } catch (error) {
      console.error('Error in loadData:', error);
      this.snackbarService.show({
        severity: 'error',
        message: 'Error al cargar datos'
      });
    } finally {
      this.loading = false;
    }
  }

  initPermissionsByModule() {
    // Clear the map
    this.permissionsByModule = {};
    
    try {
      // Initialize for each module in our profile data
      if (this.profileData && this.profileData.modules && Array.isArray(this.profileData.modules)) {
        this.profileData.modules.forEach((module: Module) => {
          if (module && module.id && module.permissions && Array.isArray(module.permissions)) {
            this.permissionsByModule[module.id] = module.permissions.map((p: Permission) => p.id);
          }
        });
      } else {
        console.warn('Profile data not in expected format:', this.profileData);
      }
    } catch (error) {
      console.error('Error in initPermissionsByModule:', error);
    }
    
    console.log('Permissions by module:', this.permissionsByModule);
  }

  preparePermissionsForSaving() {
    // Clear current permissions array
    this.currentPermissions = [];
    
    // For each module in our map, add permissions
    Object.keys(this.permissionsByModule).forEach(moduleId => {
      const permissionIds = this.permissionsByModule[moduleId];
      permissionIds.forEach(permissionId => {
        this.currentPermissions.push({
          profileId: this.profileId,
          moduleId: moduleId,
          permissionId: permissionId
        });
      });
    });
    
    console.log('Prepared permissions for saving:', this.currentPermissions);
  }

  isPermissionAssigned(moduleId: string, permissionId: string): boolean {
    console.log(`Checking permission: module=${moduleId}, permission=${permissionId}`);
    
    if (!this.permissionsByModule) {
      console.warn('permissionsByModule is not initialized');
      return false;
    }
    
    if (this.permissionsByModule[moduleId]) {
      const result = this.permissionsByModule[moduleId].includes(permissionId);
      console.log(`Result for module=${moduleId}, permission=${permissionId}: ${result}`);
      return result;
    }
    
    console.log(`No permissions found for module ${moduleId}`);
    return false;
  }

  togglePermission(moduleId: string, permissionId: string, event: any) {
    console.log(`Toggling permission: module=${moduleId}, permission=${permissionId}, checked=${event.checked}`);
    const isChecked = event.checked;
    
    // Initialize array for this module if it doesn't exist
    if (!this.permissionsByModule[moduleId]) {
      this.permissionsByModule[moduleId] = [];
    }
    
    if (isChecked) {
      // Add permission if not already assigned
      if (!this.permissionsByModule[moduleId].includes(permissionId)) {
        this.permissionsByModule[moduleId].push(permissionId);
        console.log(`Added permission ${permissionId} to module ${moduleId}`);
      }
    } else {
      // Remove permission
      this.permissionsByModule[moduleId] = this.permissionsByModule[moduleId].filter(
        id => id !== permissionId
      );
      console.log(`Removed permission ${permissionId} from module ${moduleId}`);
    }
    
    // Update the flat permissions list for saving
    this.preparePermissionsForSaving();
  }

  async savePermissions() {
    this.saving = true;
    try {
      const result = await this.profilesService.saveProfilePermissions(this.profileId, this.currentPermissions);
      
      if (result.ok) {
        this.snackbarService.show({
          severity: 'success',
          message: 'Permisos guardados correctamente'
        });
        this.dialogRef.close(true);
      } else {
        this.snackbarService.show({
          severity: 'error',
          message: 'Error al guardar permisos: ' + result.message
        });
      }
    } catch (error) {
      console.error(error);
      this.snackbarService.show({
        severity: 'error',
        message: 'Error al guardar permisos'
      });
    } finally {
      this.saving = false;
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }
} 