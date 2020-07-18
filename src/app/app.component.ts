/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { NbMenuService } from '@nebular/theme';
import { NbAuthService, NbTokenService } from '@nebular/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {


  constructor(private analytics: AnalyticsService,
              private seoService: SeoService,
              private menuService: NbMenuService,
              private authService: NbAuthService,
              protected router: Router,
              protected authToken: NbTokenService,
              ) {

    this.menuService.onItemClick()
      .subscribe((event) => {
        this.onContecxtItemSelection(event.item.title);
      });
  }


  onContecxtItemSelection(title: string) {
    if (title === 'Log out') {
      this.authService.logout('email').subscribe(
        () => {
          // this.authToken.clear().subscribe((data) => {console.log(data); } );
          this.authToken.clear().subscribe();
          this.router.navigateByUrl('/auth/login');
        },
      );

    }
  }


  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
