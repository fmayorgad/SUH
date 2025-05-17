import { Component } from '@angular/core';
import {
  FormsModule,
  FormBuilder,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router } from '@angular/router';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { AuthService } from '@services/auth.service';
import { SnackmessageComponent } from '@shared/snackmessage/snackmessage.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { JwtHelperService } from '@auth0/angular-jwt';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
interface DecodedToken {
  name: string;
  surname: string;
}

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    MatIconButton,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FeathericonsModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgIf,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServices: AuthService,
    private snackmessage: MatSnackBar
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Password Hide
  hide = true;

  loading = false;

  // Form
  authForm: FormGroup;
  onSubmit() {
    if (this.authForm.valid) {
      this.loading = true;
      this.authServices
        .login(
          this.authForm.get('email')?.value,
          this.authForm.get('password')?.value
        )
        .subscribe({
          next: (v) => {
            localStorage.setItem('token', v.token);

            const userModulesArray = JSON.parse(v.userModules);
            const userModulesObject = userModulesArray.modules.reduce(
              (acc: any, module: any) => {
                acc[module.realName] = {
                  ...module,
                  permissions: module.permissions.reduce(
                    (acc: any, permission: any) => {
                      acc.push(permission.action);
                      return acc;
                    },
                    []
                  ),
                  subModules: module.subModules.reduce(
                    (acc: any, permission: any) => {
                      acc[permission.realName] = {
                        ...permission,
                        permissions: permission.permissions.reduce(
                          (acc: any, permission: any) => {
                            acc.push(permission.action);
                            return acc;
                          },
                          []
                        ),
                      };
                      return acc;
                    },
                    {}
                  ),
                };
                return acc;
              },
              {}
            );

            localStorage.setItem('modules', JSON.stringify(userModulesObject));
            const helper = new JwtHelperService();
            const token = localStorage.getItem('token') as string;
            const decoded = helper.decodeToken(token) as DecodedToken | null;

            if (decoded) {
              this.router.navigate(['apps']);
              this.snackmessage.openFromComponent(SnackmessageComponent, {
                duration: 8000,
                data: {
                  type: 'simple',
                  title: 'Error',
                  icon: 'check_circle',
                  message: `Bienvenid@ ${decoded.name} ${decoded.surname}`,
                },
                panelClass: 'snackSuccess',
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
              this.loading = false;
            } else {
              console.error('Token decoding failed.');
            }
          },
          error: (e) => {
            this.snackmessage.openFromComponent(SnackmessageComponent, {
              duration: 8000,
              data: {
                type: 'simple',
                title: 'Error',
                icon: 'report_off',
                message: e.error.description,
              },
              panelClass: 'snackError',
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }
}
