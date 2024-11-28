import { Component, OnInit } from '@angular/core';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import {add} from 'ionicons/icons';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.page.html',
  styleUrls: ['./car-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
})
export class CarListPage implements OnInit {
  carImages: { name: string; url: string }[] = [];
  filteredCars: { name: string; url: string }[] = [];
  searchText: string = ''; 
  isLoading: boolean = true; 

  constructor(private router: Router) {
    addIcons({add});
  }

  async ngOnInit() {
    await this.loadCarImages();
    this.filteredCars = [...this.carImages]; 
  }

  async loadCarImages() {
    const storage = getStorage(); 
    const carsRef = ref(storage, 'cars');

    try {
      const result = await listAll(carsRef);

      this.carImages = await Promise.all(
        result.items.map(async (itemRef) => ({
          name: itemRef.name,
          url: await getDownloadURL(itemRef), 
        }))
      );

      this.isLoading = false;

    } catch (error) {
      console.error('Erreur lors du chargement des images :', error);
      this.isLoading = false; 
    }
  }

  filterCars() {
    const searchTerm = this.searchText.toLowerCase();
    this.filteredCars = this.carImages.filter(car => {
      const brand = this.getCarDetail(car.name, 'brand').toLowerCase();
      const model = this.getCarDetail(car.name, 'model').toLowerCase();
      return brand.includes(searchTerm) || model.includes(searchTerm); 
    });
  }

  goToCreateCarPage() {
    this.router.navigate(['/car-creation']);
  }

  getCarDetail(name: string, detail: 'brand' | 'model' | 'licensePlate'): string {
    const parts = name.split('-');
  
    switch (detail) {
      case 'brand':
        return parts[0] || 'Inconnu';
        
      case 'model':
        return parts[1] || 'Inconnu';
        
      case 'licensePlate':
        const licensePlateParts = parts.slice(2).join('-'); 
        const plateWithoutSuffix = licensePlateParts.split('_')[0];
        return plateWithoutSuffix || 'Plaque non fournie';
        
      default:
        return 'Inconnu';
    }
  }
  
  

  goToCarDetail(car: { name: string; url: string }) {
    this.router.navigate(['/car-detail'], {
      queryParams: {
        name: car.name,
        url: car.url
      }
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.loadCarImages(); 
      event.target.complete();
    }, 2000);
  }

  
}
