"use strict";

function PhonegappLogin() {
  this.email = null;
  this.password = null;
  this.token = null;
  this.user = null; // this is what we get from the API, which contains an array: user.apps

  this.equals = function(phonegappLogin) {
    if (this.email == null) {
      return this.token == phonegappLogin.token;
    } else {
      return this.email == phonegappLogin.email;
    }
  };

  this.isTokenLogin = function() {
    return this.token != null && this.token != "";
  };
}