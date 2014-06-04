"use strict";

var settingsController;
var userController;
var appController;
var appsView;
var chartView;
// Google Analytics
var gaPlugin;

function GAStartupSuccess() {
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
    document.addEventListener("menubutton", function(){$('#menu').collapse('toggle')}, false);
    if (window.plugins != undefined) {
      gaPlugin = window.plugins.gaPlugin;
      gaPlugin.init(GAStartupSuccess, emptyCallback, "UA-28850866-8", 5);
      // Testing iOS*
      setTimeout(function() {
        alert(navigator);
        alert(navigator.userAgent);
      }, 4000);
      /*
      if (isIOS()) {
        setTimeout(function () {
          StatusBar.styleLightContent();
          StatusBar.overlaysWebView(true);
          window.plugins.webviewcolor.change('#ededea');
          setTimeout(function () {
            navigator.splashscreen.hide();
          }, 250);
        }, 500);
      }
      */
    }
  };

  var init = function() {
    $(document).ready(function() {
      if (isMobile()) {
        document.addEventListener('deviceready', onDeviceReady, false);
      } else {
        onDeviceReady();
      }
      FastClick.attach(document.body);
    });
  };

  init();
})();