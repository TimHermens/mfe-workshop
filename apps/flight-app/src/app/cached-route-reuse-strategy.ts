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
