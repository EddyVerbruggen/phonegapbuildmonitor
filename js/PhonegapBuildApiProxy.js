"use strict";

// while signing in, don't allow other ajax calls (errorneous)
var signInInProgress = false;

function PhonegapBuildApiProxy() {
}

PhonegapBuildApiProxy.getEndpoint = function () {
  return "https://build.phonegap.com/";
};

PhonegapBuildApiProxy.getApiVersion = function () {
  return "api/v1/";
};

PhonegapBuildApiProxy.doGET = function (service, phonegappLogin, onSuccessCallback, onErrorCallback) {
  return this._doApiCall('GET', this.getApiVersion() + service, null, phonegappLogin, onSuccessCallback, onErrorCallback);
};

PhonegapBuildApiProxy.getToken = function (phonegappLogin, onSuccessCallback) {
  //noinspection JSUnusedAssignment
  signInInProgress = true;
  this._doApiCall('POST', "token", null, phonegappLogin, onSuccessCallback, null);
  signInInProgress = false;
};

PhonegapBuildApiProxy.doPOST = function (service, data, phonegappLogin, onSuccessCallback, onErrorCallback) {
  return this._doApiCall('POST', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback, onErrorCallback);
};

PhonegapBuildApiProxy.doPUT = function (service, data, phonegappLogin, onSuccessCallback, onErrorCallback) {
  return this._doApiCall('PUT', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback, onErrorCallback);
};

PhonegapBuildApiProxy._doApiCall = function (type, service, data, phonegappLogin, onSuccessCallback, onErrorCallback) {
  var headers = {};
  if (!phonegappLogin.isTokenLogin()) {
    headers = {"Authorization": "Basic " + btoa(phonegappLogin.email + ":" + phonegappLogin.password) };
  }
  $.ajax({
    type: type,
    data: data,
    url: this.getEndpoint() + service + (phonegappLogin.isTokenLogin() ? "?auth_token=" + phonegappLogin.token : ""),
    headers: headers,
    async: !signInInProgress, // basic auth errors can't be displayed in phonegap without this, so only use async for sign in usecases
    success: function (data) {
      if (onSuccessCallback != null) {
        onSuccessCallback(phonegappLogin, data);
      } else {
        console.log("TODO implement callback for this data: " + JSON.stringify(data));
      }
    },
    error: function (xhr) {
      if (xhr.status = 401 && signInInProgress) {
        showAlert("Authentication failed", "Invalid credentials.. try again!");
      } else if (xhr.statusText != null && xhr.statusText.indexOf("Service Unavailable")>-1) {
        showAlert("PhoneGap Build is down", "build.phonegap.com seems to be down, so this app stops working as well.. we'll retry automatically in a minute!");
      } else if (xhr.responseText != null && xhr.responseText.indexOf("something went wrong (500)")>-1) {
        showAlert("PhoneGap Build error", "PhoneGap Build had a little error, they have been notified. Please try again later.");
      } else if (xhr.responseText != null && xhr.responseText.indexOf("unable to clone")>-1) {
        showAlert("Unable to clone repo", "PhoneGap Build had a little error, please try again in a moment!");
      } else if (onErrorCallback != null) {
        onErrorCallback(phonegappLogin, xhr);
      } else {
        showAlert("Error for API service " + service + ", details: " + JSON.stringify(xhr));
      }
    }
  });
};