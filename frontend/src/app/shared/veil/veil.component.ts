import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-veil',
  standalone: true,
  imports: [NgIf, MatProgressSpinnerModule],
  template: `
    <div class="veil" *ngIf="state">
    <div class="background"></div>
    <div  style="display: flex; flex-direction: column; justify-content: center; align-items: center; margin: auto; z-index: 7;">
    <mat-spinner></mat-spinner>
    <p style="    font-weight: 500; color: #4a4a4a;">{{ message }}</p>
    </div>
    </div>
  `,
  styles: [
    `
    .background {
        position: absolute;
        width: 100%;
        height: 100%; 
        border-radius: 8px;
        backdrop-filter: blur(13px);
      }
    
      .veil {
        width: 100%;
        height: 100%; 
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 1.5rem;
        position: absolute; 
        left: 0;
        top: 0px;
        right: 0;
        border-radius: 8px;
        z-index: 26;
      }

      .veil {
      }
    `,
  ],
})
export class VeilComponent {
  @Input() message: string = '';
  @Input() state: boolean = false;
}
