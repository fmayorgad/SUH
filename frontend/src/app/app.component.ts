declare let $: any;
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from './pages/common/header/header.component';
import { FooterComponent } from './pages/common/footer/footer.component';
import { ToggleService } from './pages/common/header/toggle.service';
import { SidebarComponent } from './pages/common/sidebar/sidebar.component';
import { CommonModule, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterOutlet, Router, NavigationCancel, NavigationEnd, RouterLink } from '@angular/router';
import {LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EcoFabSpeedDialComponent, EcoFabSpeedDialTriggerComponent, EcoFabSpeedDialActionsComponent} from '@ecodev/fab-speed-dial';
import { MatTooltipModule } from '@angular/material/tooltip';
registerLocaleData(localeEs, 'es');
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, RouterLink, SidebarComponent, HeaderComponent, FooterComponent, MatSnackBarModule, MatTooltipModule ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [
        
  EcoFabSpeedDialComponent,
  EcoFabSpeedDialTriggerComponent,
  EcoFabSpeedDialActionsComponent,
        Location, {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        },
        {provide: LOCALE_ID, useValue: 'es'}
    ]
})
export class AppComponent {

    title = 'S.U.H Visitas';
    routerSubscription: any;
    location: any;

    constructor(
        public router: Router,
        public toggleService: ToggleService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.toggleService.isToggled$.subscribe(isToggled => {
            this.isToggled = isToggled;
        });
    }

    // Toggle Service
    isToggled = false;

    // Dark Mode
    toggleTheme() {
        console.log("jejeje")
        this.toggleService.toggleTheme();
    }

    // Settings Button Toggle
    toggle() {
        this.toggleService.toggle();
    }

    // ngOnInit
    ngOnInit(){
        if (isPlatformBrowser(this.platformId)) {
            this.recallJsFuntions();
        }
    }

    // recallJsFuntions
    recallJsFuntions() {
        this.routerSubscription = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
            .subscribe(event => {
            this.location = this.router.url;
            if (!(event instanceof NavigationEnd)) {
                return;
            }
            this.scrollToTop();
        });
    }
    scrollToTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
        }
    }

}