import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WeatherTabComponent } from './components/weather-tab/weather-tab.component';
import { SearchComponent } from './components/search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForecastScreenComponent } from './components/forecast-screen/forecast-screen.component';
import { ForecastComponent } from './components/forecast/forecast.component';
import { ErrorScreenComponent } from './components/error-screen/error-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    WeatherTabComponent,
    SearchComponent,
    DashboardComponent,
    ForecastScreenComponent,
    ForecastComponent,
    ErrorScreenComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
