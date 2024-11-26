import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarListPage } from './car-list.page';

describe('CarListPage', () => {
  let component: CarListPage;
  let fixture: ComponentFixture<CarListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
