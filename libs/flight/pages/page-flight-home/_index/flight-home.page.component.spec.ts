import { FlightHomePageComponent } from './flight-home.page.component';

describe('FlightHomePageComponent', () => {
  let component: FlightHomePageComponent;

  beforeEach(() => {
    component = new FlightHomePageComponent();
  });

  it('instantiates succesfully', () => {
    expect(component).toBeInstanceOf(FlightHomePageComponent);
  });
});
