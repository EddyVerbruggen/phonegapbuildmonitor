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
      PhonegapBuildApiProxy.doGET('me', email, password, token, this.onMeSuccess);
    }
  };

  this.storeToken = function(token) {
    alert("TODO impl storeToken");
  };

  this.delete = function(user) {
    alert("TODO impl delete");
  };

  // NOTE: this method is called async, so has no context of 'this'
  this.onMeSuccess = function(user) {
    userController.save(user);
  };

  this.save = function(user) {
    this.users.push(user);
    this.persistUsers();
    alert("known users: (" + this.users.length + "): " + JSON.stringify(this.users));
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