"use strict";

(function AppsView() { // which is the homepage

  var init = function() {
    $(document).ready(function() {
      $(".buildfromrepobutton a").on("click", function(e) {
        var userid = $(this).attr("data-userid");
        var appid = $(this).attr("data-appid");
        var phonegappLogin = userController.getPhonegappLogin(userid);
        appController.buildFromRepo(phonegappLogin, appid);
        return false;
      })
    });
  };

  init();
})();