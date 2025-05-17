import { Injectable } from '@angular/core';
import {
  Router,
  Route,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

interface RouteDate {
  strategy: string;
  permission: string;
  avaliableBy: string;
}

@Injectable()
export class AuthGuardService {
  constructor(public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const jwt = new JwtHelperService();
    const token = localStorage.getItem('token');
    const modules = JSON.parse(localStorage.getItem('modules') as string);

    if (!token) {
      this.router.navigate(['login'], {
        skipLocationChange: true,
        queryParams: { status: 400 },
      });
      return false;
    }

    if (jwt.isTokenExpired(token)) {
      this.router.navigate(['login'], {
        skipLocationChange: true,
        queryParams: { status: 401 },
      });
      return false;
    }
    
    const routeData = route.routeConfig?.data as RouteDate;
    const routeTocheck = routeData.strategy.split('/');
    console.log('routeTocheck :>> ', routeData);

    const permission = routeTocheck.reduce(
      (p: Record<string, any>, c: string, i: number, a: string[]) => {
        return p?.[c]
          ? i === a.length - 1
            ? p?.[c].permissions
            : p?.[c].subModules || p?.[c].permissions
          : [];
      },
      modules
    );

    if (
      Array.isArray(permission) &&
      permission.includes(routeData.permission)
    ) {
      return true;
    }
    return true;
  }
  canLoad(route: Route): boolean {
    return true;
  }
}
