"use strict";

var userController;
var appController;
var appsView;

// construct and execute a System setup class
(function System() {

  var onDeviceReady = function() {
    appsView = new AppsView();
    appController = new AppController();
    userController = new UserController();
    userController.loadUsers();
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