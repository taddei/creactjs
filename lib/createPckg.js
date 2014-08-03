var fs = require('fs');
module.exports = function (moduleName, mainViewName, authorName, gitRepo, fileName, cb) {
  var pckgContent = '' +
    '{\n' +
    '  "name": "' + moduleName + '",\n' +
    '  "version": "0.0.0",\n' +
    '  "description": "",\n' +
    '  "keywords": "' + moduleName + ' creactjs reactjs",\n' +
    '  "main": "' + mainViewName + '",\n' +
    '  "scripts": {\n' +
    '    "test": "echo \\"Error: no test specified\\" && exit 1"\n' +
    '  },\n' +
    ( !gitRepo ? "" : '' +
      '  "repository": {\n' +
      '    "type": "git",\n' +
      '    "url": "' + gitRepo + '"\n' +
      '  },\n') +
    '  "dependencies": {\n' +
    '    "react": "~0.11.0"\n' +
    '  },\n' +
    ( authorName ? '  "author": "' + authorName + '",\n' : '') +
    '  "license": "MIT"\n' +
    '}';
  fs.writeFile(fileName, pckgContent, cb);
};