"use strict";

function UserController() {

  var LSKEY_PHONEGAPPLOGINS = "UserController.phonegappLogins";
  var buildCheckIntervalMillis = isMobile() ? 10000 : 60000; // relax on the desktop

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

  this.loadAppsForUsers = function() {
    for (var i=0; i<userController.phonegappLogins.length; i++) {
      appController.loadApps(userController.getPhonegappLogin(userController.phonegappLogins[i].user.id), userController.onLoadAppsSuccess);
    }
  };

  this.onLoadAppsSuccess = function(phonegappLogin, data) {
    // store the apps for the user
    for (var i=0; i<userController.phonegappLogins.length; i++) {
      if (phonegappLogin.user.id == userController.phonegappLogins[i].user.id) {
        userController.phonegappLogins[i].apps = data.apps;
        userController.persistUsers();
        break;
      }
    }

    // TODO determined by nroftimes callback was received, NOT the element itself because the last one may come first
    var isLastCallback = phonegappLogin.user.id == userController.phonegappLogins[userController.phonegappLogins.length-1].user.id;

    if (isLastCallback) {
      // remove duplicate apps (shared between users)

      // remove duplicate apps we already know
      var knownApps = [];
      for (i=0; i<userController.phonegappLogins.length; i++) {
        for (var k=0; k<userController.phonegappLogins[i].apps.length; k++) {
          var appid = userController.phonegappLogins[i].apps[k].id;
          if (knownApps.indexOf(appid) == -1) {
            knownApps.push(appid);
          } else {
            userController.phonegappLogins[i].apps.splice(k, 1);
          }
        }
      }
      userController.persistUsers();

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
      alert("Please fill in one of the authentication options");
    } else {
      var phonegappLogin = new PhonegappLogin();
      phonegappLogin.email = email;
      phonegappLogin.password = password;
      phonegappLogin.token = token;
      PhonegapBuildApiProxy.doGET('me', phonegappLogin, this.onSignInSuccess);
    }
  };

  this.storeToken = function(token) {
    alert("TODO impl storeToken");
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

  // NOTE: this method is called async, so has no context of 'this'
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
    alert("save succeeded");
  };

  this.persistUsers = function() {
    localStorage.setItem(LSKEY_PHONEGAPPLOGINS, JSON.stringify(this.phonegappLogins));
  };
}