# Step 3: Transform the `flight-app` project to a host application

---

To be able to load the remote applications into the flight-app application,
you need to transform the flight-app project into a host application.

Normally you can also use the nrwl CLI commands to generate an app as a host: `nx g host`.
But you will follow a manual approach because we already have an existing app.

## Add eager & lazy loading bootstrap support

---

The Module Federation plugin requires that all projects and their dependencies support an eager &
lazy bootstrapping method. Angular apps are eagerly bootstrapped by default. So you need to add a
lazy bootstrapping method to Angular apps to properly support the Module Federation plugin.

A lazy bootstrapping method has already been automatically implemented by the remote apps you
generated in the previous step. Lazy bootstrapping is implemented by delaying the app's `bootstrapModule`
call within an asynchronous Promise context. This is usually done by asynchronously
importing the bootstrap logic in the `main.ts` file.

1. Open `apps/flight-app/src`
2. Copy the `main.ts` file and paste it as `bootstrap.ts`

   ```bash
   cp apps/flight-app/src/main.ts apps/flight-app/src/bootstrap.ts
   ```

3. Replace the content of `main.ts` with:

   ```ts
   import('./bootstrap').catch((err) => console.error(err));
   ```
   
All done! The flight-app now supports eager & lazy loading.

## Implementing Static Module Federation for our host app

---

There are two flavours when you want to implement Module Federation in your host app: static and
dynamic Module Federation.

With a static setup, all the remote modules are statically preloaded in the host app. This method
yields better performance, but comes with a cost of a longer start-up time and loading an abundance of
resources you may never need in a session.

With a dynamic setup, the remote modules are only loaded when they are necessary. This method yields
better start-up time and less resources that need to be loaded upfront, but comes with a 
hit on performance because of the extra overhead to load a remote module during a session.

Let's start with a static setup.

### Webpack configuration

1. Create three webpack files:

    ```bash 
    touch apps/flight-app/module-federation.config.js
    touch apps/flight-app/webpack.config.js
    touch apps/flight-app/webpack-prod.config.js
    ```

2. Add the following content to `apps/flight-app/module-federation.config.js`:

    ```js
    module.exports = {
      name: 'flight-app',
      // static remotes to preload
      remotes: ['home', 'flight', 'passenger'],
    };
    ```

3. Add the following content to `apps/flight-app/webpack.config.js`:

    ```js
    const { withModuleFederation } = require('@nrwl/angular/module-federation');
    const config = require('./module-federation.config');
    module.exports = withModuleFederation(config);
    ```

4. Add the following content to `apps/flight-app/webpack.prod.config.js`:

    ```js
    const { withModuleFederation } = require('@nrwl/angular/module-federation');
    const config = require('./module-federation.config');
    module.exports = withModuleFederation({
      ...config
    });
    ```

### Project.json configuration

1. Go to `apps/flight-app/project.json` and modify the following values:
    1. Change `targets.build.executor` to @nrwl/angular:webpack-browser
    2. Add the following entry to `target.build.options`, just below `scripts`:
    ```json
    "customWebpackConfig": {
      "path": "apps/flight-app/webpack.config.js"
    }
    ```
    3. Add the following entry to `target.build.configurations.production`, just below `outputHashing`:
    ```json
    "customWebpackConfig": {
      "path": "apps/flight-app/webpack.prod.config.js"
    }
    ```
    4. Change `targets.serve.executor` to @nrwl/angular:module-federation-dev-server
    5. Change `targets.serve.options` to the following:
   ```json
    "options": {
      "port": 4200,
      "publicHost": "http://localhost:4200",
      "proxyConfig": "proxy.conf.json"
    },
    ```

### Modify routes to consume the entry pages from the remote modules

Go to `apps/flight-app/src/app/app-routing.module.ts` and modify the routes to import the
remote entry modules that now expose the entry pages:

```ts
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('home/Module').then(
        (m) => m.RemoteEntryModule
      ),
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('flight/Module').then(
        (m) => m.RemoteEntryModule
      ),
  },
  {
    path: 'passengers',
    loadChildren: () =>
      import('passenger/Module').then(
        (m) => m.RemoteEntryModule
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
```

Notice that for the import `import('home/Module')`, "home" reflects the configured remote name
and "Module" reflects the name we configured for the exposed module: `'./Module'`! So Webpack
will be able to find the exposed remote module with this simple import.  

### Add remote module typing file for static imports

You might see your IDE complain about the new imports though:

```
TS2307: Cannot find module 'home/Module' or its corresponding type declarations
```

You need to add a typing file to help Typescript and the IDE understand the new imports.

Create the following file `apps/flight-app/src/remotes.d.ts` with the following content:

```ts
declare module 'home/Module';
declare module 'flight/Module';
declare module 'passenger/Module';
```

This should resolve the error.

### Test-run the app

And that should be it!
Now that everything is configured, you can start the app (don't forget to start the json-server).

```bash
yarn run json-server
nx serve flight-app
```

Keep in mind that the initial build will take a while because 4 apps need to be built and
served now: `flight-app`, `flight`, `home` and `passenger`. By default, NX serves the
remote apps as static apps to improve performance. This means that the live-reload feature is
disabled for the remote apps. If you want to enable this feature for a remote app, you need to provide the
`--devRemotes` flag. For instance, to enable live-reload for all remotes:

```bash
nx serve flight-app --devRemotes=home,flight,passenger
```

Please open the network tab and reload the app. You should notice three consecutive calls that load
remoteEntry.mjs files. These files are the javascript bundles that are retrieved from the remotes
which contain the exposed entry modules. So indeed, all the remotes are now statically preloaded.

If everything works as expected, continue with setting up the Dynamic Module Federation approach.

## Dynamic Module Federation

---

There are 4 steps involved to move from Static to Dynamic Module Federation:

1. Set the Remote Definitions so that webpack is aware of how to find the Remote applications when requested.
2. Make a network request to fetch the locations of the Remote applications (the Remote Definitions).
3. Change how we load the Remote applications in the routing module.
4. Disable statically loading the remotes

### Set Remote Definitions

Create a manifest file in the assets folder:

```bash
touch apps/flight-app/src/assets/module-federation.manifest.json
```

Add the following content:

```json
{
  "home": "http://localhost:4201",
  "flight": "http://localhost:4202",
  "passenger": "http://localhost:4203"
}
```

### Fetch Remote Definitions before bootstrapping the app

Open `apps/flight-app/src/main.ts` and replace the content with this:

```ts
import { setRemoteDefinitions } from '@nrwl/angular/mf';

fetch('/assets/module-federation.manifest.json')
  .then((res) => res.json())
  .then((definitions) => setRemoteDefinitions(definitions))
  .then(() => import('./bootstrap').catch((err) => console.error(err)));
```

This will tell Webpack where it can find the remote modules whenever it needs to load them.

### Load Remote entry modules in the app routing module

Open `apps/flight-app/src/app/app-routing.module.ts` and refactor the routes like this:

```ts
import { loadRemoteModule } from '@nrwl/angular/mf';

const routes: Routes = [
   {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full',
   },
   {
      path: 'home',
      loadChildren: () =>
              loadRemoteModule('home', './Module').then((m) => m.RemoteEntryModule),
   },
   {
      path: 'flights',
      loadChildren: () =>
              loadRemoteModule('flight', './Module').then((m) => m.RemoteEntryModule),
   },
   {
      path: 'passengers',
      loadChildren: () =>
              loadRemoteModule('passenger', './Module').then(
                      (m) => m.RemoteEntryModule
              ),
   },
   {
      path: '**',
      redirectTo: 'home',
   },
];
```

### Disable statically loading the remotes

Open `apps/flight-app/module-federation.config.js` and remove the static remotes.

### Test-run the app

Now that everything is configured, you can start the app (don't forget to start the json-server).

```bash
yarn run json-server
nx serve flight-app
```

Please open the network tab and reload the app. Notice that the remoteEntry.mjs files now only
load when you access a remote resource such as a page. 

## Clean up unnecessary boundary domain rules

---

Before we added Module Federation support to our project, we needed to add special boundary domain
rules to allow the `flight-app` project to import the entry pages from other domains. But with
Module Federation, the entry pages are now completely isolated in their respective remote
domain modules. Therefore, the special boundary domain rules are no longer required.

Open `.eslintrc.json` and remove the entry page domain `domain:flight-app-entry-page`. Also
remove this from the `project.json` files in the entry page projects.

### Dependency graph

The dependency graph has changed quite a bit after we introduced Module Federation support. Check
it yourself:

```bash
nx graph
```

Notice that the flight-app no longer depends on any project anymore. It has truly become a
minimalistic isolated entity! This is also the reason why host apps are often called shell apps.

There are three additional projects now: flight, home and passenger. Also inspect the dependency
graph of those projects.
