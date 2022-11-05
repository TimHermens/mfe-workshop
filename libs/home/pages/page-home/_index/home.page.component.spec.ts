import { HomePageComponent } from './home.page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;

  beforeEach(() => {
    component = new HomePageComponent();
  });

  it('instantiates succesfully', () => {
    expect(component).toBeInstanceOf(HomePageComponent);
  });
});
