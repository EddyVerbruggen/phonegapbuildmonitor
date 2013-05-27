"use strict";

// silly name coming up :)
(function AccountOverView() {

  var deleteUserid;

  var showConfirmDeleteDialogue = function() {
    if (isMobile()) {
      navigator.notification.confirm(
          'It was nice having you anyway :)',
          onConfirmDelete,
          'Are you sure?',
          'Yes,No'
          );
    } else {
      if (confirm("Are you sure?")) {
        onConfirmDelete();
      }
    }
  };

  var onConfirmDelete = function() {
    userController.delete(deleteUserid);
    googleAnalytics("accountoverview-delete");
    showAlert("Success", "Account deleted");
    // brute force close the modal and refresh
    refresh();
  };

  var init = function() {
    $(document).ready(function() {
      $('#accountsModal').on('show', function () {
        googleAnalytics("accountoverview-show");
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
                '    <h5><i class="icon-user"></i> '+phonegappLogin.email+'</h5>' +
                '    <div class="appcount">' +
                       nrOfApps + (nrOfApps == 1 ? ' app' : ' apps');

            $(phonegappLogin.apps).each(function(i,d) {
              content += '<br/> - ' + d.title;
            });

            content += '' +
                '    </div>' +
                '    <div class="deletebuttoncolumn">' +
                '      <a class="btn btn-danger deletebutton" data-userid="' + phonegappLogin.user.id + '" href="#" role="button"><i class="icon-trash"></i>&nbsp;&nbsp;del</a>' +
                '    </div>' +
                '  </td>' +
                '</tr>';
          }
        }
        $("#userTableBody")
            .html(content)
            .find(".deletebutton")
            .on('click', function() {
              deleteUserid = $(this).attr('data-userid');
              showConfirmDeleteDialogue();
            });
      })
    });
  };

  init();
})();