'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateHtmlSelectorFormat = void 0;
const unicodeRanges = [
  [0xc0, 0xd6],
  [0xd8, 0xf6],
  [0xf8, 0x37d],
  [0x37f, 0x1fff],
  [0x200c, 0x200d],
  [0x203f, 0x2040],
  [0x2070, 0x218f],
  [0x2c00, 0x2fef],
  [0x3001, 0xd7ff],
  [0xf900, 0xfdcf],
  [0xfdf0, 0xfffd],
  [0x10000, 0xeffff],
];
function isValidElementName(name) {
  let regex = '^[a-zA-Z][';
  regex += '-.0-9_a-zA-Z\\u{B7}';
  for (const range of unicodeRanges) {
    regex += `\\u{${range[0].toString(16)}}-\\u{${range[1].toString(16)}}`;
  }
  regex += ']*$';
  return new RegExp(regex, 'u').test(name);
}
function validateHtmlSelectorFormat(name) {
  return typeof name === 'string' && isValidElementName(name);
}
exports.validateHtmlSelectorFormat = validateHtmlSelectorFormat;
//# sourceMappingURL=formatters.js.map
