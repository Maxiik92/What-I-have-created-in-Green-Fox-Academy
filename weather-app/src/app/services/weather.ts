import { GetPic } from './getPic';

export interface Weather {
  city: string;
  state: string;
  temperature: string;
  imgSrc: string;
  description: string;
}

export class NiceWeather extends GetPic implements Weather {
  city: string;
  state: string;
  temperature: string;
  imgSrc: string;
  description: string;

  constructor(data: any) {
    super();
    this.city = data.name;
    this.state = data.sys.country;
    this.temperature = `${parseInt(data.main.temp).toFixed(0).toString()} °C`;
    this.imgSrc = this.getPic(data.weather[0]);
    this.description = data.weather[0].description;
  }
}
