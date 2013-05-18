"use strict";

function AppController() {

  var LSKEY_APPS = "AppController.apps";
  var buildCheckIntervalMillis = 10000;

//  this.apps = [];

//  this._loadLocalApps = function() {
//    var loadedApps = JSON.parse(localStorage.getItem(LSKEY_APPS));
//    if (loadedApps != null) {
//      this.apps = loadedApps;
//    }
//  };

  this.loadAppsFromServer = function(user, platform) {
    PhonegapBuildApiProxy.doGET('apps/'+app.appid, app.user.email, app.user.password, null, this.onLoadAppsFromServerSuccess);
  };

  this.onLoadAppsFromServerSuccess = function(data) {
    alert("Build status for app details: " + JSON.stringify(data));
    // TODO move this to AppsView?
    setTimeout(function() {
      appController.loadAppsFromServer();
    }, buildCheckIntervalMillis);
  };

  this.buildFromRepo = function(phonegappLogin, appid) {
    alert('Building app from repo');
    PhonegapBuildApiProxy.doPUT('apps/'+appid, {pull:true}, phonegappLogin, this.onBuildSuccess);
  };

  // NOTE: this method is called async, so has no context of 'this'
  this.onBuildSuccess = function(phonegappLogin, data) {
    alert("Build trigger success. details: " + JSON.stringify(data));
  };

  this.install = function(app) {
    alert("TODO impl install");
  };

  this._saveApps = function() {
    localStorage.setItem(LSKEY_APPS, JSON.stringify(this.apps));
  };

  this._init = function() {
//    this._loadLocalApps();
  };

  // call this 'private' method upon class construction
  this._init();
}