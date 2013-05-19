"use strict";

var userController;
var appController;
var appsView;

// construct and execute a System setup class
(function System() {

  var onDeviceReady = function() {
  };

  var init = function() {
    $(document).ready(function() {
      document.addEventListener('deviceready', onDeviceReady, false);
      appsView = new AppsView();
      appController = new AppController();
      userController = new UserController();
      userController.loadUsers();
    });
  };

  init();
})();