import { Component, DestroyRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { TriStateCheckboxComponent } from '@components/tri-state-checkbox/tri-state-checkbox.component';
import { ProductCategory } from 'app/core/interfaces/product.interface';

export interface AllowedPriceRangeInterface {
  from: number;
  to: number;
}

export interface ProductsTableFilterOptions {
  name: string | null;
  category: ProductCategory | null;
  inStock: boolean | null;
  price: AllowedPriceRangeInterface | null;
}

@Component({
  selector: 'app-products-table-filters',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    TriStateCheckboxComponent
  ],
  templateUrl: './products-table-filters.component.html',
  styleUrl: './products-table-filters.component.scss'
})
export class ProductsTableFiltersComponent implements OnChanges, OnInit {
  @Input({ required: true })
  public allowedPriceRange!: AllowedPriceRangeInterface;

  @Output()
  public filtersChange = new EventEmitter<ProductsTableFilterOptions>();

  public categories = Object.values(ProductCategory);

  public priceForm = new FormGroup({
    from: new FormControl(0, { nonNullable: true }),
    to: new FormControl(0, { nonNullable: true }),
  });

  public form = new FormGroup({
    name: new FormControl(''),
    category: new FormControl(null),
    inStock: new FormControl(null),
    price: this.priceForm
  });

  constructor(private destroyRef: DestroyRef) {
  }

  public ngOnInit(): void {
    this.form.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.filtersChange.emit(this.form.getRawValue()));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['allowedPriceRange']) {
      this.priceForm.patchValue(this.allowedPriceRange);
    }
  }

  public priceRangeDisplayFn = (value: number) => `${ value }$`;
}
