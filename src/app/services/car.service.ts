import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Car {
  brand: string;
  model: string;
  licensePlate: string;
  photos: {
    front: string;
    back: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private carsFile = 'assets/cars.json';

  constructor(private http: HttpClient) {}

  // Get all cars from the JSON file
  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.carsFile).pipe(
      catchError((error) => {
        console.error('Error fetching cars:', error);
        return of([]); // Return empty array on error
      })
    );
  }

  // Save a new car
  addCar(newCar: Car): Observable<boolean> {
    return this.getCars().pipe(
      map((cars) => {
        cars.push(newCar);
        this.saveCarsToFile(cars);
        return true;
      }),
      catchError((error) => {
        console.error('Error adding car:', error);
        return of(false); // Return false on error
      })
    );
  }

  // Simulated save method (mock)
  private saveCarsToFile(cars: Car[]): void {
    console.log('Saving to JSON:', cars);
    // In a real backend, you would send the updated list to a server.
  }
}
