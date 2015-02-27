var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelp = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function(statusCode, res, path) {
  res.writeHead(statusCode, httpHelp.headers);
  httpHelp.serveAssets(res, path, function(res, body) {
    res.end(body);
  });
};

var get = function(req, res) {
  // if (req.url === '/') {
  //   sendResponse(200, res, path.join(__dirname, './public/index.html'));
  // } else if (req.url === '/styles.css') {
  //   sendResponse(200, res, path.join(__dirname, './public/styles.css'));
  // }
  var url = req.url === '/' ? '/index.html' : req.url;
  fs.exists(path.join(archive.paths.siteAssets, url), function(found) {
    if (found) {
      sendResponse(200, res, path.join(archive.paths.siteAssets, url));
    } else {
      archive.isURLArchived(url, function(exists) {
        if (exists) {
          sendResponse(200, res, path.join(archive.paths.archivedSites, url));
        } else {
          res.writeHead(404, httpHelp.headers);
          res.end();
        }
      });
    }

  });
};

var post = function(req, res) {
  var body = '';
  req.on('data', function(chunk) {
    body += chunk;
  });
  req.on('end', function() {
    var url = body.substr(4);
    if (archive.isURLArchived(url)) {
      sendResponse(302, res, path.join(archive.paths.archivedSites, url));
    } else {
      !archive.isUrlInList(url) && archive.addUrlToList(url);
      sendResponse(302, res, path.join(__dirname, './public/loading.html'));
    }
  });

};

var actions = {
  'GET': get,
  'POST': post
};

exports.handleRequest = function (req, res) {
  // console.log('Serving', req.url, 'of type', req.method);
  actions[req.method](req, res);
};
