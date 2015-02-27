var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.collectData = function() {

};

exports.readListOfUrls = function(callback){
  // return fs.readFileSync(exports.paths.list, {encoding: 'utf8'}).split('\n').slice(0, -1);
  var encoding = {encoding: 'utf8'};
  fs.readFile(exports.paths.list, encoding, function(err, data) {
    if (err) console.log(err);
    if (data) {
      callback(data.split('\n').slice(0, -1));
    }
  });
};

exports.isUrlInList = function(url, callback){
  // var data = fs.readFileSync(exports.paths.list, {encoding: 'utf8'});
  // return data.indexOf(url) > -1;
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site) {
      return site.match(url);
    });
    callback(found);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url+'\n', function(err, file) {
    callback(file);
  });
};

exports.isURLArchived = function(url, callback){
  // return fs.existsSync(path.join(exports.paths.archivedSites, url));
  fs.exists(path.join(exports.paths.archivedSites, url), callback);
};

exports.downloadUrls = function(sites){
  console.log("Starting downloads...");
  _.each(sites, function(site) {
    // request.get(site, path.join(exports.paths.archivedSites, site), function(err, res) {
    //   if (err) console.log(err);
    // });
    console.log('Downloading', site);
    if (!site) return;
    request('http://' + site).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + site));
  });
  console.log('Finished downloading pages.');
};
