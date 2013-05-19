"use strict";

function AppsView() { // which is the homepage

  this.refreshView = function() {
    this.loadApps();
    this.bindBuildFromRepoButton();
  };

  this.bindBuildFromRepoButton = function() {
    $(".buildfromrepobutton a").on("click", function(e) {
      var userid = $(this).attr("data-userid");
      var appid = $(this).attr("data-appid");
      var phonegappLogin = userController.getPhonegappLogin(userid);
      appController.buildFromRepo(phonegappLogin, appid);
      return false;
    });
  };

  this.loadApps = function() {
    var content = '';
    if (userController.phonegappLogins.length == 0) {
      content += '' +
          '<tr>' +
          '  <td>' +
          '    <h5>TODO a caroussel with explanation (images)</h5>' +
          '  </td>' +
          '</tr>';
    } else {
      // TODO make a method in usercontroller which returns a list sorted by buildstate for the current platform (en ontdubbeld!)
      for (var i=0; i<userController.phonegappLogins.length; i++) {
        var phonegappLogin = userController.getPhonegappLogin(userController.phonegappLogins[i].user.id);
        for (var j=0; j<phonegappLogin.apps.length; j++) {
          var app = phonegappLogin.apps[j];
          content += '' +
              '<tr>' +
              '  <td class="iconcolumn"><img src="https://build.phonegap.com/api/v1/apps/'+app.id+'/icon" width="72px" height="72px"/></td>' +
              '  <td>' +
              '    <h4>' + app.title + ' <span class="appversion">' + app.version + '</span></h4>' +
              '    <div class="buildcount">build ' + app.build_count + '</div>'; // TODO add ' - new' when applicable
          if (app.private) {
            content += '    <div class="buildfromrepobutton"><img src="img/private-app.png" width="17px" height="11px"/></div>';
          } else {
            content += '    <div class="buildfromrepobutton"><a data-userid="'+phonegappLogin.user.id+'" data-appid="'+app.id+'" href="#" role="button" class="btn btn-mini btn-inverse">build from repo</a></div>';
          }
          content += '' +
              '    <div class="actionbutton">' + getActionButton(app) + '</div>' +
              '  </td>' +
              '</tr>';
        }
      }
    }
    $("#appTableBody").html(content);
    // TODO some indication that we're constantly polling
//    $("#lastCheck").html("last check @ " + new Date());
  };


//  <div class="actionbutton"><a href="#" role="button" class="btn btn-danger" onclick="alert('iOS signing key is locked')">error</a></div>

  // TODO annimate when state changes
  var getActionButton = function(app) {
    var buildStatus = appController.getBuildStatus(app);
    if (buildStatus == "error") {
      return '<a href="#" role="button" class="btn btn-danger" onclick="alert(\''+appController.getBuildError(app)+'\')">error</a><br/>';
    } else if (buildStatus == "complete") {
      return '<a href="https://build.phonegap.com/api/v1/apps/'+app.id+'/'+getPlatformName()+'" target="_system" role="button" class="btn btn-success">install</a>';
    } else {
      // TODO prepend spinner icon
      return '<a href="#" role="button" class="btn btn-info">pending</a>';
    }
  };

}