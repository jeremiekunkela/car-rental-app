import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-creation',
  templateUrl: './car-creation.page.html',
  styleUrls: ['./car-creation.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class CarCreationPage implements OnInit {
  carData = {
    brand: '',
    model: '',
    licensePlate: '',
    photos: {
      front: null as File | null,
      back: null as File | null
    }
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  onFileSelected(event: Event, type: 'front' | 'back') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.carData.photos[type] = input.files[0];
    }
  }

  validateLicensePlate(plate: string): boolean {
    const platePattern = /^[A-Z0-9-]+$/; 
    return platePattern.test(plate);
  }

  async onSubmit() {
    if (!this.validateLicensePlate(this.carData.licensePlate)) {
      alert('La plaque d\'immatriculation est invalide. Utilisez uniquement des lettres, chiffres et tirets.');
      return;
    }

    const db = getFirestore(); 
    const storage = getStorage(); 

    try {
      const photoUrls: { front: string; back: string } = {
        front: '',
        back: ''
      };

      for (const type of ['front', 'back'] as const) {
        const photo = this.carData.photos[type];
        if (photo) {
          const structuredName = `${this.carData.brand}-${this.carData.model}-${this.carData.licensePlate}_${type}`;
          const storageRef = ref(storage, `cars/${structuredName}`);
          await uploadBytes(storageRef, photo);
          const downloadUrl = await getDownloadURL(storageRef);
          photoUrls[type] = downloadUrl;
        }
      }

      const carCollection = collection(db, 'cars');
      const structuredCarName = `${this.carData.brand}-${this.carData.model}-${this.carData.licensePlate}`;
      await addDoc(carCollection, {
        name: structuredCarName, 
        brand: this.carData.brand,
        model: this.carData.model,
        licensePlate: this.carData.licensePlate,
        photos: photoUrls
      });

      alert('Voiture ajoutée avec succès !');
      this.goToCarListPage(); 
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la voiture :', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  goToCarListPage() {
    this.router.navigate(['/car-list']);
  }
}
