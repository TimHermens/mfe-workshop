import {
  AfterContentInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadRemoteModule } from '@nrwl/angular/mf';
import { RemoteWebComponentOptions } from './remote-web-component.options';

@Component({
  selector: 'remote-web-component',
  template: '<div id="{{remoteWebComponentId}}" #vc></div>',
})
export class RemoteWebComponent implements AfterContentInit {
  @ViewChild('vc', { read: ElementRef, static: true })
  vc: ElementRef | undefined;

  remoteWebComponentId: string | undefined;

  private element: HTMLElement | undefined;

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
