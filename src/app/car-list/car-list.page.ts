import { Component, OnInit } from '@angular/core';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.page.html',
  styleUrls: ['./car-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule 
  ],
})
export class CarListPage implements OnInit {
  carImages: { name: string; url: string }[] = [];

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.loadCarImages();
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
    } catch (error) {
      console.error('Erreur lors du chargement des images :', error);
    }
  }

  goToCreateCarPage() {
    this.router.navigate(['/car-creation']);
  }

  getCarDetail(name: string, detail: 'brand' | 'model' | 'licensePlate'): string {
    const parts = name.split('-');
    switch (detail) {
      case 'brand': return parts[0] || 'Inconnu';
      case 'model': return parts[1] || 'Inconnu';
      case 'licensePlate': return parts[2]?.split('_')[0] || 'Inconnu'; 
      default: return 'Inconnu';
    }
  }
}
