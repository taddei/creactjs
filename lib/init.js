var logError = require('./logError');
var path = require('path');
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');

var create = {
  pckg: require('./createPckg'),
  store: require('./createStore'),
  view: require('./createView')
};

module.exports = function (commands) {

  var defaultOptions = {
    createView: true,
    createForceView: false,
    createStore: false,
    createPckg: true,
    gitRepo: null,
    moduleName: null,
    folderPath: null,
    storeFileName: null,
    viewFileName: null,
    mainFile: null
  };

  var validCommands = ['-s','-store','-v','-view','-git'];

  function nextCommand () {
    // done iterating commands, execute the request
    if(commands.length === 0) return exec();
    // check the action to perform
    var action = commands.shift();
    switch(action) {
      case '-s':
      case '-store':
        defaultOptions.createStore = true;
        break;
      case '-v':
      case '-view':
        defaultOptions.createForceView = true;
        break;
      case '-git':
        // need extra info for the git repo
        var repo = commands.shift();
        if(!repo || validCommands.indexOf(repo) !== -1) return logError(new Error('the -git commands requires a repo url after it'));
        defaultOptions.gitRepo = repo;
        break;
      default:
        if(action.indexOf('-') === 0 || defaultOptions.moduleName) return logError(new Error('unknown command ' + action));
        defaultOptions.moduleName = action;
    }
    nextCommand();
  }

  nextCommand();

  function exec () {
    if(!defaultOptions.moduleName) return logError(new Error('module name is required'));

    defaultOptions.folderPath = path.join(process.cwd(), defaultOptions.moduleName);

    fs.exists(defaultOptions.folderPath, function (exists) {
      if(exists) return logError(new Error('a folder called ' + defaultOptions.moduleName + ' already exists'));

      if(defaultOptions.createStore){
        if(defaultOptions.createForceView){
          defaultOptions.storeFileName = 'store.js';
          defaultOptions.viewFileName = 'view.jsx';
        } else {
          defaultOptions.storeFileName = 'index.js';
        }
      } else {
        defaultOptions.viewFileName = 'index.jsx';
      }
      // pckg json main entrypoint
      defaultOptions.mainFile = defaultOptions.viewFileName ? defaultOptions.viewFileName : defaultOptions.storeFileName;

      // first create the folder
      mkdirp(defaultOptions.folderPath, function (err) {
        if (err) return logError(err);
        createPckgJson();
      });

    });

  }

  function createPckgJson () {
    create.pckg(defaultOptions.moduleName, defaultOptions.mainFile, null, defaultOptions.gitRepo, path.join(defaultOptions.folderPath, 'creact.json'), function (err) {
      if(err) return logError(err);
      createViewIfExists();
    });
  }

  function createViewIfExists () {
    if(defaultOptions.viewFileName) {
      create.view(defaultOptions.moduleName, !!defaultOptions.storeFileName, path.join(defaultOptions.folderPath, defaultOptions.viewFileName), function (err) {
        if(err) return logError(err);
        createStoreIfExists();
      });
    } else {
      createStoreIfExists();
    }
  }
  function createStoreIfExists () {
    if(defaultOptions.storeFileName) {
      create.store(defaultOptions.moduleName, path.join(defaultOptions.folderPath, defaultOptions.storeFileName), function (err) {
        if(err) return logError(err);
        doneCreating();
      });
    } else {
      doneCreating();
    }
  }

  function doneCreating() {
    console.log('CREATED MODULE')
  }

};