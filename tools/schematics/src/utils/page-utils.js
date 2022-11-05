'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.pageNameFromPath = void 0;
const pageNameFromPath = (path) => {
  const removeLastIfExist = (remove) => (value) =>
    value.replace(new RegExp(`${remove}\$`), '');
  const extractLastPath = (path) => path.split('/').pop();
  return [
    removeLastIfExist('/'),
    removeLastIfExist('/_index'),
    extractLastPath,
  ].reduce((acc, cur) => (acc = cur(acc)), path);
};
exports.pageNameFromPath = pageNameFromPath;
//# sourceMappingURL=page-utils.js.map
