"use strict";

function AppController() {

  this.loadApps = function(phonegappLogin, callback) {
    PhonegapBuildApiProxy.doGET('apps', phonegappLogin, callback);
  };

  this.buildFromRepo = function(phonegappLogin, appid, callback) {
//    var form = document.getElementById("bla");
//    var formData = new FormData(document.getElementById("bla"));
//    formData.append('pull', 'true');
    var data = {
      'pull': 'true'
    };
    phonegappLogin.token = null;
    PhonegapBuildApiProxy.doPUT('apps/'+appid, $('#bla').serialize(), phonegappLogin, callback);
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