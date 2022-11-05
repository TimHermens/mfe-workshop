'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ReplaceChange = void 0;
class ReplaceChange {
  constructor(path, pos, end, newText) {
    this.path = path;
    this.pos = pos;
    this.end = end;
    this.newText = newText;
    if (pos < 0) {
      throw new Error('Negative positions are invalid');
    }
    this.description = `Replaced position '${pos} to ${end}' with ${newText}`;
    this.order = pos;
  }
  apply(host) {
    return host.read(this.path).then((content) => {
      const prefix = content.substring(0, this.pos);
      const suffix = content.substring(this.pos + this.end);
      return host.write(this.path, `${prefix}${this.newText}${suffix}`);
    });
  }
}
exports.ReplaceChange = ReplaceChange;
//# sourceMappingURL=changes.js.map
