export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  brand: string;
  price: number;
  rating: number;
}

export enum ProductCategory {
  Keyboards = 'Keyboards',
  Mouses = 'Mouses',
  Cameras = 'Cameras',
  Microphones = 'Microphones',
  Monitors = 'Monitors',
}
