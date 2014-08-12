var AdmZip = require('adm-zip');
var path = require('path');
var http = require('http');
var useradd = require('./useradd.js');
var FormData = require('form-data');

module.exports = function (commands) {

  var accountDetails = useradd.getAccountDetails();

  if(!accountDetails) {
    console.log("before publishing your modules, you must register an account");
    useradd(prepareModule);
  } else {
    prepareModule();
  }

  function prepareModule () {
    // Read the manifest
    try{
      var manifest = require(path.join(process.cwd(), 'creact.json'));
    } catch (err) {
      return console.log('To publish your module you need to create a creact.json file.');
    }

    // check the necessary info of the module
    if(!manifest.name || !manifest.version) {
      console.log("The creact.json file must have:");
      console.log("- name");
      console.log("- version");
    }

    var form = new FormData();
    form.append('email', accountDetails.email);
    form.append('auth', accountDetails._auth);
    form.append('name', manifest.name);
    form.append('version', manifest.version);
    form.append('type', manifest.type || "view");
    form.append('manifest', JSON.stringify(manifest));


    zipContent();

    function zipContent () {
      var contentZip = new AdmZip();
      contentZip.addLocalFolder(process.cwd());
      contentZip.toBuffer(
        function(contentBuffer){
          form.append('content', contentBuffer, {
            filename: 'content.zip',
            contentType: 'application/zip',
            knownLength: contentBuffer.length
          });
          sendRequest();
        },
        function(err){ console.log(err); }
      );
    }

    function sendRequest () {
      var options = {
        host   : 'api.creactjs.net',
        port   : 80,
        path   : '/component',
        method : 'PUT',
        headers: form.getHeaders()
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

      form.pipe(req);


      function parseResponse(statusCode, jsonResp) {
        try {
          var resp = JSON.parse(jsonResp);
        } catch (e) {
          return console.log('error parsing server response');
        }

        if (statusCode === 200) {
          console.log('Module published')
        } else {
          console.log("");
          console.log('Server error:', resp.error);
          console.log("");
        }
      }
    }
  }
};