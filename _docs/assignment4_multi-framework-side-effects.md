# Assignment 4: Multi-framework side effects & wrapping up

As mentioned before, not everything just works as expected when you combine multiple frameworks.
One major side effect of the current airport home page is that the data is lost when you navigate
away from the airport domain.

The reason why this data is lost is not the reason you may expect. It is not due to how the data is
persisted in the React app (or a lack thereof), but due to how Angular handles the lifecycle of components.

Once you navigate away from the airport domain, the `RemoteWebComponent` that contains the mounted React app
gets automatically destroyed by Angular's routing strategy. This is the default behavior and is
usually not problematic. But in this case it is, because you will lose <u>every context</u> that
was set up by the React app.

So one thing we can do is prevent Angular from destroying the `RemoteWebComponent` so that the React
context remains intact.

## Caching the airports route

I have created a new routing strategy that can cache any route:
`apps/flight-app/src/app/cached-route-reuse-strategy.ts`.
I have added the /airports route as the route to cache:

```ts
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';

export class CachedRouteReuseStrategy implements RouteReuseStrategy {
  private readonly storedRouteHandles = new Map<string, DetachedRouteHandle>();
  private readonly routesToCache = new Set<string>(['airports']);

  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const fullPath = this.getFullPath(route);
    if (this.routesToCache.has(fullPath)) {
      return this.storedRouteHandles.get(fullPath) as DetachedRouteHandle;
    }
    return null;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // ignore child components
    if (!route.component) {
      return false;
    }

    const fullPath = this.getFullPath(route);
    if (this.routesToCache.has(fullPath)) {
      return this.storedRouteHandles.has(fullPath);
    }

    return false;
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return this.routesToCache.has(this.getFullPath(route));
  }

  store(
    route: ActivatedRouteSnapshot,
    detachedTree: DetachedRouteHandle
  ): void {
    const fullPath = this.getFullPath(route);
    if (this.routesToCache.has(fullPath)) {
      this.storedRouteHandles.set(fullPath, detachedTree);
    }
  }

  private getFullPath(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map((snapshot) =>
        snapshot.url
          .map((segment) => segment.toString())
          .filter((segment) => segment)
          .join('/')
      )
      .filter((segment) => segment)
      .join('/');
  }
}
```

I won't go over the details what exactly happens here; you could probably figure it out as well.
You can enable this routing strategy in the `app-routing.module.ts`:

```ts
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [{
      provide: RouteReuseStrategy,
      useClass: CachedRouteReuseStrategy
    }]
})
export class PageRoutingModule {}
```

### Test-run the app

Let's try running the app again. You should now see that the airports route is indeed cached.
So everything works a lot better now.

Buuuuut... there are still two issues:

1. When you navigate to /airports/1, then navigate to any other domain, and navigate back to 
   airports, you'll see that the Edit page is loaded instead of the Main page. This happens
   because the Angular router is detached from the React router. This is yet another unfortunate
   side effect of combining frameworks. You could implement something to deal with this as well, but
   I'll leave it up to you how far you want to go with this.
2. There is a slight difference now in behaviour of the search form between the domains. Because
   the airports page is cached now, so is the form data. The other domains forget about this form
   data when you leave the page. An easy fix is to also support caching for the other
   main domain routes. But is this easy fix the right approach?

So as you have seen, there are a number of challenges you need to overcome when combining frameworks
with Module Federation. There may be many more challenges that we have not touched upon yet.
I cannot stress this enough: really ask yourself if you absolutely need multiple frameworks in one
app. My advice is to only do this if you want to migrate an app to a new framework. You would
only need to temporarily support multiple frameworks until the migration finishes.

## Just one final thing

One nice final nice thing to change is how the manifest.json file is set up. It is not a good thing
that the domain urls need to be specified in a publicly available JSON file. In a production
environment, you would ideally want to implement a reverse proxy middleware that forwards the
requests to the remote urls. The remote url definitions would be part of that middleware. So it is a
good idea to set up something similar in localhost.

If you open `apps/flight/webpack.config.js`, you will notice the config has slightly changed and one
line has been commented out. You can uncomment this line to set up a relative path that tells Webpack
where to find the app's resources such as the remoteEntry file. Also do this for the other apps.

Then open the `proxy.conf.json` file in the root folder. I have already configured the proxy rules
for you there.

And finally, open `apps/flight-app/src/assets/module-federation.manifest.json` and change the
domain urls to the relative paths.

That's it! If you run the app again then everything should still work.
