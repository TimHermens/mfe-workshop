import { FlightEditPageComponent } from './flight-edit.page.component';

describe('FlightEditPageComponent', () => {
  let component: FlightEditPageComponent;

  beforeEach(() => {
    component = new FlightEditPageComponent();
  });

  it('instantiates succesfully', () => {
    expect(component).toBeInstanceOf(FlightEditPageComponent);
  });
});
