var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers');
// require more modules/folders here!

var sendResponse = function(statusCode, res, path) {
  res.writeHead(statusCode, httpHelp.headers);
  httpHelp.serveAssets(res, path, function(res, body) {
    res.end(body);
  });
};

var get = function(req, res) {
  if (req.url === '/') {
    sendResponse(200, res, path.join(__dirname, './public/index.html'));
  } else if (req.url === '/styles.css') {
    sendResponse(200, res, path.join(__dirname, './public/styles.css'));
  }
};

var post = function(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    // console.log(body.constructor === String);
    var url = body.substr(4);
    console.log(url);
    console.log(archive.isUrlInList(url));
    if (archive.isUrlInList(url)) {
      console.log('found it');
      sendResponse(200, res, path.join(archive.paths.archivedSites, url));
    } else {
      archive.addUrlToList(url);
      sendResponse(404, res, path.join(__dirname, './public/loading.html'));
    }
  });

};

var actions = {
  'GET': get,
  'POST': post
};

exports.handleRequest = function (req, res) {
  console.log('Serving', req.url, 'of type', req.method);
  actions[req.method](req, res);
};
