"use strict";

function PhonegapBuildApiProxy() {
}

PhonegapBuildApiProxy.getEndpoint = function () {
  return "https://build.phonegap.com/";
};

PhonegapBuildApiProxy.getApiVersion = function () {
  return "api/v1/";
};

PhonegapBuildApiProxy.doGET = function (service, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('GET', this.getApiVersion() + service, null, phonegappLogin, onSuccessCallback, true);
};

PhonegapBuildApiProxy.loginUsernamePassword = function (phonegappLogin, onSuccessCallback) {
  return this._doApiCall('GET', this.getApiVersion() + 'me', null, phonegappLogin, onSuccessCallback, false);
};

PhonegapBuildApiProxy.getToken = function (phonegappLogin, onSuccessCallback) {
  return this._doApiCall('POST', "token", null, phonegappLogin, onSuccessCallback, false);
};

PhonegapBuildApiProxy.doPOST = function (service, data, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('POST', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback, true);
};

PhonegapBuildApiProxy.doPUT = function (service, data, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('PUT', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback, true);
};

PhonegapBuildApiProxy._doApiCall = function (type, service, data, phonegappLogin, onSuccessCallback, async) {
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
      if (xhr.status = 401) {
        showAlert("Authentication failed", "Please change your sign in credentials");
      } else {
        alert("Error :( \n\n" + JSON.stringify(xhr));
      }
    }
  });
};