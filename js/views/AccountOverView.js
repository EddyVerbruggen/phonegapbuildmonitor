"use strict";

// silly name coming up :)
(function AccountOverView() {

  var init = function() {
    $(document).ready(function() {
      $('#accountsModal').on('show', function () {
        // TODO fill accounts here
        for (var i=0; i<userController.phonegappLogins.length; i++) {
          var phonegappLogin = userController.phonegappLogins[i];
          $("#userTable").append("<br/>TODO.. " + phonegappLogin.email);
        }
      })
    });
  };

  init();
})();