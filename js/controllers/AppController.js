"use strict";

function AppController() {

  this.loadApps = function(phonegappLogin, callback) {
    PhonegapBuildApiProxy.doGET('apps', phonegappLogin, callback);
  };

  this.buildFromRepo = function(phonegappLogin, appid) {
    alert('Building app from repo');
    PhonegapBuildApiProxy.doPUT('apps/'+appid, {pull:true}, phonegappLogin, this.onBuildSuccess);
  };

  this.installApp = function(phonegappLogin, appid) {
    alert('Building app from repo');
    PhonegapBuildApiProxy.doPUT('apps/'+appid, {pull:true}, phonegappLogin, this.onBuildSuccess);
  };

  // NOTE: this method is called async, so has no context of 'this'
  this.onBuildSuccess = function(phonegappLogin, data) {
//    alert("Build trigger success. details: " + JSON.stringify(data));
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