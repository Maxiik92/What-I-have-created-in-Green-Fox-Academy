import { Component, Input } from '@angular/core';
import { Forecast } from 'src/app/services/forecast';

@Component({
  selector: 'app-forecast-screen',
  templateUrl: './forecast-screen.component.html',
  styleUrls: ['./forecast-screen.component.css'],
})
export class ForecastScreenComponent {
  @Input() forecastData?: Forecast;
}
