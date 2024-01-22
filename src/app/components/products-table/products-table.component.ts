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
import { ProductsApiService } from 'app/core/api/products-api.service';
import { Product } from 'app/core/interfaces/product.interface';
import { finalize, Observable } from 'rxjs';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginator,
    LoadingSpinnerComponent
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

  constructor(private productsApiService: ProductsApiService, private cdr: ChangeDetectorRef) {}

  public trackProduct: TrackByFunction<Product> = (index: number, product: Product) => product.id;

  public ngOnInit(): void {
    this.loadProducts().subscribe((products: Product[]) => {
      this.dataSource.data = products;
      this.initPaginator();
      this.cdr.detectChanges();
    });
  }

  private initPaginator(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private loadProducts(): Observable<Product[]> {
    this.isLoading = true;
    return this.productsApiService.getProducts(this.dataLimit).pipe(
      finalize(() => (this.isLoading = false))
    );
  }
}
