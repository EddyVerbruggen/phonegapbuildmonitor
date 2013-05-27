// TODO consider using 2 apps, so Android checks are not slowed down by iOS checks (and vice versa)
var token = "Rt9jJoTxCgDBQrYfuHLk";
var appid = 412598; // 'Hello World' app
var maxSamplesForClient = 20;
var buildIntervalMillis = 60000 * 15; // build an app every x minutes (after the build has finished)
var buildCheckIntervalMillis = 60000; // check the status every minute
var buildThreshold = 60000 * 30; // after 30 minutes, a build is considered 'hanging'

// an array per platform containing arrays of [starttimestamp, buildtimeseconds]
var androidBuilds = [];
var iosBuilds = [];


// ***** webserver *****
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({
    android: androidBuilds,
    ios: iosBuilds
  }));
}).listen(9100);


// ***** internal pgbuild checker *****
var lastStartTimeIOS;
var lastStartTimeAndroid;
var lastIOSBuildComplete = true;
var lastAndroidBuildComplete = true;

var client = require('phonegap-build-api');
function startPolling() {
  console.log('authenticating');
  client.auth({token: token}, function (e, api) {
    buildAndCheckStatus(api);
  });
}

function buildAndCheckStatus(api) {
  console.log('building');
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
    console.log('built');
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
      console.log('ios / android status: ' + data.status.ios + ' / ' + data.status.android);
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
        console.log('build error');
        setTimeout(function() {
          buildAndCheckStatus(api);
        }, buildIntervalMillis);
      } else if (buildComplete) {
        console.log('build complete');
        setTimeout(function() {
          buildAndCheckStatus(api);
        }, buildIntervalMillis);
      } else if (buildTakesLongerThanThreshold(now)) {
        console.log('restarting long running build');
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

// kick off!
startPolling();