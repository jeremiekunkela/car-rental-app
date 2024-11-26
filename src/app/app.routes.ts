import { Routes } from '@angular/router';
import { LoginPage } from './login/login.page';
import { RegistrationPage } from './registration/registration.page';
import { CarListPage } from './car-list/car-list.page';
import { CarCreationPage } from './car-creation/car-creation.page';
import { CarDetailPage } from './car-detail/car-detail.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'registration',
    component: RegistrationPage
  },
  {
    path: 'car-list',
    component: CarListPage
  },
  {
    path: 'car-creation',
    component: CarCreationPage
  },
  {
    path: 'car-detail/:id',
    component: CarDetailPage
  }
];
