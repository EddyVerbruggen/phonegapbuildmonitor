"use strict";

(function AppsView() { // which is the homepage

  var init = function() {
    $(document).ready(function() {
      $(".buildfromrepobutton a").on("click", function(e) {
        var appid = $(this).attr("data-appid");
        appController.buildFromRepo(appid); // TODO app object (with related user, required for logon to PGBuild API)
        return false;
      })
    });
  };

  init();
})();