var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var http = require('http');

var emailTest = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


function getAccountDetails () {
  try {
    var oldCredentials = fs.readFileSync(path.join(__dirname, '../.cache/.credentials'));
    return JSON.parse(oldCredentials.toString());
  } catch (err) {
    return false;
  }
}

module.exports = function (cb) {
  prompt.start();
  prompt.message = "CreactJs".cyan;

  // before starting, check the existence of previous accounts
  checkPreviousUsers();

  function checkPreviousUsers() {
    var oldCreds = getAccountDetails();

    if(!oldCreds) {
      promptValues();
    } else {
      console.log("It appears that a user is already registered with the following email:");
      console.log(oldCreds.email);
      prompt.get({
        name       : "override",
        description: "override credentials? [Y/N]".white,
        pattern    : /^[Y|N|y|n]$/,
        message    : 'please type only Y or N',
        required   : true
      }, function (err, decision) {
        if (err) return console.log(err);
        if (decision.override === 'y' || decision.override === 'Y') {
          promptValues();
        }
      });
    }
  }

  function promptValues() {
    // Open a tap with the console and ask for email and a hidden password
    var schema = {
      properties: {
        email   : {
          description: "Email".white,
          pattern    : emailTest,
          message    : 'Enter a valid email address',
          required   : true
        },
        password: {
          description: "Password".white,
          hidden     : true,
          required   : true
        }
      }
    };

    prompt.get(schema, function (err, result) {
      if (err) return console.log(err);
      console.log('Validating params ...');
      validateParams(result);
    });
  }

  function validateParams(params) {
    var requestContent = JSON.stringify(params);
    var headers = {
      'Content-Type'  : 'application/json',
      'Content-Length': requestContent.length
    };
    var options = {
      host   : 'api.creactjs.net',
      port   : 80,
      path   : '/user',
      method : 'POST',
      headers: headers
    };

    // request the server with email/password
    var req = http.request(options, function (res) {
      var data = [];
      res.on('error', function (e) {
        console.log('error getting server response', e)
      });
      res.on('data', function (chunk) {
        data.push(chunk);
      });
      res.on('end', function () {
        parseResponse(params, res.statusCode, Buffer.concat(data).toString())
      });
    });
    req.on('error', function (err) {
      console.log('Error contacting creactjs server');
    });
    req.write(requestContent);
    req.end();
  }

  function parseResponse(params, statusCode, jsonResp) {
    try {
      var resp = JSON.parse(jsonResp);
    } catch (e) {
      return console.log('error parsing server response');
    }

    if (statusCode === 200) {
      var credentials = {
        _auth: new Buffer(resp.username + ":" + params.password).toString('base64'),
        email: params.email
      };
      fs.writeFileSync(path.join(__dirname, '../.cache/.credentials'), JSON.stringify(credentials, null, 2));

      if (typeof cb === 'function') {
        cb(null);
      } else {
        console.log("");
        console.log('User Added with success');
        console.log("");
      }
    } else {
      console.log("");
      console.log('Server error:', resp.error)
      console.log("");
    }
  }
};

module.exports.getAccountDetails = getAccountDetails;