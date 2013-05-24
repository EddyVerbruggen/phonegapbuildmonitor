"use strict";

function SettingsController() {

  var LSKEY_SETTINGS = "SettingsController.settings";

  // default settings
  this.settings = {
    'showGraph' : true
  };

  this.toggleGraph = function() {
    this.settings.showGraph = !this.settings.showGraph;
    this.rememberSettings();
  };

  this.rememberSettings = function() {
    return localStorage.setItem(LSKEY_SETTINGS, JSON.stringify(this.settings));
  };

  // override any defaults with user values
  this._initSettings = function() {
    var userSettings = JSON.parse(localStorage.getItem(LSKEY_SETTINGS));
    if (userSettings != null) {
      this.settings = userSettings;
    }
  };

  // call this 'private' method upon class construction
  this._initSettings();
}