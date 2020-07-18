import { Component, OnInit } from '@angular/core';
import { Product } from '../commun/product';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Category } from '../commun/category';

@Component({
  selector: 'ngx-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {

  products: Product[];
  categories: Category[];
  user: any;
  message: string;
  timeStamp: number;

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: NbAuthService,
  ) {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload();
      }
    });
   }

  ngOnInit() {

    this.refreshProducts();
  }

  refreshProducts() {
    this.productService.getCategories().subscribe(
      data => this.categories = data,
    );

    this.timeStamp = (new Date()).getTime();
    this.productService.getAllProducts(this.user.sub).subscribe(
      response => {
        // console.log(response);
        this.products = response;
      },
    );
  }

  deleteProduct(id) {
    // console.log(`delete product ${id}`)
    this.productService.deleteProduct(this.user.sub, id).subscribe(
      response => {
        // console.log(response);
        this.message = `Delete of Product ${id} Successful!`;
        this.refreshProducts();
      },
    );
  }

  updateProduct(id) {
    // console.log(`update ${id}`)
    this.router.navigate(['pages/tables/product-list', id]);
  }

  addProduct() {
    this.router.navigate(['pages/tables/product-list', -1]);
  }

  getCategoryName(id: number): string {
    const category: Category = this.categories.find(cat => {
                                if (cat.id === id)
                                  return true;
                                return false;
                              });

    return category.categoryName;
  }

  getLinkPicture(link: string) {
    if (this.timeStamp) {
       return link + '?' + this.timeStamp;
    }
    return link;
  }
}
