"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSelector = void 0;
const devkit_1 = require("@nrwl/devkit");
const formatters_1 = require("./formatters");
function buildSelector(name, prefix) {
    validateForUseInSelector(prefix, 'prefix');
    validateForUseInSelector(name, 'name');
    const nxNames = (0, devkit_1.names)(name);
    const selector = nxNames.fileName;
    return `${prefix}-${selector}`;
}
exports.buildSelector = buildSelector;
function validateForUseInSelector(string, subject) {
    if (!(0, formatters_1.validateHtmlSelectorFormat)(string)) {
        throw new Error(`Because the ${subject} is used in the html selector, the ${subject} must start with a letter, and must contain only alphanumeric characters or dashes. When adding a dash the segment after the dash must also start with a letter.`);
    }
}
//# sourceMappingURL=angular.js.map