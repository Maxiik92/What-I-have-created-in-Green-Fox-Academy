import { Component, Input } from '@angular/core';
import { Weather } from 'src/app/services/weather';

@Component({
  selector: 'weather-tab',
  templateUrl: './weather-tab.component.html',
  styleUrls: ['./weather-tab.component.css'],
})
export class WeatherTabComponent {
  @Input() weatherList?: Weather[];
}
