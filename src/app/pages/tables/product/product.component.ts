import { Component, OnInit } from '@angular/core';
import { Product } from '../commun/product';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Category } from '../commun/category';

@Component({
  selector: 'ngx-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

  id: number;
  product: Product = new Product();
  categories: Category[];
  //   id: "",
  //   prodNom: "",
  //   prodDescription: "",
  //   prodPrix: "",
  //   prodStock: "",
  //   category_id: ""
  // );
  user: any;
  selectedFiles: FileList;
  currentFile: File;
  timeStamp: number;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
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

    this.id = Number.parseInt(this.route.snapshot.params['id']);
    // this.product = new Product(this.id,'',false,new Date())

    this.timeStamp = (new Date()).getTime();
    // this.product.imgFileName = this.product.imgFileName + '?' + this.timeStamp;

    this.productService.getCategories().subscribe(
      data => this.categories = data,
    );

    if (this.id !== -1) {
    this.productService.getProduct(this.user.sub, this.id).subscribe(
      data => {
        this.product = data;
      },
    );
    }
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
    // console.log(URL.createObjectURL(this.selectedFiles.item(0)));
    // this.product.imgFileName = URL.createObjectURL(this.selectedFiles.item(0));


    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // console.log('1 from reader ' +this.product.imgFileName);
      const reader = new FileReader();
      reader.onload = e => {

        this.product.imgFileName = reader.result.toString();
        // console.log('2 from reader ' +this.product.imgFileName);
      };

      reader.readAsDataURL(file);
  }
  }

  saveProduct() {
    if (this.selectedFiles) {
      this.currentFile = this.selectedFiles.item(0);
    }

    if (this.id === -1) {
        this.productService.createProduct(this.user.sub, this.product, this.currentFile).subscribe(
          data => {
            this.router.navigate(['pages/tables/product-list']);
          },
        );
    } else {
      this.productService.updateProduct(this.user.sub, this.id, this.product, this.currentFile).subscribe(
        data => {
          this.router.navigate(['pages/tables/product-list']);
        },
      );
    }
  }

  getValue() {
    if (this.timeStamp) {
      return this.product.imgFileName + '?' + this.timeStamp;
     }

     return this.product.imgFileName;
  }

  changeValue() {
    if (this.timeStamp) {
      // console.log(this.product.imgFileName);
      this.product.imgFileName = this.product.imgFileName + '?' + this.timeStamp;
      // console.log(this.product.imgFileName);
     }
     return '';
  }
}
