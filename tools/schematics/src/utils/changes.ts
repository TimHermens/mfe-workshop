import { Change, Host } from '@schematics/angular/utility/change';

/**
 * Will replace text from the source code.
 */
export class ReplaceChange implements Change {
  order: number;
  description: string;

  constructor(
    public path: string,
    private pos: number,
    private end: number,
    private newText: string
  ) {
    if (pos < 0) {
      throw new Error('Negative positions are invalid');
    }
    this.description = `Replaced position '${pos} to ${end}' with ${newText}`;
    this.order = pos;
  }

  apply(host: Host): Promise<void> {
    return host.read(this.path).then(content => {
      const prefix = content.substring(0, this.pos);
      const suffix = content.substring(this.pos + this.end);

      return host.write(this.path, `${prefix}${this.newText}${suffix}`);
    });
  }
}
