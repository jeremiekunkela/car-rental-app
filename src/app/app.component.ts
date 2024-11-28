import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}

  toggleDarkMode(event: any) {
    if (event.detail.checked) {
      document.body.classList.add('dark'); 
    } else {
      document.body.classList.remove('dark'); 
    }
  }
}
