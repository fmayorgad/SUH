import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ToggleService {

    private isToggled = new BehaviorSubject<boolean>(false);

    get isToggled$() {
        return this.isToggled.asObservable();
    }

    toggle() {
        const current = this.isToggled.value;
        this.isToggled.next(!this.isToggled.value);
        localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
        localStorage.setItem('isToggled',current ? 'false' : 'true');
    }

    // Dark Mode
    private isDarkTheme: boolean;

    constructor() {
        console.log('ssss this.toggled :>> ', JSON.parse(localStorage.getItem('isToggled')!));
        // Dark Mode
        this.isDarkTheme = JSON.parse(localStorage.getItem('isDarkTheme')!);
        this.isDarkTheme && document.body.classList.add('dark-theme')
        this.isToggled.next(JSON.parse(localStorage.getItem('isToggled')!));
    }

    // Dark Mode
    toggleTheme() {
        !this.isDarkTheme ? document.body.classList.add('dark-theme') : document.body.classList.remove('dark-theme');
        this.isDarkTheme = !this.isDarkTheme;
        localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme));
    }
    isDark() {
        return this.isDarkTheme;
    }

}