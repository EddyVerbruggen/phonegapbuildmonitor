"use strict";

function PhonegapBuildApiProxy() {
}

PhonegapBuildApiProxy.getEndpoint = function () {
  return "https://build.phonegap.com/";
};

PhonegapBuildApiProxy.getApiVersion = function () {
  return "api/v1/";
};

PhonegapBuildApiProxy.doGET = function (service, phonegappLogin, onSuccessCallback, onErrorCallback) {
  return this._doApiCall('GET', this.getApiVersion() + service, null, phonegappLogin, onSuccessCallback, onErrorCallback, true);
};

PhonegapBuildApiProxy.loginUsernamePassword = function (phonegappLogin, onSuccessCallback) {
  return this._doApiCall('GET', this.getApiVersion() + 'me', null, phonegappLogin, onSuccessCallback, null, false);
};

PhonegapBuildApiProxy.getToken = function (phonegappLogin, onSuccessCallback) {
  return this._doApiCall('POST', "token", null, phonegappLogin, onSuccessCallback, null, false);
};

PhonegapBuildApiProxy.doPOST = function (service, data, phonegappLogin, onSuccessCallback, onErrorCallback) {
  return this._doApiCall('POST', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback, onErrorCallback, true);
};

PhonegapBuildApiProxy.doPUT = function (service, data, phonegappLogin, onSuccessCallback, onErrorCallback) {
  return this._doApiCall('PUT', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback, onErrorCallback, true);
};

PhonegapBuildApiProxy._doApiCall = function (type, service, data, phonegappLogin, onSuccessCallback, onErrorCallback, async) {
  var headers = {};
  if (!phonegappLogin.isTokenLogin()) {
    headers = {"Authorization": "Basic " + btoa(phonegappLogin.email + ":" + phonegappLogin.password) };
  }
  $.ajax({
    type: type,
    data: data,
    url: this.getEndpoint() + service + (phonegappLogin.isTokenLogin() ? "?auth_token=" + phonegappLogin.token : ""),
    headers: headers,
    async: async, // basic auth errors can't be displayed in phonegap without this, so only use async for sign in usecases
    success: function (data) {
      if (onSuccessCallback != null) {
        onSuccessCallback(phonegappLogin, data);
      } else {
        alert("TODO implement callback for this data: " + JSON.stringify(data));
      }
    },
    error: function (xhr) {
      if (xhr.status = 401 && !async) {
        showAlert("Authentication failed", "Please change your sign in credentials");
//      } else if (xhr.statusText != null && xhr.statusText.indexOf("Service Unavailable")>-1) {
      } else if (xhr.statusText != null && xhr.statusText.indexOf("Service Unavailable")>-1) {
        showAlert("PhoneGap Build is down", "build.phonegap.com seems to be down, so this app stops working as well.. we'll retry automatically in a minute!");
      } else {
        alert("Error :( \n\n" + JSON.stringify(xhr));
      }
      if (onErrorCallback != null) {
        onErrorCallback(phonegappLogin);
      }
    }
  });
};