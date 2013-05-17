"use strict";

var userController;
var appController;

// construct and execute a System setup class
(function System() {

  var onDeviceReady = function() {
    alert("device ready")
  };

  var init = function() {
    $(document).ready(function() {
      document.addEventListener('deviceready', onDeviceReady, false);
      userController = new UserController();
      appController = new AppController();
    });
  };

  init();
})();