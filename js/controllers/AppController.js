"use strict";

function AppController() {

  this.loadApps = function(phonegappLogin, callback) {
    PhonegapBuildApiProxy.doGET('apps', phonegappLogin, callback);
  };

  this.buildFromRepo = function(phonegappLogin, appid, callback) {
    var data = {
      'pull': 'true'
    };
    PhonegapBuildApiProxy.doPUT('apps/'+appid, data, phonegappLogin, callback);
  };

  this.getBuildStatus = function(app, platform) {
    return eval('app.status.'+platform);
  };

  this.getBuildError = function(app) {
    return eval('app.error.'+getPlatformName());
  };

  this._init = function() {
//    this._loadLocalApps();
  };

  // call this 'private' method upon class construction
  this._init();
}