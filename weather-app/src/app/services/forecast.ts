import { GetPic } from './getPic';

export interface Forecast {
  city: string;
  days: Day[];
  time: string;
}

export interface Day {
  day: string;
  temperature: string;
  imgSrc: string;
  description: string;
}

export class CForecast extends GetPic implements Forecast {
  city: string;
  days: Day[] = [];
  time: string;

  constructor(data: any) {
    super();
    this.city = data.city.name;
    this.time = '';
    for (let i = 0; i < data.list.length; i += 8) {
      let day: Day = { day: '', temperature: '', imgSrc: '', description: '' };
      day.day = new Date(data.list[i].dt * 1000).toString().slice(0, 16);
      day.temperature = `${parseInt(data.list[i].main.temp)
        .toFixed(0)
        .toString()} °C`;
      day.imgSrc = this.getPic(data.list[i].weather[0]);
      day.description = data.list[i].weather[0].description;
      this.days.push(day);
    }
  }
}
