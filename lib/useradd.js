var fs = require('fs');
var prompt = require('prompt');
var http = require('http');
var querystring = require('querystring');

var emailTest = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = function (commands) {
  // Check if its a valid email address
//  var email = commands[0];
//  if(!emailTest.test(email)) return console.log(email, 'is not a valid email address');

  // Open a tap with the console and ask for a hidden password
  var schema = {
    properties: {
      email: {
        pattern: emailTest,
        message: 'Enter a valid email address',
        required: true
      },
      password: {
        hidden: true,
        required: true
      }
    }
  };

  prompt.start();

  //
  // Get two properties from the user: email, password
  //
  prompt.get(schema, function (err, result) {
    if(err) return console.log(err);

    console.log('Testing connection ...');
    // prepare the request payload
    var requestContent = JSON.stringify(result);

    var headers = {
      'Content-Type': 'application/json',
      'Content-Length': requestContent.length
    };

    var options = {
      host: 'api.creactjs.net',
      port: 80,
      path: '/user',
      method: 'POST',
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
        parseResponse(res.statusCode, Buffer.concat(data).toString())
      });

    });
    req.on('error', function (err) {
      console.log('Error contacting creactjs server');
    });

    req.write(requestContent);
    req.end();

  });
};


function parseResponse (statusCode, jsonResp) {
  try {
    var resp = JSON.parse(jsonResp);
  } catch (e) {
    console.log('error parsing server response');
  }

  if(statusCode === 200) {

  } else {
    console.log('Server error:', resp.error)
  }
}