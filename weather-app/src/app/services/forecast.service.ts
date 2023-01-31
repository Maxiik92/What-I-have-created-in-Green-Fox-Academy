import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Forecast } from './forecast';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  apiKey: string = environment.apiKey;

  constructor(private http: HttpClient) {}

  getForecast(city: string): Observable<Forecast> {
    return this.http.get<Forecast>(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`
    );
  }
}
