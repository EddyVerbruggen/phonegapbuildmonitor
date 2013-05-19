"use strict";

// silly name coming up :)
(function AccountOverView() {

  var init = function() {
    $(document).ready(function() {
      $('#accountsModal').on('show', function () {
        var content = '';
        if (userController.phonegappLogins.length == 0) {
          content += '' +
              '<tr>' +
              '  <td>' +
              '    <h5>No accounts yet. Don\'t be shy :)</h5>' +
              '  </td>' +
              '</tr>';
        } else {
          for (var i=0; i<userController.phonegappLogins.length; i++) {
            var phonegappLogin = userController.phonegappLogins[i];
            var nrOfApps = phonegappLogin.user.apps.all.length;
            content += '' +
                '<tr>' +
                '  <td>' +
                '    <h5>'+phonegappLogin.email+'</h5>' +
                '    <div class="appcount">' +
                       nrOfApps+' app'+(nrOfApps == 1 ? '' : 's');

            $(phonegappLogin.user.apps.all).each(function(i,d) {
              content += '<br/> - ' + d.title;
            });

            content += '' +
                '    </div>' +
                '  </td>' +
                '  <td class="deletebuttoncolumn">' +
                '    <a class="btn btn-danger deletebutton" data-userid="' + phonegappLogin.user.id + '" href="#" role="button">del</a>' +
                '  </td>' +
                '</tr>';
          }
        }
        $("#userTable")
            .html(content)
            .find(".deletebutton")
            .on('click', function() {
              if (confirm("Are you sure?")) {
                userController.delete($(this).attr('data-userid'));
                alert("The user was deleted");
              }
            });
      })
    });
  };

  init();
})();