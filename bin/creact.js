#!/usr/bin/env node

var actions = {
  help: require('../lib/help'),
  init: require('../lib/init')
};

// process commands
// remove node and creact command
var commands = process.argv.splice(2);

// check the action called
var action = commands.shift();

if(!actions[action]) return actions.help(commands);

actions[action](commands);

//// Nodejs deps
//var readline = require('readline');
//var path = require('path');
//var fs = require('fs');
//
//// External deps
//require('colors');
//var asciify = require('asciify');
//
//
//// Library deps
//var Config = require('../lib/wizard/Config.js');
//var ConfigWizard = require('../lib/wizard/ConfigWizard');
//
//var log = require('../lib/server/plugin/logger.js').log;
//var logError = require('../lib/server/plugin/logger.js').logError;
//
//var Launcher = require('../lib/server/classes/Launcher.js');
//var Theme = require('../lib/server/classes/Theme.js');
//
//// Open a stream with the console and keep it open
//var rl = readline.createInterface({
//  input : process.stdin,
//  output: process.stdout
//});
//
//asciify('PBook 2', {font: 'small'}, function (err, res) {
//  console.log('');
//  console.log(res.cyan.bold);
//
//  log('START', process.cwd());
//
//
//  // Start by reading this directory and looking for a
//  fs.readdir(process.cwd(), function (err, data) {
//    if (err) return logError('START', err);
//
//    // initialize a new config object
//    var config = new Config(process.cwd());
//
//    // Check the local directory to see if a config file already exists
//    for (var i = 0, l = data.length; i < l; ++i) {
//      if (data[i] === Config.defaults.pbookFolder) {
//        if(!config.loadConfig(path.join(process.cwd(), Config.defaults.pbookFolder, Config.defaults.configJson))){
//          // Found the folder, but could not load the config file
//          return launchWizard(config);
//        }
//        // now exit, we found a valid config file
//        log('Init', 'Configuration file loaded');
//        return startLauncher(config);
//      }
//    }
//
//    // No .pbook folder found, launch the wizard
//    launchWizard(config);
//  });
//});
//
//function launchWizard (config) {
//  // If we are here then no configuration file found, start the tutorial
//  var tutorial = new ConfigWizard(rl, config);
//  tutorial.start(function (err, newconfig) {
//    if (err) return logError('Setup', err);
//    log('Init', 'New configuration file created');
//    startLauncher(newconfig);
//  });
//}
//
//function startLauncher(config) {
//  rl.close();
//
//  config.saveConfig(function(err) {
//    if(err) return logError('Init', err);
//
//    // FIXME find a better place to do this (i dont like it)
//    var themes = {};
//
//    Object.keys(config.themes).forEach(function (themeId) {
//      var themeInfo = config.themes[themeId];
//      themeInfo.id = themeId;
//      themes[themeId] = new Theme(themeInfo);
//    });
//
//    config.themes = themes;
//
//    var launcher = new Launcher(config);
//    launcher.start();
//
//  });
//
//
//
//
////  // instantiate a new patternbook project object
////  var pBook = new Patternbook();
////
////  // configure the base project information
////  pBook.title = config.title;
////  pBook.modulesPath = config.modulesPath;
////  pBook.server = config.server;
////  pBook.paths = config.paths;
////  pBook.breakpoints = config.breakpoints;
////
////  // add one or more themes
////  Object.keys(config.themes).forEach(function (themeId) {
////    var themeInfo = config.themes[themeId];
////    themeInfo.id = themeId;
////    pBook.addTheme(new Theme(themeInfo));
////  });
////
////  // start the pBook
////  pBook.start();
//}