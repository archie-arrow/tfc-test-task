import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-tri-state-checkbox',
  templateUrl: './tri-state-checkbox.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TriStateCheckboxComponent),
      multi: true,
    },
    { provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions },
  ],
  imports: [
    MatCheckboxModule,
    FormsModule
  ]
})
export class TriStateCheckboxComponent implements ControlValueAccessor {
  public tape = [null, true, false];

  public value: boolean | null = null;

  public disabled = false;

  public writeValue(value: boolean | null): void {
    this.value = value || this.tape[0];
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  public next(): void {
    this.value = this.tape[(this.tape.indexOf(this.value) + 1) % this.tape.length];
    this.onChange(this.value);
    this.onTouched();
  }

  public registerOnChange(fn: (val: boolean | null) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  private onChange: (val: boolean | null) => void = () => {
  };
  private onTouched: () => void = () => {
  };
}
