import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ProductsApiService } from 'app/core/api/products-api.service';
import { Product, ProductCategory } from 'app/core/interfaces/product.interface';
import { of } from 'rxjs';
import { ProductsTableComponent } from './products-table.component';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    brand: 'Brand 1',
    category: ProductCategory.Keyboards,
    price: 5,
    quantity: 5,
    rating: 0
  },
  {
    id: '2',
    name: 'Product 2',
    brand: 'Brand 2',
    category: ProductCategory.Mouses,
    price: 10,
    quantity: 22,
    rating: 0
  },
  {
    id: '3',
    name: 'Product 3',
    brand: 'Brand 3',
    category: ProductCategory.Monitors,
    price: 15,
    quantity: 53,
    rating: 0
  },
  {
    id: '4',
    name: 'Product 4',
    brand: 'Brand 4',
    category: ProductCategory.Microphones,
    price: 20,
    quantity: 0,
    rating: 0
  },
];

describe('ProductsTableComponent', () => {
  let component: ProductsTableComponent;
  let fixture: ComponentFixture<ProductsTableComponent>;
  let mockProductsApiService: jasmine.SpyObj<ProductsApiService>;


  beforeEach(() => {
    mockProductsApiService = jasmine.createSpyObj('ProductsApiService', ['getProducts']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductsApiService, useValue: mockProductsApiService },
        provideHttpClientTesting(),
        provideNoopAnimations(),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTableComponent);
    component = fixture.componentInstance;
    mockProductsApiService.getProducts.and.returnValue(of(mockProducts));
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products and update data source', async () => {
    expect(component.isLoading).toBe(false);
    expect(component.dataSource.data).toEqual(mockProducts);
  });

  it('should handle filters change', () => {
    const mockFilters = {
      name: 'Product 1',
      price: { from: 5, to: 15 },
      category: ProductCategory.Cameras,
      inStock: true
    };
    component.onFiltersChange(mockFilters);
    expect(component.dataSource.filter).toEqual(JSON.stringify(mockFilters));
  });

  it('should filter by name', () => {
    component.onFiltersChange({ name: 'Product 1', price: null, category: null, inStock: null });
    expect(component.dataSource.filteredData).toHaveSize(1);

    component.onFiltersChange({ name: 'Product', price: null, category: null, inStock: null });
    expect(component.dataSource.filteredData).toHaveSize(4);
  });

  it('should filter by category', () => {
    component.onFiltersChange({ name: '', price: null, category: ProductCategory.Microphones, inStock: null });
    expect(component.dataSource.filteredData).toHaveSize(1);

    component.onFiltersChange({ name: '', price: null, category: ProductCategory.Cameras, inStock: null });
    expect(component.dataSource.filteredData).toHaveSize(0);
  });

  it('should filter by price', () => {
    component.onFiltersChange({ name: '', price: { from: 0, to: 5 }, category: null, inStock: null });
    expect(component.dataSource.filteredData).toHaveSize(1);

    component.onFiltersChange({ name: '', price: { from: 6, to: 20 }, category: null, inStock: null });
    expect(component.dataSource.filteredData).toHaveSize(3);
  });

  it('should filter by in stock', () => {
    component.onFiltersChange({ name: '', price: null, category: null, inStock: null });
    expect(component.dataSource.filteredData).toHaveSize(4);

    component.onFiltersChange({ name: '', price: null, category: null, inStock: true });
    expect(component.dataSource.filteredData).toHaveSize(3);

    component.onFiltersChange({ name: '', price: null, category: null, inStock: false });
    expect(component.dataSource.filteredData).toHaveSize(1);
  });

});
