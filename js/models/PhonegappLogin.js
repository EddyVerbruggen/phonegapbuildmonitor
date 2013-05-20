"use strict";

function PhonegappLogin() {
  this.email = null;
  this.password = null;
  this.token = null;
  this.user = null; // this is what we get from APIcall /me, which contains an array: user.apps, which we ignore
  this.apps = null; // this is what we get from APIcall /apps

  this.createFromObj = function(obj) {
    this.email = obj.email;
    this.password = obj.password;
    this.token = obj.token;
    this.user = obj.user;
    this.apps = obj.apps;
    return this;
  };

  this.equals = function(phonegappLogin) {
    return this.token == phonegappLogin.token;
  };

  this.isTokenLogin = function() {
    return this.token != null && this.token != "";
  };
}