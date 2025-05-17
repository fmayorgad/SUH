import { type ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideClientHydration } from "@angular/platform-browser";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { MatNativeDateModule } from "@angular/material/core";
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {AuthGuardService} from '@guards/auth.guard'
import {authInterceptor} from '@interceptors/httpinterceptor'

import {
	MatPaginatorModule,
	MatPaginatorIntl,
  } from '@angular/material/paginator';

import { getPaginatorIntl } from '@shared/pagination/paginationIntl';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideClientHydration(),
		provideAnimationsAsync(),
		importProvidersFrom(MatNativeDateModule),
		provideHttpClient(
			withInterceptors([authInterceptor]) 
		),
		AuthGuardService,
		{ provide: MatPaginatorIntl, useValue: getPaginatorIntl() }
	],
};
