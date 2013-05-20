"use strict";

function AppsView() { // which is the homepage

  this.refreshView = function() {
    this.loadApps();
    this.bindBuildFromRepoButton();
  };

  this.displayNoUsersContent = function() {
    $("#appTableBody").html('' +
        '<tr>' +
        '  <td>TODO: in this no-accounts-yet state, add a caroussel with explanation about this app (images)</td>' +
        '</tr>');
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
    if (userController.phonegappLogins.length > 0) {

      // remove duplicate apps
      var knownApps = [];
      var theApps = [];
      var theAppUsers = [];
      for (i=0; i<userController.phonegappLogins.length; i++) {
        for (var k=0; k<userController.phonegappLogins[i].apps.length; k++) {
          var appid = userController.phonegappLogins[i].apps[k].id;
          if (knownApps.indexOf(appid) == -1) {
            knownApps.push(appid);
            theApps.push(userController.phonegappLogins[i].apps[k]);
            theAppUsers.push(userController.phonegappLogins[i]);
          }
        }
      }

      // sort the apps (newest first)
      theApps.sort(); // TODO anonymous sort function
      for (var i=0; i<theApps.length; i++) {
        var app = theApps[i];
        var phonegappLogin = userController.getPhonegappLogin(theAppUsers[i].user.id);
        var imgUrl = app.icon.filename == null ? 'img/default-appicon.png' : 'https://build.phonegap.com/api/v1/apps/'+app.id+'/icon?auth_token=Rt9jJoTxCgDBQrYfuHLk';
        content += '' +
            '<tr>' +
            '  <td class="iconcolumn"><img class="replace-image" src="'+imgUrl+'" data-userid="'+phonegappLogin.user.id+'" data-appid="'+app.id+'" width="72px" height="72px"/></td>' +
            '  <td>' +
            '    <h4>' + app.title + ' <span class="appversion">' + app.version + '</span></h4>' +
            '    <div class="buildcount">build ' + app.build_count + '</div>'; // TODO add ' - new' when applicable
        if (app.private) {
          content += '    <div class="buildfromrepobutton"><img src="img/private-app.png" width="17px" height="11px"/></div>';
        } else {
          content += '    <div class="buildfromrepobutton"><a data-userid="'+phonegappLogin.user.id+'" data-appid="'+app.id+'" href="#" role="button" class="btn btn-mini btn-inverse">build from repo</a></div>';
        }
        content += '' +
            '    <div class="actionbutton">' + getActionButton(app, phonegappLogin) + '</div>' +
            '  </td>' +
            '</tr>';
      }
    }
    $("#appTableBody").html(content);

    // TODO some indication that we're constantly polling (with an 'check now button?')
//    $("#lastCheck").html("Next check in .. seconds. Check now (button)");
  };

  // TODO animate button/row when state changes
  var getActionButton = function(app, phonegappLogin) {
    var buildStatus = appController.getBuildStatus(app);
    if (buildStatus == "error") {
      return '<a href="#" role="button" class="btn btn-danger" onclick="alert(\''+appController.getBuildError(app)+'\')">error</a><br/>';
    } else if (buildStatus == "complete") {
      var url = 'https://build.phonegap.com/api/v1/apps/'+app.id+'/'+getPlatformName()+'?auth_token=Rt9jJoTxCgDBQrYfuHLk'; // TODO no fixed token
//      if (phonegappLogin.isTokenLogin()) {
//      } else {
//        url = 'https://'+encodeURIComponent(phonegappLogin.email)+':'+encodeURIComponent(phonegappLogin.password)+'@build.phonegap.com/api/v1/apps/'+app.id+'/'+getPlatformName();
//      }

//      PhonegapBuildApiProxy.doGET("/apps/"+app.id+"/"+getPlatformName(), phonegappLogin, function(data){alert('result ' + JSON.stringify(data))});
//      PhonegapBuildApiProxy.loadWithRedirect("/apps/"+app.id+"/"+getPlatformName(), phonegappLogin);

      return '<a href="'+url+'" target="_system" role="button" class="btn btn-success">install</a>';
    } else {
      // TODO prepend spinner icon
      return '<a href="#" role="button" class="btn btn-info">pending</a>';
    }
  };

}