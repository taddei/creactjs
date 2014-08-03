var fs = require('fs');
module.exports = function (moduleName, fileName, cb) {
var storeContent = '' +
  'var EventEmitter = require(\'events\').EventEmitter;\n' +
  'var util = require(\'util\');\n' +
  '\n' +
  'var ' + moduleName + 'Store = function () {\n' +
  '  EventEmitter.call(this);\n' +
  '};\n' +
  'util.inherits(' + moduleName + 'Store, EventEmitter);\n' +
  '\n' +
  'module.exports = ' + moduleName + 'Store;';

  fs.writeFile(fileName, storeContent, cb);
};