import { <%= className %>PageComponent } from './<%= name %>.page.component';

describe('<%= className %>PageComponent', () => {
  let component: <%= className %>PageComponent;

  beforeEach(() => {
    component = new <%= className %>PageComponent();
  });

  it('instantiates succesfully', () => {
    expect(component).toBeInstanceOf(<%= className %>PageComponent);
  });
});
