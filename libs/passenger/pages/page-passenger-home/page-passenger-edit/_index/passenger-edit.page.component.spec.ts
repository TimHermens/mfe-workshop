import { PassengerEditPageComponent } from './passenger-edit.page.component';

describe('PassengerEditPageComponent', () => {
  let component: PassengerEditPageComponent;

  beforeEach(() => {
    component = new PassengerEditPageComponent();
  });

  it('instantiates succesfully', () => {
    expect(component).toBeInstanceOf(PassengerEditPageComponent);
  });
});
