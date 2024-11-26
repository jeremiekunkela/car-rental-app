import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarCreationPage } from './car-creation.page';

describe('CarCreationPage', () => {
  let component: CarCreationPage;
  let fixture: ComponentFixture<CarCreationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
