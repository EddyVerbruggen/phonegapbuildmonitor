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

  this.buildFromRepo = function(app) {
    alert("TODO impl buildFromRepo");
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