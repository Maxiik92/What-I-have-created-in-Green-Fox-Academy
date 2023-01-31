export abstract class GetPic {
  getPic(status: any): string {
    const main = status.main;
    const desc = status.description;
    let source: string = '';
    switch (main) {
      case 'Clear':
        source = '../assets/sunny.png';
        break;
      case 'Clouds': {
        switch (desc) {
          case 'broken clouds':
          case 'overcast clouds':
            source = '../assets/cloudy.png';
            break;
          case 'few clouds':
          case 'scattered clouds':
            source = '../assets/partly_cloudy.png';
            break;
        }
        return source;
      }
      case 'Rain':
      case 'Drizzle':
      case 'Thunderstorm':
        source = '../assets/rainy.png';
        break;
      case 'Snow':
        source = '../assets/snowy.png';
        break;
      case 'Mist':
      case 'Fog':
        source = '../assets/fog.png';
    }
    return source;
  }
}
