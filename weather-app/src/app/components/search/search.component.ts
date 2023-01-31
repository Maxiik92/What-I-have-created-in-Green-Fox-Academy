import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'search-bar',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchValue: string = '';

  @Output() searchCityEvent = new EventEmitter<string>();

  onClick(): void {
    this.searchValue = '';
  }

  search() {
    this.searchCityEvent.emit(this.searchValue);
  }
}
