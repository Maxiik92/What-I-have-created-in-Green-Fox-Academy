import { TestBed } from '@angular/core/testing';

import { CurrentWeatherService } from './weather-current.service';

describe('WeatherForecastService', () => {
  let service: CurrentWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
