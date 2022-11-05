import { PassengerHomePageComponent } from './passenger-home.page.component';

describe('PassengerHomePageComponent', () => {
  let component: PassengerHomePageComponent;

  beforeEach(() => {
    component = new PassengerHomePageComponent();
  });

  it('instantiates succesfully', () => {
    expect(component).toBeInstanceOf(PassengerHomePageComponent);
  });
});
