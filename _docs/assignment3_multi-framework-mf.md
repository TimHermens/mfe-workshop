# Assignment 3: Multi-framework Module Federation Example

This assignment serves as an example of how you can set up multi-framework support with Module Federation.
A new `airport` domain has been added to the project and loaded into the `flight-app` application. Every
functionality within this new domain has been created with the <u>**React**</u> framework.

## Step 1: Checkout and yarn

---

Checkout the branch `assignment3` and create a new branch you can freely work on. A bunch of new
packages have been added to support React. Please install them in the meantime:

```bash
yarn
```

## Step 2: Investigate new airport app

---

You will see a new app located at `apps/airport`. I have not implemented a Domain-Driven Design for this app. You
can find every functionality within the `src/app` folder. I did try to recreate the DDD structure
within this folder.

I have already configured most of the things that are necessary within this app: notably the
webpack config and the project.json config. The webpack config is a bit different from the webpack
config of the other applications:

```js
const { withModuleFederation } = require('@nrwl/react/module-federation');
const config = require('./module-federation.config');
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = async (baseConfig) => {
    const fromModuleFederation = await withModuleFederation(config);
    baseConfig = fromModuleFederation(baseConfig);
    // this is important for later
    // baseConfig.output.publicPath = '/mfe/airport/';

    for (let plugin of baseConfig.plugins) {
        if (plugin instanceof ModuleFederationPlugin) {
            // Since the host runs on Angular 14, we need to provide the remoteEntry file as a modular javascript type
            plugin._options.filename = 'remoteEntry.mjs';
            break;
        }
    }

    return baseConfig;
};
```

Whenever you set up a NX remote project with React, the Module Federation plugin will automatically
generate the remoteEntry file as Javascript (js). But the NX host application runs on Angular 14 which
expects the remoteEntry file to be Modular Javascript (mjs). The host application would not
be able to support this remote app without changing this.

## Step 3: Exposing the airport app as a Web Component

---

The `webpack.config.js` exposes a remote entry web component file:

```js
const moduleFederationConfig = {
    name: 'airport',
    exposes: {
        './Module': './src/remote-entry-web-component.ts',
    }
};
```

The Angular host app won't be able to support any of the airport features if we would just expose them as
React features. What Angular can support however are web components. So one way we can support the
airport app in our Angular host app is by exposing the entire airport app as a web component. I
like to call this special type of web component a "Remote Entry Web Component".

Let's inspect the exposed `remote-entry-web-component.ts` file:

```ts
import { MfeElement } from './app/app';

customElements.define('airport-module', MfeElement);
```

There is not much here. All this file does is create a web component element that is named
'airport-module'. Let's inspect the `MfeElement` (Mfe stands for Micro Frontend) now:

```tsx
export class MfeElement extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.getElementById('airport-module');
    if (!mountPoint) {
      throw new Error('airport-module mount element not found!');
    }
    const root = ReactDOM.createRoot(mountPoint);
    root.render(
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>
    );
  }
}
```

As mentioned before, the entire app is wrapped in this web component. The `mountPoint` is the
critical part. The web component tries to find an HTML element with the id 'airport-module' in
the DOM. Then it will mount the entire React app as a web component on that HTML element. So in
order to mount the airport app in our host app, we need the host app to have this HTML element
located somewhere in the app.

## Step 4: Mounting the airport app as a web component in the host app

---

I have already implemented something that takes care of mounting a web component in the host app.
You can find the implementation here: `apps/flight-app/src/app/remote-web-component/remote-web-component.ts`:

```ts
@Component({
  selector: 'remote-web-component',
  template: '<div id="{{remoteWebComponentId}}" #vc></div>',
})
export class RemoteWebComponent implements AfterContentInit {
  @ViewChild('vc', { read: ElementRef, static: true })
  vc: ElementRef | undefined;

  remoteWebComponentId: string | undefined;

  private element: HTMLElement | undefined

  constructor(private route: ActivatedRoute) {}

  async ngAfterContentInit() {
    const options = this.route.snapshot.data as RemoteWebComponentOptions;
    this.remoteWebComponentId = options.elementName;

    try {
      await loadRemoteModule(options.remoteName, options.remoteModule);

      this.element = document.createElement(options.elementName);
      this.vc?.nativeElement.appendChild(this.element);
    } catch (error) {
      console.error(error);
    }
  }
}
```

What basically happens is the following:

1. Whenever this component is rendered, it will place a div in the DOM as you can see in the
   `template`: 
   ```html
   <div id="{{remoteWebComponentId}}"></div>
   ```
   So if we configure the `remoteWebComponentId` property to 'airport-module', the airport custom web
   component should be able to mount the React App on this div element.
2. The `ngAfterContentInit` lifecycle hook is called after the component has fully rendered.
   So once the component has rendered:
   1. The `loadRemoteModule` function is called which fetches and loads the airport remoteEntry.mjs file.
      This means that the custom airport-module web component becomes available to use.
   2. The `document.createElement(options.elementName)` function is called to create a new
      instance of the now-available web component.
   3. The `this.vc?.nativeElement.appendChild(this.element);` function is called to render the
      web component as a child of the div element.

Another important thing is this part:

```ts
const options = this.route.snapshot.data as RemoteWebComponentOptions;
```

This line will gather all the necessary information from the configured route. Speaking of 
routes, let's have a look at the `app-routing.module.ts` how everything is tied together.

```ts
import {
    startsWith,
} from "@angular-architects/module-federation-tools";
import {
    RemoteWebComponent
} from "./remote-web-component/remote-web.component";
import { RemoteWebComponentOptions } from "./remote-web-component/remote-web-component.options";

const routes: Routes = [ 
  {
    matcher: startsWith('airports'),
    component: RemoteWebComponent,
    data: {
      remoteName: 'airport',
      remoteModule: './Module',
      elementName: 'airport-module'
    } as RemoteWebComponentOptions
  }
];
```

I have used the `matcher` instead of `path` property for the route. The configured matcher just
checks if the route starts with "airports" so that any nested route will also match. Once the
web component is loaded, new nested routes become available in the <u>React Router context</u>,
and <u>**not**</u> in the Angular Router context. If I had configured the route with the `path` property,
then requesting a nested route like /airports/1 would result in a 404 error.

## Test-run the flight-app

---

Let's see everything in action!

```bash
nx serve flight-app
```

Great, everything should work as expected. We have truly encapsulated a React app within an Angular
app!

Buuuut... does everything really work as expected? Can you find any difference(s) in the behavior of
the airport pages and the other domain pages?
