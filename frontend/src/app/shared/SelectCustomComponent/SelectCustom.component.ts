import { Component, forwardRef, Input, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Output, EventEmitter } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FeathericonsModule } from '@pages/icons/feathericons/feathericons.module';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'select-custom',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    FeathericonsModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatCardModule,
    MatCheckboxModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectCustomComponent),
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => SelectCustomComponent),
    },
  ],
  templateUrl: './SelectCustom.component.html',
  styleUrl: './SelectCustom.component.scss',
})
export class SelectCustomComponent implements ControlValueAccessor, Validator {
  private onChange: any = () => {};
  private onTouched: any = () => {};

  // Filter Autocomplete
  @Input() options: Record[] = [];
  @Input() placeholder = '';
  @Input() label = '';
  @Input() disabled = false;
  @Input() required = false;
  @Input() icon = '';
  @Output() seletedItemEvent = new EventEmitter<Record[]>();
  @Input() control: FormControl;
  @Input() incomingData: any[] = [];

  myControl = new FormControl();
  filteredOptions: Observable<Record[]>;
  selectedOptions: Record[] = [];
  lastFilter = '';
  touched = false;

  contexLabel = this.label;

  optionClicked(event: Event, option: Record) {
    event.stopPropagation();
    this.toggleSelection(option);
  }

  getAllTexts(options: Record[]): string {
    return options.map((option) => option.text).join(', ');
  }

  displayFn(value: Record[] | string): string {
    return '';
  }

  toggleSelection(record: Record) {
    this.markAsTouched();
    const index = this.selectedOptions.findIndex(
      (item) => item.id === record.id
    );

    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(record);
    }

    this.seletedItemEvent.emit([...this.selectedOptions]);
    this.myControl.setValue('');

    this.onChange([...this.selectedOptions]);

    if (this.selectedOptions.length === 0) {
      this.contexLabel = this.label;
    } else {
      this.contexLabel = `${
        this.selectedOptions.length > 1
          ? `${this.selectedOptions.length} seleccionados`
          : this.getAllTexts(this.selectedOptions)
      }`;
    }
  }

  /**
   * Removes an option from the selection by its ID
   * @param id The ID of the option to remove
   */
  removeById(id: string): void {
    this.markAsTouched();
    const indexToRemove = this.selectedOptions.findIndex(option => option.id === id);
    
    if (indexToRemove !== -1) {
      this.selectedOptions.splice(indexToRemove, 1);
      
      this.seletedItemEvent.emit([...this.selectedOptions]);
      this.myControl.setValue('');

      this.onChange([...this.selectedOptions]);
      
      if(this.selectedOptions.length === 0) {
        this.contexLabel = this.label;
      } else {
        this.contexLabel = `${
          this.selectedOptions.length > 1
            ? `${this.selectedOptions.length} seleccionados`
            : this.getAllTexts(this.selectedOptions)
        }`;
      }
    }
  }

  isSelected(option: Record): boolean {
    return this.selectedOptions.some(item => item.id === option.id);
  }

  filter(filter: string): Record[] {
    this.lastFilter = filter;
    if (filter) {
      return this.options.filter((option) => {
        return (
          option.text.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
          option.text.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        );
      });
    }
    return this.options.slice();
  }

  writeValue(value: Record[] | null): void {
    if (value && Array.isArray(value)) {
      this.selectedOptions = [...value];
    } else {
      this.selectedOptions = [];
    }

    if (this.selectedOptions.length === 0) {
      this.contexLabel = this.label;
    } else {
      this.contexLabel = `${
        this.selectedOptions.length > 1
          ? `${this.selectedOptions.length} seleccionados`
          : this.getAllTexts(this.selectedOptions)
      }`;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.selectedOptions.length === 0 && this.touched) {
      return {
        required: true,
      };
    }
    return null;
  }

  ngOnChanges(changes: any) {
    if (changes.options) {
      this.options = changes.options.currentValue.map((option: Record) => {
        const found = this.incomingData.find(
          (selected) => selected.id === option.id
        );
        if (found) {
          return option;
        }
        return option;
      });

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith<string | Record[]>(''),
        map((value) => (typeof value === 'string' ? value : this.lastFilter)),
        map((filter) => this.filter(filter))
      );
    }
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : this.lastFilter)),
      map((filter) => this.filter(filter))
    );
    this.contexLabel = this.label;
  }
}

export interface Record {
  [x: string]: any;
  id: string;
  text: string;
  disabled?: boolean;
  value?: any;
}
