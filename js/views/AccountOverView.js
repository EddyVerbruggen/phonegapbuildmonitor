"use strict";

// silly name coming up :)
(function AccountOverView() {

  var deleteUserid;

  var showConfirmDeleteDialogue = function() {
    if (isMobile()) {
      navigator.notification.confirm(
          'Shame, it was a nice account :)',
          onConfirmDelete,
          'Are you sure?',
          'Yes,No'
          );
    } else {
      if (confirm("Are you sure?")) {
        onConfirmDelete(1);
      }
    }
  };

  var onConfirmDelete = function(buttonIndex) {
    if (buttonIndex == 1) {
      userController.delete(deleteUserid);
      googleAnalytics("accountoverview-delete");
      showToast("Account deleted");
      // brute force close the modal and refresh
      refresh();
    }
  };

  var init = function() {
    $(document).ready(function() {
      $('#accountsModal').on('shown.bs.modal', function () {
        googleAnalytics("accountoverview-show");
        var content = '';
        if (userController.phonegappLogins.length == 0) {
          content += '' +
              '<tr>' +
              '  <td>' +
              '    <h5>No accounts yet. Don\'t be shy, you can add as many as you like ;)</h5>' +
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
                '      <a class="btn btn-danger deletebutton" data-userid="' + phonegappLogin.user.id + '" href="#" role="button"><i class="fa fa-trash-o"></i>&nbsp;&nbsp;del</a>' +
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