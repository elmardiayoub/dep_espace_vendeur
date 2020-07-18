import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './commun/product';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Category } from './commun/category';


@Injectable({
  providedIn: 'root',
})
export class ProductService {

  user: any;
  apiUrl: String = 'http://localhost:8091/';
  constructor(private http: HttpClient, private authService: NbAuthService) {

                this.authService.onTokenChange()
                .subscribe((token: NbAuthJWTToken) => {

                  if (token.isValid()) {
                    this.user = token.getPayload();
                    // here we receive a payload from the token and
                    // assigns it to our `user` variable

                  }
                });
              }

  getAllProducts(username: String) {
    return this.http.get<Product[]>(`${this.apiUrl}api/products/${username}`);
  }

  deleteProduct(username: String, id: number) {
    return this.http.delete(`${this.apiUrl}api/products/${username}/${id}`);
  }

  getProduct(username: String, id: number) {
    return this.http.get<Product>(`${this.apiUrl}api/products/${username}/${id}`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.apiUrl}api/categories`);
  }

  updateProduct(username: String, id: number, productDetails: Product, file: File) {
    const formData: FormData = new FormData();
    const product = JSON.stringify(productDetails);

    formData.append('file', file);
    formData.append('product', product);
    return this.http.put(`${this.apiUrl}api/products/${username}/${id}`, formData);
  }

  createProduct(username: String, productDetails: Product, file: File) {
    // console.log(product);
    const formData: FormData = new FormData();
    const product = JSON.stringify(productDetails);

    formData.append('file', file);
    formData.append('product', product);
    return this.http.post(`${this.apiUrl}api/products/${username}`, formData);
  }
}
