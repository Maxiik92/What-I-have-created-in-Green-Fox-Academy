import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NiceWeather, Weather } from './weather';

@Injectable({
  providedIn: 'root',
})
export class CurrentWeatherService {
  weatherdata: Weather[] = [];
  apiKey: string = environment.apiKey;

  constructor(private http: HttpClient) {}

  fillThePage(cityList: string[]): Weather[] {
    if (this.weatherdata.length === 0) {
      forkJoin([
        this.getWeather(cityList[0]),
        this.getWeather(cityList[1]),
        this.getWeather(cityList[2]),
        this.getWeather(cityList[3]),
        this.getWeather(cityList[4]),
      ]).subscribe({
        next: (value) => {
          value.forEach((block) => {
            const niceWeather = new NiceWeather(block);
            this.weatherdata.push(niceWeather);
          });
        },
        error: (e) => {
          console.error(e);
        },
      });
      return this.weatherdata;
    }
    return this.weatherdata;
  }

  getWeather(city: string): Observable<Weather> {
    return this.http.get<Weather>(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`
    );
  }
}
