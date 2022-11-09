# Step 1: Create a remote domain application for the `Home` domain

---

## Generate a new remote domain application

Normally you can use a nrwl CLI command to generate new remote domain applications:
`nx g @nrwl/angular:remote`. However, I have added a custom schematic that will invoke the
same CLI command and configures additional settings: `nx g remote`.

Execute the following command to create a new remote domain application for the `home` domain:

```bash
nx g remote --domain home --port 4201
```

## Inspect the created files

Please take your time to inspect the structure of the new project. Here are some suggestions
to look at:

- The webpack files (`module-federation.config.js` and `webpack.config.js`)
    - The `module-federation.config.js` file contains a `name` and `exposes` property.
        - `name` tells Webpack what the name of this so-called Federated Module is. The name must be unique.
        - `exposes` tells Webpack what Angular Module should be exposed that can be consumed by another app.
          The key `./Module` reflects the name to register this module as (the `./` part is a required prefix naming convention). The value tells
          where Webpack can find the module.
    - The `webpack.config.js` file uses a very smart util function `withModuleFederation()` to
      automatically decorate the app's default Webpack configuration with additional settings to enable
      Webpack's Module Federation feature. This makes the Webpack configuration part very minimal and easy.
- The module files located at `src/app`. The `app.module.ts` acts as the main module to bootstrap
  the app. It consumes the `entry.module.ts` which provides all the domain functionality in the app.
  Basically, `entry.module.ts` should always serve as a wrapper module that exposes ***all the domain functionality***.

## Configure remote project

You need to copy some project configuration settings from the `flight-app` project in order to create the
same look-and-feel in this new remote app. You also need to proxy requests to the json-server just
like `flight-app` does.

1. Copy the assets from the `flight-app` to your new remote project:

```bash
cp -R apps/flight-app/src/assets/* apps/home/src/assets
```

2. Open `apps/home/project.json` and make sure the `styles` build option setting looks like this:

```json
"styles": [
  "apps/home/src/styles.css",
  "apps/home/src/assets/css/bootstrap.min.css",
  "apps/home/src/assets/css/paper-dashboard.css",
  "apps/home/src/assets/css/demo.css",
  "apps/home/src/assets/css/themify-icons.css"
],
```

3. Also make sure to add the proxy config to `serve.options`. The options should look
   like this:

```json
"options": {
  "port": 4201,
  "publicHost": "http://localhost:4201",
  "proxyConfig": "proxy.conf.json"
}
```

## Configure index.html

You need to bootstrap some stylesheets for custom font and icon support.

1. Open `apps/home/src/index.html`
2. Add the following code in the `<head>` section right below the `<base href="/">` element:

```html
<link
  href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/css?family=Muli:400,300"
  rel="stylesheet"
  type="text/css"
/>
```

## Configure app.module.ts

You need to bootstrap some angular modules for HTTP requests and browser animations. You also
need to configure the expected routing.

1. Go to `apps/home/src/app/app.module.ts`
2. Add the `HttpClientModule` and `BrowserAnimationsModule` to the imports
3. Configure the expected 'home' route in the RouterModule.forRoot config.

The module should look like this:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'home'
        },
        {
          path: 'home',
          loadChildren: () =>
            import('./remote-entry/entry.module').then(
              (m) => m.RemoteEntryModule
            ),
        }
      ],
      { initialNavigation: 'enabledBlocking' }
    ),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Connect relevant pages to this remote app

You need to make sure to import the home domain's entry page by default. This entry page will be the
entry point of the entire domain, just like how the home page is the entry page to the `Home` domain
in the `flight-app`.

1. Go to `apps/home/src/app/remote-entry`
2. Remove `entry.component.ts` and `nx-welcome.component.ts`
3. Open `entry.module.ts` and make sure it by default imports the domain's entry page

The module should look like this:

```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () => import('@flight-workspace/home-page-home')
          .then(m => m.HomeModule)
      },
    ]),
  ],
  providers: [],
})
export class RemoteEntryModule {}
```

## Test-run the remote application

Now that everything is configured, you can start the app (don't forget to start the json-server).

```bash
yarn run json-server
nx serve home
```

You should be able to see the Home page with the correct styling and data. If not, then carefully
go over the steps again.

You will notice that the sidebar and navbar elements are missing. This is a <u>**conscious design choice**</u> because those elements
should only be an integral part of the `flight-app` host app as a means to access other domains. The `Home` domain should not need
those elements to function correctly. This ensures that the domain is completely isolated!

Something else you may have noticed is the white background color everywhere. The `flight-app`
project's background color for the content section is a slightly darker white tone. This improves
the contrast with the other white elements. You can consider adding this darker white tone in,
for example, the `src/styles.css` file:

```css
:root body {
  background-color: #f4f3ef;
}
```

And finally, you might have noticed the following error output to the console:
`import.meta cannot be used outside of a module`. The script `styles.js` is causing this error.
It is a known error output in localhost, but it doesn't actually cause any breakages.

The good news is that the error doesn't propagate to production, because styles are compiled to
a CSS file, so there is no erroneous JS to log an error.
