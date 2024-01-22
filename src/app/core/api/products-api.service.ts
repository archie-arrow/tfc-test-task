import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'app/core/interfaces/product.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsApiService {
  constructor(private http: HttpClient) {}

  public getProducts(limit = 1000): Observable<Product[]> {
    return this.http.get<Product[]>('assets/products.json').pipe(
      map((res) => res.slice(0, limit)),
    );
  }
}
