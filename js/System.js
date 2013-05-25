"use strict";

var settingsController;
var userController;
var appController;
var appsView;
var chartView;
// Google Analytics
var gaPlugin;

function GAStartupSuccess() {
  alert("GA init success");
  googleAnalytics("startup");
}

function GAStartupFail() {
  alert("GA init success");
  googleAnalytics("startup");
}
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
      gaPlugin.init(GAStartupSuccess, GAStartupFail, "UA-28850866-6", 5);
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