import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { ProductService } from '../product.service';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss'],
})
export class SmartTableComponent {

  settings = {
    // hideSubHeader: true,
    // actions: {
    //   add: false,
    //   edit: false,
    //   delete: false,
    // },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
      },
      prodNom: {
        title: 'Nom du Produit',
      },
      prodDescription: {
        title: 'Description',
      },
      prodPrix: {
        title: 'Prix',
      },
      prodStock: {
        title: 'Stock',
      },
      category_id: {
        title: 'Category',
      },

    },
  };

  // data: Product[] = [
  //   {
  //     id: '1',
  //     prodNom: 'ttttt',
  //     prodDescription: 'dddddddddd',
  //     prodPrix: 12,
  //     prodStock: 100
  //   },
  //   {
  //     id: '2',
  //     prodNom: 'ttttt',
  //     prodDescription: 'dddddddddd',
  //     prodPrix: 12,
  //     prodStock: 100
  //   },
  //   {
  //     id: '3',
  //     prodNom: 'ttttt',
  //     prodDescription: 'dddddddddd',
  //     prodPrix: 12,
  //     prodStock: 100
  //   },
  // ];

  source: LocalDataSource = new LocalDataSource();
  user: any;
  constructor(private productService: ProductService,
              private authService: NbAuthService) {


    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.user = token.getPayload();
      }
    });

    this.productService.getAllProducts(this.user?.sub).subscribe(
      data => {
        this.source.load(data);
      },
    );

  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event): void {

    // console.log(event);
    // event.confirm.resolve();
    //   this.productService.createProduct(this.user?.sub,event.newData).subscribe(
    //     data => {
    //       console.log(data);
    //     }
    //   );

  }


}
