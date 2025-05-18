import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfilesService } from '../../../services/profiles.service';
import { SnackbarService } from '../../../shared/snackmessage/snackmessage.component';

@Component({
  selector: 'app-edit-permissions-dialog',
  templateUrl: './edit-permissions-dialog.component.html',
  styleUrls: ['./edit-permissions-dialog.component.scss']
})
export class EditPermissionsDialogComponent implements OnInit {
  profileId: string;
  profileName: string;
  modules: any[] = [];
  permissions: any[] = [];
  currentPermissions: any[] = [];
  loading = false;
  saving = false;
  panelOpenState: { [key: string]: boolean } = {};

  constructor(
    private dialogRef: MatDialogRef<EditPermissionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profilesService: ProfilesService,
    private snackbarService: SnackbarService
  ) {
    this.profileId = data.profile.id;
    this.profileName = data.profile.name;
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      // Load modules
      const modulesResult = await this.profilesService.getAllModules();
      if (modulesResult.ok) {
        this.modules = modulesResult.data;
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
      } else {
        this.snackbarService.show({
          severity: 'error',
          message: 'Error al cargar permisos'
        });
      }

      // Load current permissions for this profile
      const profilePermissionsResult = await this.profilesService.getProfilePermissions(this.profileId);
      if (profilePermissionsResult.ok) {
        this.currentPermissions = profilePermissionsResult.data;
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
      console.error(error);
      this.snackbarService.show({
        severity: 'error',
        message: 'Error al cargar datos'
      });
    } finally {
      this.loading = false;
    }
  }

  isPermissionAssigned(moduleId: string, permissionId: string): boolean {
    return this.currentPermissions.some(
      permission => permission.moduleId === moduleId && permission.permissionId === permissionId
    );
  }

  togglePermission(moduleId: string, permissionId: string, event: any) {
    const isChecked = event.checked;
    
    if (isChecked) {
      // Add permission if not already assigned
      if (!this.isPermissionAssigned(moduleId, permissionId)) {
        this.currentPermissions.push({
          profileId: this.profileId,
          moduleId: moduleId,
          permissionId: permissionId
        });
      }
    } else {
      // Remove permission if it exists
      this.currentPermissions = this.currentPermissions.filter(
        permission => !(permission.moduleId === moduleId && permission.permissionId === permissionId)
      );
    }
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