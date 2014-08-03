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