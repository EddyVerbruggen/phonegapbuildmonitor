"use strict";

function AppController() {

  this.loadApps = function(phonegappLogin, callback) {
    PhonegapBuildApiProxy.doGET('apps', phonegappLogin, callback);
  };

  this.buildFromRepo = function(phonegappLogin, appid, callback) {
    PhonegapBuildApiProxy.doPUT('apps/'+appid, {pull:true}, phonegappLogin, callback);
  };

  this.getBuildStatus = function(app) {
    return eval('app.status.'+getPlatformName());
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