"use strict";

function UserController() {

  var LSKEY_PHONEGAPPLOGINS = "UserController.phonegappLogins";

  // an array of PhonegapLogin, stored in LS which also holds the API user and user.apps
  this.phonegappLogins = [];

  this.loadUsers = function() {
    var loadedUsers = JSON.parse(localStorage.getItem(LSKEY_PHONEGAPPLOGINS));
    if (loadedUsers != null) {
      this.phonegappLogins = loadedUsers;
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
  };

  this.save = function(phonegappLogin) {
    var existingUser = false;
    for (var i=0; i<this.phonegappLogins.length; i++) {
      // TODO this.phonegappLogins[i] is not an object
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
    alert("known users: (" + this.phonegappLogins.length + "): " + JSON.stringify(this.phonegappLogins));
  };

  this.persistUsers = function() {
    localStorage.setItem(LSKEY_PHONEGAPPLOGINS, JSON.stringify(this.phonegappLogins));
  };

  this._init = function() {
    this.loadUsers();
  };

  // call this 'private' method upon class construction
  this._init();
}