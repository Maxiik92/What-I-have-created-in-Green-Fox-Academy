import { Component, OnInit } from '@angular/core';
import { ForecastService } from 'src/app/services/forecast.service';
import { ActivatedRoute } from '@angular/router';
import { CForecast } from 'src/app/services/forecast';
@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css'],
})
export class ForecastComponent implements OnInit {
  forecastData?: CForecast;
  city!: string;

  constructor(
    private forecastSrvc: ForecastService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.city = params['city'];
    });
    this.getForecast(this.city);
  }

  getForecast(city: string) {
    this.forecastSrvc.getForecast(city).subscribe({
      next: (data) => {
        this.forecastData = new CForecast(data);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }
}
