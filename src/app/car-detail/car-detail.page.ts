import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.page.html',
  styleUrls: ['./car-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule]
})
export class CarDetailPage implements OnInit {
  carName: string = '';
  frontImageUrl: string = '';
  backImageUrl: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.carName = params['name'];
      this.frontImageUrl = params['url'];

      // Charger l'image arrière (supposons un suffixe "-back" pour la cohérence)
      const storage = getStorage();
      const backImageRef = ref(storage, `cars/${this.carName.replace('.jpg', '-back.jpg')}`);
      getDownloadURL(backImageRef)
        .then(url => this.backImageUrl = url)
        .catch(() => console.error('Image arrière non trouvée'));
    });
  }
}

