"use strict";

function AppController() {

  this.loadApps = function(phonegappLogin, callback, errorCallback) {
    PhonegapBuildApiProxy.doGET('apps', phonegappLogin, callback, errorCallback);
  };

  this.buildFromRepo = function(phonegappLogin, appid, callback) {
    var data = 'data=' + encodeURIComponent('{"pull":"true"}');
    PhonegapBuildApiProxy.doPUT('apps/'+appid, data, phonegappLogin, callback);
  };

  this.getBuildStatus = function(app, platform) {
    return eval('app.status.'+platform);
  };

  this.getBuildError = function(app) {
    return eval('app.error.'+getPlatformName());
  };

  this.getDownloadLink = function(app, phonegappLogin, platform) {
    if (platform == 'ios') {
      return 'https://build.phonegap.com/apps/'+app.id+'/download/'+platform+'?auth_token='+phonegappLogin.token;
    } else if (platform == 'android') {
      return 'https://build.phonegap.com/'+PhonegapBuildApiProxy.getApiVersion()+'apps/'+app.id+'/'+platform +'?auth_token='+phonegappLogin.token;
    } else {
      console.log("Please notify the admin, as we've encountered an not supported platform.");
      return null;
    }
  };

  this.getShareLink = function(app, platform) {
    return 'https://build.phonegap.com/apps/'+app.id+'/download/'+platform;
  };
}