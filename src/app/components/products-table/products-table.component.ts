import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LoadingSpinnerComponent } from '@components/loading-spinner/loading-spinner.component';
import {
  AllowedPriceRangeInterface,
  ProductsTableFilterOptions,
  ProductsTableFiltersComponent
} from '@components/products-table/products-table-filters/products-table-filters.component';
import { ProductsApiService } from 'app/core/api/products-api.service';
import { Product } from 'app/core/interfaces/product.interface';
import { parseJSON } from 'app/helpers/json-parse-fallback';
import { between } from 'app/helpers/number-between';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    LoadingSpinnerComponent,
    ProductsTableFiltersComponent
  ],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTableComponent implements OnInit {
  @ViewChild(MatPaginator)
  public paginator: MatPaginator | undefined;

  public dataLimit = 1000;

  public isLoading = false;

  public dataSource = new MatTableDataSource<Product>();
  public displayedColumns = ['name', 'brand', 'category', 'price', 'quantity'];

  public allowedPriceRange: AllowedPriceRangeInterface = {
    from: 0,
    to: 999
  };

  constructor(private productsApiService: ProductsApiService, private cdr: ChangeDetectorRef) {}

  public trackProduct: TrackByFunction<Product> = (index: number, product: Product) => product.id;

  public ngOnInit(): void {
    this.loadProducts().subscribe((products: Product[]) => {
      this.calculateAllowedPriceRange(products);
      this.initFilterPredicate();
      this.initPaginator();
      this.dataSource.data = products;
      this.cdr.detectChanges();
    });
  }

  private calculateAllowedPriceRange(products: Product[]): void {
    const prices = products.map((p) => p.price);
    this.allowedPriceRange = {
      from: Math.floor(Math.min(...prices)),
      to: Math.ceil(Math.max(...prices)),
    };
  }

  private initPaginator(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private initFilterPredicate(): void {
    this.dataSource.filterPredicate = (row: Product, filter: string) => {
      if (!filter) return true;
      const options = parseJSON<ProductsTableFilterOptions, undefined>(filter, undefined);
      if (!options) return true;

      const rowData = {
        ...row,
        name: `${ row.name } ${ row.brand }`.toLowerCase(),
        inStock: row.quantity > 0
      };

      if (options.name && !rowData.name.includes(options.name.toLowerCase().trim())) return false;
      if (options.price && !between(rowData.price, options.price.from, options.price.to)) return false;
      if (options.category && options.category !== rowData.category) return false;
      if (options.inStock !== null && options.inStock !== rowData.inStock) return false;

      return true;
    };
  }

  private loadProducts(): Observable<Product[]> {
    this.isLoading = true;
    return this.productsApiService.getProducts(this.dataLimit).pipe(
      finalize(() => (this.isLoading = false))
    );
  }

  public onFiltersChange(options: ProductsTableFilterOptions): void {
    this.dataSource.filter = JSON.stringify(options);
  }
}
