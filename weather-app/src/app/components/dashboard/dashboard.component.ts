import { Component, OnInit } from '@angular/core';
import { NiceWeather, Weather } from 'src/app/services/weather';
import { CurrentWeatherService } from 'src/app/services/weather-current.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  weather: Weather[] = [];

  constructor(private currentWeather: CurrentWeatherService) {}

  ngOnInit(): void {
    this.getWeather();
  }

  getWeather() {
    this.weather = this.currentWeather.fillThePage([
      'bratislava',
      'prague',
      'budapest',
      'vienna',
      'warsaw',
    ]);
  }

  changeAfterSearch(city: string) {
    document.getElementById('search')?.setAttribute('placeholder', '');
    this.currentWeather.getWeather(city).subscribe({
      next: (data) => {
        let niceBlock = new NiceWeather(data);
        if (this.weather.some((e) => e.city === niceBlock.city)) {
          let index: number = this.weather.findIndex(
            (e) => e.city === niceBlock.city
          );
          this.weather.splice(index, 1);
        } else {
          this.weather.pop();
        }
        this.weather.unshift(niceBlock);
      },
      error: (e) => {
        document
          .getElementById('search')
          ?.setAttribute('placeholder', 'City could not be found.');
        console.error('City Not Found!');
      },
    });
  }
}
