"use strict";

function UserController() {

  var LSKEY_USERS = "UserController.users";

  this.users = [];

  this.loadUsers = function() {
    var loadedUsers = JSON.parse(localStorage.getItem(LSKEY_USERS));
    if (loadedUsers != null) {
      this.users = loadedUsers;
    }
  };

  this.signIn = function(email, password, token /* for example: Rt9jJoTxCgDBQrYfuHLk */) {
    if ((email == "" || password == "") && token == "") {
      alert("Please fill in one of the authentication options");
    } else {
      PhonegapBuildApiProxy.doGET('me', email, password, token, this.save);
    }
  };

  this.storeToken = function(token) {
    alert("TODO impl storeToken");
  };

  this.delete = function(user) {
    alert("TODO impl delete");
  };

  this.save = function(user) {
    // TODO check if already exists before storing
    userController.users.push(user);
    userController.persistUsers();
    alert("known users: (" + userController.users.length + "): " + JSON.stringify(userController.users));
  };

  this.persistUsers = function() {
    localStorage.setItem(LSKEY_USERS, JSON.stringify(this.users));
  };

  this._init = function() {
    this.loadUsers();
  };

  // call this 'private' method upon class construction
  this._init();
}