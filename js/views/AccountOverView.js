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
            var nrOfApps = phonegappLogin.apps.length;
            content += '' +
                '<tr>' +
                '  <td>' +
                '    <h5>'+phonegappLogin.email+'</h5>' +
                '    <div class="appcount">' +
                       nrOfApps + (nrOfApps == 1 ? ' app' : ' apps');

            $(phonegappLogin.apps).each(function(i,d) {
              content += '<br/> - ' + d.title;
            });

            content += '' +
                '    </div>' +
                '    <div class="deletebuttoncolumn">' +
                '      <a class="btn btn-danger deletebutton" data-userid="' + phonegappLogin.user.id + '" href="#" role="button">del</a>' +
                '    </div>' +
                '  </td>' +
                '</tr>';
          }
        }
        $("#userTableBody")
            .html(content)
            .find(".deletebutton")
            .on('click', function() {
              if (confirm("Are you sure?")) {
                userController.delete($(this).attr('data-userid'));
                // reload all data, because apps may be shared between accounts (duplicates), which not may not reappear because they were removed when the app was started
                userController = new UserController();
                alert("The user was deleted.. now close this modal..");
                // TODO close modal
              }
            });
      })
    });
  };

  init();
})();