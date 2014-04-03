"use strict";

function AppsView() { // which is the homepage

  this.refreshView = function() {
    appsView.displayApps();
    appsView.bindBuildFromRepoButton();
  };

  this.displayNoUsersContent = function() {
    // TODO see http://twitter.github.io/bootstrap/javascript.html#carousel
    $("#appTableBody").html('' +
        '<tr>' +
        '  <td>' +
        '    <div id="myCarousel" class="carousel slide">' +
        '      <ol class="carousel-indicators">' +
        '        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>' +
        '        <li data-target="#myCarousel" data-slide-to="1"></li>' +
        '        <li data-target="#myCarousel" data-slide-to="2"></li>' +
        '      </ol>' +
        // items
        '      <div class="carousel-inner">' +
        '        <div class="active item">' +
        '          <img src="img/tutorial/slide1.png"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>One screen, all your apps!</h4>' +
        '            <p>Add multiple accounts...<br/>and manage all apps on one page.</p>' +
        '          </div>' +
        '        </div>' +
        '        <div class="item">' +
        '          <img src="img/tutorial/slide2.png"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>PhoneGap Build health</h4>' +
        '            <p>Build server slow?<br/>Now you know before you build.</p>' +
        '          </div>' +
        '        </div>' +
        '        <div class="item">' +
        '          <img src="img/tutorial/slide3.png"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>Go ahead, add an account</h4>' +
        '            <p>Use your PhoneGap Build login:<br/>Username/AdobeId or Github.</p>' +
        '          </div>' +
        '        </div>' +
        '      </div>' +
        // nav
        '      <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '      <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '    </div>' +
        '  </td>' +
        '</tr>');
  };

  this.bindBuildFromRepoButton = function() {
    $(".buildfromrepobutton a").on("click", function(e) {
      var userid = $(this).attr("data-userid");
      var appid = $(this).attr("data-appid");
      var phonegappLogin = userController.getPhonegappLogin(userid);
      appController.buildFromRepo(phonegappLogin, appid, userController.loadAppsForUsers);
      googleAnalytics("appsview-pullcode");
      showAlert("Hang on", "Fetching repo and starting a build..");
      return false;
    });
  };

  this.displayApps = function() {
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
      theApps.reverse();
      theAppUsers.reverse();
      for (var i=0; i<theApps.length; i++) {
        var app = theApps[i];
        appid = app.id;
        var phonegappLogin = userController.getPhonegappLogin(theAppUsers[i].user.id);
        var imgUrl = app.icon.filename == null ? 'img/default-appicon.png' : 'https://build.phonegap.com/api/v1/apps/'+appid+'/icon?auth_token='+phonegappLogin.token;
        content += '' +
            '<tr>' +
            '  <td class="iconcolumn"><img class="img-rounded" src="'+imgUrl+'" data-userid="'+phonegappLogin.user.id+'" data-appid="'+appid+'" width="72px" height="72px"/></td>' +
            '  <td>' +
            '    <h4>' + app.title + '<span class="appversion">' + app.version + '</span></h4>';
        // TODO [future version]: for non-private apps, we could use the downloadlink, but that one includes the auth_token, so warn the user before sending it to others (or use a proxy server) .. or use the download GET service?
        if (app.private) {
          content += '<div class="sharebutton"><i class="icon-eye-open" style="color:#999"></i></div>';
        } else {
          content += '<div class="sharebutton" onclick="googleAnalytics(\'appsview-share\'); location.href=\'mailto:?subject='+app.title+' build '+app.build_count+'&body=Click one of these links on your mobile device:%0D%0A%0D%0A%0D%0AiOS: '+appController.getShareLink(app, 'ios')+'%0D%0A%0D%0AAndroid: '+appController.getShareLink(app, 'android')+'\'"><i class="icon-share"></i></div>';
        }
        content += '<div class="signingkeybutton" onclick="appsView.showSigningKeyModal(\''+phonegappLogin.user.id+'\', \''+appid+'\'); return false"><i class="icon-key"></i></div>';
        if (app.build_count == null) {
          content += '    <div class="buildcount">no builds yet</div>';
        } else {
          content += '    <div class="buildcount">build ' + app.build_count + (app.buildCountDiff > 0 ? '&nbsp;&nbsp;<span class="buildmeister-icon-updated"><i class="icon-'+(app.buildCountDiff > 5 ? 'double-' : '')+'angle-up"></i>' : '') + '</span></div>';
        }
        if (app.repo == null) {
          content += '    <div class="buildfromrepobutton"><a href="#" onclick="return false" role="button" class="btn btn-xs">zip upload</a></div>';
        } else {
          content += '    <div class="buildfromrepobutton"><a data-userid="'+phonegappLogin.user.id+'" data-appid="'+appid+'" href="#" role="button" class="btn btn-xs btn-inverse"><i class="'+getPullIcon(app.repo)+'"></i>&nbsp;&nbsp;pull code</a></div>';
        }
        content += '<div class="builddots">';
        if (isAndroid() || settingsController.settings.iOSInstallButtonEnabled) {
          content += '' +
              '    <span class="builddots4">' +
              '      <i class="'+getBuildStatusSpinClass(app, 'ios')+' icon-apple" style="color:'+getBuildStatusColour(app, 'ios')+'" title="ios"></i>' +
              '      <i class="'+getBuildStatusSpinClass(app, 'android')+' icon-android" style="color:'+getBuildStatusColour(app, 'android')+'" title="android"></i><br/>' +
              '      <i class="'+getBuildStatusSpinClass(app, 'winphone')+' icon-windows" style="color:'+getBuildStatusColour(app, 'winphone')+'" title="winphone"></i>' +
//              '      <i class="'+getBuildStatusSpinClass(app, 'blackberry')+" style="color:'+getBuildStatusColour(app, 'blackberry')+'" title="blackberry">b</i><br/>' +
              // TODO whenever font awesome supports a proper blackberry icon, use it
              '      <i class="'+getBuildStatusSpinClass(app, 'blackberry')+' icon-bitcoin" style="color:'+getBuildStatusColour(app, 'blackberry')+'" title="blackberry"></i><br/>' +
              '    </span>';
        } else {
          content += '' +
              '      <i class="icon-apple" style="color:'+getBuildStatusColour(app, 'ios')+'" title="ios"></i>' +
              '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'android')+'" title="android"></i><br/>' +
              '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'winphone')+'" title="winphone"></i>' +
              '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'blackberry')+'" title="blackberry"></i><br/>' +
              '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'webos')+'" title="webos"></i>' +
              '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'symbian')+'" title="symbian"></i>';
        }
        content += '' +
            '      </div>' +
            '    <div class="actionbutton">' + getActionButton(app, phonegappLogin) + '</div>' +
            '  </td>' +
            '</tr>';
      }
    }
    $("#appTableBody").html(content);

    // TODO some indication that we're constantly polling (with a 'check now button?')
//    $("#lastCheck").html("Next check in .. seconds. Check now (button)");
  };

  var getPullIcon = function(repoUrl) {
    if (repoUrl.indexOf("github.com") > -1) {
      return "icon-github-alt";
    } else if (repoUrl.indexOf("bitbucket.org") > -1) {
      return "icon-bitbucket";
    } else {
      return "icon-refresh";
    }
  };

  var getBuildStatusColour = function(app, platform) {
    var status = appController.getBuildStatus(app, platform);
    if (status == "complete") {
      return "green";
    } else if (status == "pending") {
      return "#bbb";
    } else {
      return "red";
    }
  };

  var getBuildStatusSpinClass = function(app, platform) {
    var status = appController.getBuildStatus(app, platform);
    if (status == "pending") {
      return "icon-spin";
    } else {
      return "";
    }
  };

  // TODO animate button/row when state changes
  var getActionButton = function(app, phonegappLogin) {
    var appid = app.id;
    var buildStatus = appController.getBuildStatus(app, getPlatformName());
    // TODO always show the option to choose the signing key (maybe as a text/link below the pull button)?
    if (buildStatus == "error") {
      var errorMsg = appController.getBuildError(app);
//      if (errorMsg.indexOf("signing key is locked") > -1) {
        return '<a href="#" role="button" class="btn btn-danger" onclick="appsView.showSigningKeyModal(\''+phonegappLogin.user.id+'\', \''+appid+'\', \''+errorMsg+'\'); return false"><i class="icon-warning-sign"></i> error</a><br/>';
//      } else {
//        return '<a href="#" role="button" class="btn btn-danger" onclick="showAlert(\'Error\', \''+appController.getBuildError(app)+'\'); return false"><i class="icon-warning-sign"></i> error</a><br/>';
//      }
    } else if (buildStatus == "complete") {
      if (isAndroid() || settingsController.settings.iOSInstallButtonEnabled) {
        var url = appController.getDownloadLink(app, phonegappLogin, getPlatformName());
        return '<a href="#" onclick="googleAnalytics(\'appsview-install\'); userController.resetBuildCountDiff(\''+appid+'\'); openWindow(\''+url+'\'); return false" role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install</a>';
      } else {
        return '<a href="#" role="button" class="btn btn-success"><i class="icon-ok"></i> ready</a>';
      }
    } else if (buildStatus == "pending") {
      return '<a href="#" onclick="return false" role="button" class="btn btn-info btn-spinner"><i class="icon-spinner icon-spin"></i> pending</a>';
    } else {
      return '';
    }
  };

  this.showSigningKeyModal = function(userid, appid, errorMsg) {
    $('#keysModal').modal('show');
    googleAnalytics("signingkeys-show");
    $("#signingKeyErrorMessageContainer").html(errorMsg == undefined ? "" : "Error: " + errorMsg);

    for (var i=0; i<userController.phonegappLogins.length; i++) {
      if (userid == userController.phonegappLogins[i].user.id) {
        var phonegappLogin = userController.getPhonegappLogin(userid);
        appController.getSigningKeys(phonegappLogin, getPlatformName(), function(pgLogin, data) {
          var content = '<option value="">no key selected</option>';
          content += '<optgroup label="unlocked">';
          $(data.keys).each(function(i, key) {
            if (!key.locked) {
              content += '<option value="'+key.id+'" data-locked="false">' + key.title + '</option>';
            }
          });
          content += '</optgroup>';
          content += '<optgroup label="locked">';
          $(data.keys).each(function(i, key) {
            if (key.locked) {
              content += '<option value="'+key.id+'" data-locked="true">' + key.title + '</option>';
            }
          });
          content += '</optgroup>';
          $("#keysSelection").html(content);
          $("#certificatePasswordContainer").show();
          if (isAndroid()) {
            $("#keystorePasswordContainer").show();
          }
          $("#certificatePasswordHint").show();

          // now that we have a list, we need to know which one is currently selected
          appController.getAppDetails(pgLogin, appid, function(pgLoginInner, dataInner) {
            var platformKey = eval('dataInner.keys.'+getPlatformName());
            if (platformKey != null) {
              $("#keysSelection").val(platformKey.id);
            }
            $("#useKeyButton")
                .attr("data-userid", userid)
                .attr("data-appid", appid)
                .attr("data-hasrepo", dataInner.repo != null)
                .unbind("click")
                .bind("click", function() {
                  var selectedOption = $("#keysSelection").find("option:selected");
                  // a signing key is required for iOS
                  if (selectedOption.val() == "" && isIOS()) {
                    showAlert("Oops!", "Please select a certificate");
                    // not focusing on dropdown here because it looks awkward on mobile
                    return false;
                  }
                  var certPassword = $("#certificatePassword").val();
                  var keystorePassword = $("#keystorePassword").val();
                  if ((certPassword == "" || (isAndroid() && keystorePassword == "")) && selectedOption.attr('data-locked') == "true") {
                    showAlert("Oops!", "Password is required to unlock the signing key");
                    return false;
                  }
                  var userid = $(this).attr("data-userid");
                  var appid = $(this).attr("data-appid");
                  var hasrepo = $(this).attr("data-hasrepo");
                  var phonegappLogin = userController.getPhonegappLogin(userid);
                  googleAnalytics("signingkeys-build");
                  appController.buildWithSigningKey(phonegappLogin, appid, selectedOption.val(), certPassword, keystorePassword, hasrepo, userController.loadAppsForUsers);
                  showAlert("Hang on", (hasrepo ? "Fetching repo and s" : "S") + "tarting a build with this key..");
                  $("#certificatePassword").val("");
                  $("#keystorePassword").val("");
                  return true;
            });
          });
        });
        break;
      }
    }

  };

  $('#keysModal').on('hide', function () {
    $("#keysTableBody").html("");
    $("#certificatePasswordContainer").hide();
    $("#keystorePasswordContainer").hide();
    $("#certificatePasswordHint").hide();
  });

}