import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastScreenComponent } from './forecast-screen.component';

describe('ForecastScreenComponent', () => {
  let component: ForecastScreenComponent;
  let fixture: ComponentFixture<ForecastScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForecastScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
