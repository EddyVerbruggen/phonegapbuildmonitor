"use strict";

function SettingsController() {

  var LSKEY_SETTINGS = "SettingsController.settings";

  // default settings
  this.settings = {
    'showGraph' : true,
    'iOSInstallButtonEnabled' : false
  };

  this.toggleGraph = function() {
    this.settings.showGraph = !this.settings.showGraph;
    this.rememberSettings();
  };

  this.enableIOSInstallButton = function(bool) {
    this.settings.iOSInstallButtonEnabled = bool;
    this.rememberSettings();
  };

  this.rememberSettings = function() {
    return localStorage.setItem(LSKEY_SETTINGS, JSON.stringify(this.settings));
  };

  // override any defaults with user values
  this._initSettings = function() {
    var userSettings = localStorage.getItem(LSKEY_SETTINGS);
    if (userSettings != null) {
      this.settings = JSON.parse(userSettings);
    }
  };

  // call this 'private' method upon class construction
  this._initSettings();
}