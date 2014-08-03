var fs = require('fs');

module.exports = function (moduleName, hasStore, fileName, cb) {
var viewContent = '\n' +
  '/**\n' +
  '* @jsx React.DOM\n' +
  '*/\n' +
  '\n' +
  'var React = require(\'react\');\n' +
  '\n' +
  'var ' + moduleName + ' = React.createClass({\n' +
  ( hasStore ? '  ' + moduleName + 'Store: require(\'./store.js\'),\n' : '')+
  '  render: function () {\n' +
  '    return <div className="' + moduleName + '"></div>\n' +
  '  }\n' +
  '});\n' +
  '\n' +
  'module.exports = ' + moduleName + ';';

  fs.writeFile(fileName, viewContent, cb);
};