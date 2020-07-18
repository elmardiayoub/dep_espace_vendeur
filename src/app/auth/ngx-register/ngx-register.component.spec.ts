import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRegisterComponent } from './ngx-register.component';

describe('NgxRegisterComponent', () => {
  let component: NgxRegisterComponent;
  let fixture: ComponentFixture<NgxRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRegisterComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
