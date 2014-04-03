"use strict";

(function AddAccountView() {

  var init = function() {
    $(document).ready(function() {
      $('#addAccountModal')
          .on('shown.bs.modal', function () {
            googleAnalytics("accountadd-show");
          })
          .on('hidden.bs.modal', function () {
            // clear all fields
            $("#addAccount_Email").val("");
            $("#addAccount_Password").val("");
            $("#addAccount_Token").val("");
          });

      $("#signInButton").on("click", function() {
        var email = $("#addAccount_Email").val();
        var password = $("#addAccount_Password").val();
        var token = $("#addAccount_Token").val();
        userController.signIn(email, password, token);
        googleAnalytics("accountadd-signin-"+(token == "" ? "email" : "token"));
        return false;
      })
    });
  };

  init();
})();