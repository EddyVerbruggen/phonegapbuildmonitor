"use strict";

function AppsView() { // which is the homepage

  this.refreshView = function() {
    this.loadApps();
    this.bindBuildFromRepoButton();
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
        '            <p>A nice quick and easy slideshow about the features of Phonegapps. Met optioneel deze caption.</p>' +
        '          </div>' +
        '        </div>' +
        '        <div class="item">' +
        '          <img src="img/tutorial/slide2.jpg"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>TODO Nog meer tekst</h4>' +
        '            <p>Of eigenlijk.. zo min mogelijk tekst!</p>' +
        '          </div>' +
        '        </div>' +
        '        <div class="item">' +
        '          <img src="img/tutorial/slide3.jpg"/>' +
        '          <div class="carousel-caption">' +
        '            <h4>TODO Wellicht nog een slide</h4>' +
        '            <p>En weer een beetje bla bla.</p>' +
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
        var imgUrl = app.icon.filename == null ? 'img/default-appicon.png' : 'https://build.phonegap.com/api/v1/apps/'+app.id+'/icon?auth_token='+phonegappLogin.token;
        content += '' +
            '<tr>' +
            '  <td class="iconcolumn"><img class="replace-image" src="'+imgUrl+'" data-userid="'+phonegappLogin.user.id+'" data-appid="'+app.id+'" width="72px" height="72px"/></td>' +
            '  <td>' +
            '    <h4>' + app.title + ' <span class="appversion">' + app.version + '</span></h4>' +
            '    <div class="buildcount">build ' + app.build_count + '</div>'; // TODO add ' - new' when applicable
        if (app.private) {
          content += '    <div class="buildfromrepobutton"><img src="img/private-app.png" width="17px" height="11px"/></div>';
        } else {
          content += '    <div class="buildfromrepobutton"><a data-userid="'+phonegappLogin.user.id+'" data-appid="'+app.id+'" href="#" role="button" class="btn btn-mini btn-inverse"><i class="icon-github"></i>&nbsp;&nbsp;pull latest</a></div>';
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
      return '<a href="#" role="button" class="btn btn-danger" onclick="alert(\''+appController.getBuildError(app)+'\'); return false"><i class="icon-warning-sign"></i> error</a><br/>';
    } else if (buildStatus == "complete") {
      var url = 'http://build.phonegap.com/apps/'+app.id+'/download/'+getPlatformName(); //+'?auth_token='+phonegappLogin.token;
      return '<a href="'+url+'" role="button" class="btn btn-success"><i class="icon-cloud-download"></i> install</a>';
    } else {
      return '<a href="#" onclick="return false" role="button" class="btn btn-info btn-spinner"><i class="icon-spinner icon-spin"></i> pending</a>';
    }
  };
}