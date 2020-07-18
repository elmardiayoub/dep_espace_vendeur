import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Category } from '../commun/category';
import { Product } from '../commun/product';

@Component({
  selector: 'ngx-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
})
export class ProductsTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Product>;
  // dataSource: ProductsTableDataSource;
  dataSource: MatTableDataSource<Product>;
  categories: Category[];
  user: any;
  message: string;
  timeStamp: number;
  searchKey: string = '';

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'image', 'prodNom',
                      'prodDescription', 'prodPrix', 'prodStock', 'category', 'update', 'delete'];

  constructor(private productService: ProductService,
              private router: Router,
              private authService: NbAuthService) {

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

        // this.dataSource = new ProductsTableDataSource(response);
        this.dataSource = new MatTableDataSource<Product>(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
         this.table.dataSource = this.dataSource;
        //  this.dataSource.filterPredicate = (data, filter) => {
        //   return this.displayedColumns.some(ele => {
        //     return ele != 'update' && ele != 'delete' && data[ele].toLowerCase().indexOf(filter) != -1;
        //   });
        //  }
      },
    );
  }

  // ngAfterViewInit() {
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  //   this.table.dataSource = this.dataSource;

  // }


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
    const category: Category = this.categories?.find(cat => {
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

  onSearchClear() {
    this.searchKey = '';
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }
}
