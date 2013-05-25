"use strict";

var settingsController;
var userController;
var appController;
var appsView;
var chartView;
// Google Analytics
var gaPlugin;

// construct and execute a System setup class
(function System() {

  var onDeviceReady = function() {
    settingsController = new SettingsController();
    appsView = new AppsView();
    chartView = new ChartView();
    appController = new AppController();
    userController = new UserController();
    userController.init();
    if (window.plugins != undefined) {
      gaPlugin = window.plugins.gaPlugin;
      gaPlugin.init(emptyCallback, emptyCallback, "UA-28850866-6", 3);
      googleAnalytics("startup");
    }
  };

  var init = function() {
    $(document).ready(function() {
      if (isMobile()) {
        document.addEventListener('deviceready', onDeviceReady, false);
      } else {
        onDeviceReady();
      }
    });
  };

  init();
})();