var token = "Rt9jJoTxCgDBQrYfuHLk";
var appid = 412598; // 'Hello World' app
var maxSamplesForClient = 20;
var buildIntervalMillis = 60000 * 20; // build an app every x minutes (after the build has finished)
var buildCheckIntervalMillis = 60000; // check the status every minute
var buildThreshold = 60000 * 30; // after 30 minutes, a build is considered 'hanging'

// an array per platform containing arrays of [starttimestamp, buildtimeseconds]
var androidBuilds = [];
var iosBuilds = [];

var fs= require('fs');
var nconf = require('nconf');

// ***** webserver *****
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  if (showAllPlatforms(req)) {
    res.end(JSON.stringify({
      android: androidBuilds,
      ios: iosBuilds
    }));
  } else {
    res.end(JSON.stringify({
      android: androidBuilds
    }));
  }
}).listen(9100);

var url = require('url');
function showAllPlatforms(req) {
  if (!isIOS(req.headers['user-agent'])) {
    return true;
  } else {
    // check the version of the client (querystring param: ?v=2)
    var url_parts = url.parse(req.url, true);
    var v = url_parts.query.v;
    // always refresh the properties
    nconf.file({file: __dirname + '/chartserver.config.json'});
    return nconf.get("showAllPlatformsOnIOS"+(v == undefined ? "" : "_v"+v));
  }
}

// ***** internal pgbuild checker *****
var lastStartTimeIOS;
var lastStartTimeAndroid;
var lastIOSBuildComplete = true;
var lastAndroidBuildComplete = true;

var client = require('phonegap-build-api');
function startPolling() {
  log('authenticating');
  client.auth({token: token}, function (e, api) {
    buildAndCheckStatus(api);
  });
}

function buildAndCheckStatus(api) {
  log('building');
  var now = new Date().getTime();
  if (lastIOSBuildComplete) {
    lastStartTimeIOS = now;
  }
  if (lastAndroidBuildComplete) {
    lastStartTimeAndroid = now;
  }
  lastIOSBuildComplete = false;
  lastAndroidBuildComplete = false;
  api.put('/apps/' + appid, {}, function (e, data) {
    log('built');
    setTimeout(function() {
      checkStatus(api);
    }, buildCheckIntervalMillis);
  });
}

function checkStatus(api) {
  api.get('/apps/' + appid, function (e, data) {
    if (data == undefined) {
      // service may be down, check later
      setTimeout(function() {
        checkStatus(api);
      }, buildCheckIntervalMillis);
    } else {
      log('ios / android status: ' + data.status.ios + ' / ' + data.status.android);
      var now = new Date().getTime();
      if (data.status.ios == 'complete' && !lastIOSBuildComplete) {
        lastIOSBuildComplete = true;
        iosBuilds.push([now, (now-lastStartTimeIOS-getRandomBuildTime())/1000/60]);
        removeObsoleteItems(iosBuilds, androidBuilds);
      }
      if (data.status.android == 'complete' && !lastAndroidBuildComplete) {
        lastAndroidBuildComplete = true;
        androidBuilds.push([now, (now-lastStartTimeAndroid-getRandomBuildTime())/1000/60]);
        removeObsoleteItems(androidBuilds, iosBuilds);
      }
      var buildComplete = data.status.ios == 'complete' && data.status.android == 'complete';
      var buildError = data.status.ios == 'error' || data.status.android == 'error';
      if (buildError) {
        // TODO in case (for example) the iOS key is locked, the chart will no longer get new data! so unlock here :)
        log('build error');
        setTimeout(function() {
          buildAndCheckStatus(api);
        }, buildIntervalMillis);
      } else if (buildComplete) {
        log('build complete');
        setTimeout(function() {
          buildAndCheckStatus(api);
        }, buildIntervalMillis);
      } else if (buildTakesLongerThanThreshold(now)) {
        log('restarting long running build');
        buildAndCheckStatus(api);
      } else {
        setTimeout(function() {
          checkStatus(api);
        }, buildCheckIntervalMillis);
      }
    }
  })
}

function removeObsoleteItems(thisArray, otherArray) {
  while (thisArray.length > maxSamplesForClient && thisArray[0][0] <= otherArray[0][0]) {
    thisArray.shift();
  }
}

function buildTakesLongerThanThreshold(now) {
  return now-lastStartTimeIOS>buildThreshold || now-lastStartTimeAndroid>buildThreshold;
}

// subtract a random amount of time, smaller than the builCheckInterval
function getRandomBuildTime() {
  return Math.floor((Math.random()*(buildCheckIntervalMillis-10000)));
}

function isIOS(what) {
  return what.match(/(iPad|iPhone|iPod)/i);
}

function log(what) {
  console.log(new Date() + " " + what);
}

// kick off!
//startPolling();