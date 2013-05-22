"use strict";

function AppsView() { // which is the homepage

  this.refreshView = function() {
    appsView.displayApps();
    appsView.bindBuildFromRepoButton();
    if (window.plugins != undefined) {
      window.plugins.childBrowser.onLocationChange = function (url) {
        alert("childbrowser url changed to: " + url);
      }
    }
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
        '          <img src="img/tutorial/slide1.jpg"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>TODO Tutorial images</h4>' +
        '            <p>A nice quick and easy slideshow.</p>' +
        '          </div>' +
        '        </div>' +
        '        <div class="item">' +
        '          <img src="img/tutorial/slide2.jpg"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>TODO Nog meer tekst</h4>' +
        '            <p>Met zo min mogelijk tekst!</p>' +
        '          </div>' +
        '        </div>' +
        '        <div class="item">' +
        '          <img src="img/tutorial/slide3.jpg"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>TODO Nog een slide?</h4>' +
        '            <p>En nog wat bla bla?</p>' +
        '          </div>' +
        '        </div>' +
        '      </div>' +
        // nav
        '      <a class="carousel-control left" href="#myCarousel" data-slide="prev">&lsaquo;</a>' +
        '      <a class="carousel-control right" href="#myCarousel" data-slide="next">&rsaquo;</a>' +
        '    </div>' +
        '  </td>' +
        '</tr>');
//    $('#myCarousel').carousel({
//      interval: 2000
//    })
  };

  this.bindBuildFromRepoButton = function() {
    $(".buildfromrepobutton a").on("click", function(e) {
      var userid = $(this).attr("data-userid");
      var appid = $(this).attr("data-appid");
      var phonegappLogin = userController.getPhonegappLogin(userid);
      appController.buildFromRepo(phonegappLogin, appid, userController.loadAppsForUsers);
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
        var phonegappLogin = userController.getPhonegappLogin(theAppUsers[i].user.id);
        var imgUrl = app.icon.filename == null ? 'img/default-appicon.png' : 'https://build.phonegap.com/api/v1/apps/'+app.id+'/icon?auth_token='+phonegappLogin.token;
        content += '' +
            '<tr>' +
            '  <td class="iconcolumn"><img src="'+imgUrl+'" data-userid="'+phonegappLogin.user.id+'" data-appid="'+app.id+'" width="72px" height="72px"/></td>' +
            '  <td>' +
            '    <h4>' + app.title + ' <span class="appversion">' + app.version + '</span></h4>' +
//            '    <div class="buildcount">build ' + app.build_count + (app.buildCountDiff > 0 ? '&nbsp;&nbsp;<code class="phonegapps-icon-updated"><i class="icon-'+(app.buildCountDiff > 5 ? 'double-' : '')+'angle-up"></i>' : '') + '</code></div>';
            '    <div class="buildcount">build ' + app.build_count + (app.buildCountDiff > 0 ? '&nbsp;&nbsp;<span class="phonegapps-icon-updated"><i class="icon-'+(app.buildCountDiff > 5 ? 'double-' : '')+'angle-up"></i>' : '') + '</span></div>';
        if (app.private) {
          content += '    <div class="buildfromrepobutton"><i class="icon-eye-open icon-large"></i></div>';
        } else {
          content += '    <div class="buildfromrepobutton"><a data-userid="'+phonegappLogin.user.id+'" data-appid="'+app.id+'" href="#" role="button" class="btn btn-mini btn-inverse"><i class="icon-github"></i>&nbsp;&nbsp;pull code</a></div>';
        }
        content += '' +
            '    <div class="builddots">' +
            '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'ios')+'" title="ios"></i>' +
            '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'android')+'" title="android"></i><br/>' +
            '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'winphone')+'" title="winphone"></i>' +
            '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'blackberry')+'" title="blackberry"></i><br/>' +
            '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'webos')+'" title="webos"></i>' +
            '      <i class="icon-circle" style="color:'+getBuildStatusColour(app, 'symbian')+'" title="symbian"></i>' +
            '    </div>' +
            '    <div class="actionbutton">' + getActionButton(app, phonegappLogin) + '</div>' +
            '  </td>' +
            '</tr>';
      }
    }
    $("#appTableBody").html(content);

    // TODO some indication that we're constantly polling (with a 'check now button?')
//    $("#lastCheck").html("Next check in .. seconds. Check now (button)");
  };

  var getBuildStatusColour = function(app, platform) {
    var status = appController.getBuildStatus(app, platform)
    if (status == "complete") {
      return "green";
    } else if (status == "pending") {
      return "#bbb";
    } else {
      return "red";
    }
  };

  // TODO animate button/row when state changes
  var getActionButton = function(app, phonegappLogin) {
    var buildStatus = appController.getBuildStatus(app, getPlatformName());
    if (buildStatus == "error") {
      return '<a href="#" role="button" class="btn btn-danger" onclick="showAlert(\'Error\', \''+appController.getBuildError(app)+'\'); return false"><i class="icon-warning-sign"></i> error</a><br/>';
    } else if (buildStatus == "complete") {
      var url = 'http://www.thumbrater.com:9100/'+app.id+'/'+getPlatformName() +'/'+phonegappLogin.token+'/app.apk';
      var url2 = 'https://build.phonegap.com/'+PhonegapBuildApiProxy.getApiVersion()+'apps/'+app.id+'/'+getPlatformName() +'?auth_token='+phonegappLogin.token;
      var url3 = 'https://'+phonegappLogin.email+':'+phonegappLogin.password+'@build.phonegap.com/'+PhonegapBuildApiProxy.getApiVersion()+'apps/'+app.id+'/'+getPlatformName();
      var url4 = 'https://eddyverbruggen%40gmail.com:xs4all@build.phonegap.com/api/v1/apps/406105/android';
      var url5 = 'https://'+encodeURIComponent(phonegappLogin.email)+':'+phonegappLogin.password+'@build.phonegap.com/'+PhonegapBuildApiProxy.getApiVersion()+'apps/'+app.id+'/'+getPlatformName();
      return '<a href="'+url+'" role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 1</a>' +
          '<a href="'+url+'" target="_system" role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 2</a>' +
          '<a href="'+url2+'" target="_new" role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 3</a>' +
          '<a href="'+url3+'" target="_blank" role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 4</a>' +
          // op android werkt hierboven allemaal niet, maar hieronder allemaal wel (op ios nog niks getest)
          '<a href="#" onclick="openWindow(\''+url+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 5</a>' +
          '<a href="#" onclick="openWindow(\''+url2+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 6</a>' +
          '<a href="#" onclick="openWindow(\''+url3+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 7</a>' +

          '<a href="#" onclick="openChildBrowser(\''+url+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 8</a>' + // TEST
          // INTERESSANT: get the redirect url..
          '<a href="#" onclick="openChildBrowser(\''+url2+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 9</a>' + // TEST
          '<a href="#" onclick="openChildBrowser(\''+url3+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 10</a>' + // TEST
          '<a href="#" onclick="openChildBrowser(\''+url4+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 11</a>' + // TEST
          '<a href="#" onclick="openChildBrowser(\''+url5+'\'); return false"role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install 12</a>'; // TEST
            // Capture loadstart event
    } else {
      return '<a href="#" onclick="return false" role="button" class="btn btn-info btn-spinner"><i class="icon-spinner icon-spin"></i> pending</a>';
    }
  };
}