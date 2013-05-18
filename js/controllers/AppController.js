"use strict";

function AppController() {

  var LSKEY_APPS = "AppController.apps";

  this.apps = [];

  this.loadApps = function() {
    var loadedApps = JSON.parse(localStorage.getItem(LSKEY_APPS));
    if (loadedApps != null) {
      this.apps = loadedApps;
    }
  };

  this.getBuildStatus = function(app, platform) {
    alert("TODO impl getBuildStatus");
  };

  this.buildFromRepo = function(appid) { // TODO pass in 'app' and remove the mock below
    alert('Building app from repo');
    var app = {
      appid: appid,
      user: {
        email: 'eddyverbruggen@gmail.com',
        password: 'xs4all'
      }
    };
    var data = {
      pull: true
    };
    PhonegapBuildApiProxy.doPUT('apps/'+app.appid, data, app.user.email, app.user.password, null, this.onBuildSuccess);
  };

  // NOTE: this method is called async, so has no context of 'this'
  this.onBuildSuccess = function(data) {
    alert("success: " + JSON.stringify(data));
  };

  this.install = function(app) {
    alert("TODO impl install");
  };

  this._saveApps = function() {
    localStorage.setItem(LSKEY_APPS, JSON.stringify(this.apps));
  };

  this._init = function() {
    this.loadApps();
  };

  // call this 'private' method upon class construction
  this._init();
}