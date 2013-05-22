"use strict";

function UserController() {

  var LSKEY_PHONEGAPPLOGINS = "UserController.phonegappLogins";
  var buildCheckIntervalMillis = isMobile() ? 10000 : 99990000; // relax on the desktop
  var callbacksReceived;

  // an array of PhonegapLogin, stored in LS which also holds the API user and user.apps
  this.phonegappLogins = [];

  this.loadUsers = function() {
    var loadedUsers = JSON.parse(localStorage.getItem(LSKEY_PHONEGAPPLOGINS));
    if (loadedUsers == null || loadedUsers == "") {
      appsView.displayNoUsersContent();
    } else {
      this.phonegappLogins = loadedUsers;
      this.loadAppsForUsers();
    }
  };

  // ignore the params, just added them for testing when this is called as a callback
  this.loadAppsForUsers = function(phonegappLogin, data) {
    userController.callbacksReceived = 0;
    for (var i=0; i<userController.phonegappLogins.length; i++) {
      appController.loadApps(userController.getPhonegappLogin(userController.phonegappLogins[i].user.id), userController.onLoadAppsSuccess);
    }
  };

  this.onLoadAppsSuccess = function(phonegappLogin, data) {
    var isLastCallback = (++userController.callbacksReceived == userController.phonegappLogins.length);

    // store the apps for the user
    for (var i=0; i<userController.phonegappLogins.length; i++) {
      if (phonegappLogin.user.id == userController.phonegappLogins[i].user.id) {

        // add a property to each app, so we can show it has been changed to the user
        if (userController.phonegappLogins[i].apps != null) {
          for (var j=0; j<data.apps.length; j++) {
            for (var k=0; k<userController.phonegappLogins[i].apps.length; k++) {
              if (userController.phonegappLogins[i].apps[k].id == data.apps[j].id) {
                var newBuildCountDiff = data.apps[j].build_count - userController.phonegappLogins[i].apps[k].build_count;
                // TODO reset to 0 when the user updates/installs it
                if (userController.phonegappLogins[i].apps[k].buildCountDiff == undefined) {
                  data.apps[j].buildCountDiff = newBuildCountDiff;
                } else {
                  data.apps[j].buildCountDiff = userController.phonegappLogins[i].apps[k].buildCountDiff + newBuildCountDiff;
                }
                break;
              }
            }
          }
        }
        userController.phonegappLogins[i].apps = data.apps;
        userController.persistUsers();
        break;
      }
    }

    if (isLastCallback) {
      appsView.refreshView();
      // load the list again after a timeout
      setTimeout(userController.loadAppsForUsers, buildCheckIntervalMillis);
    }
  };

  this.getPhonegappLogin = function(userid) {
    for (var i=0; i<this.phonegappLogins.length; i++) {
      if (userid == this.phonegappLogins[i].user.id) {
        return new PhonegappLogin().createFromObj(this.phonegappLogins[i]);
      }
    }
    return null;
  };

  this.signIn = function(email, password, token /* for example: Rt9jJoTxCgDBQrYfuHLk */) {
    if ((email == "" || password == "") && token == "") {
      showAlert("Please fill in one of the authentication options");
    } else {
      var phonegappLogin = new PhonegappLogin();
      phonegappLogin.email = email;
      phonegappLogin.password = password;
      phonegappLogin.token = token;

      // if username/password login was used, request a token first and then sign in
      if (token == "") {
        PhonegapBuildApiProxy.getToken(phonegappLogin, this.onTokenRequestSuccess);
      } else {
        PhonegapBuildApiProxy.doGET('me', phonegappLogin, this.onSignInSuccess);
      }
    }
  };

  // sign in with the token
  this.onTokenRequestSuccess = function(phonegappLogin, data) {
    userController.signIn(
        phonegappLogin.email,
        phonegappLogin.password,
//        "", // TODO do not store passwords in the app (when no longer required for downloading the file
        data.token);
  };

  this.delete = function(userid) {
    for (var i=0; i<this.phonegappLogins.length; i++) {
      if (userid == this.phonegappLogins[i].user.id) {
        this.phonegappLogins.splice(i, 1);
        this.persistUsers();
        break;
      }
    }
  };

  // NOTE: this method is called async, so there is no 'this'
  this.onSignInSuccess = function(phonegappLogin, user) {
    phonegappLogin.user = user;
    userController.save(phonegappLogin);
    // hide the modal and load the apps.. so why not just load the index ;)
    window.location = "index.html";
  };

  this.save = function(phonegappLogin) {
    var existingUser = false;
    for (var i=0; i<userController.phonegappLogins.length; i++) {
      if (phonegappLogin.equals(this.phonegappLogins[i])) {
        this.phonegappLogins[i] = phonegappLogin;
        existingUser = true;
        break;
      }
    }
    if (!existingUser) {
      this.phonegappLogins.push(phonegappLogin);
    }
    this.persistUsers();
    showAlert("sign in succeeded");
  };

  this.persistUsers = function() {
    localStorage.setItem(LSKEY_PHONEGAPPLOGINS, JSON.stringify(this.phonegappLogins));
  };
}