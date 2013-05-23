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
  return this._doApiCall('GET', this.getApiVersion() + service, null, phonegappLogin, onSuccessCallback);
};

PhonegapBuildApiProxy.doPOST = function (service, data, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('POST', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback);
};

PhonegapBuildApiProxy.doPUT = function (service, data, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('PUT', this.getApiVersion() + service, data, phonegappLogin, onSuccessCallback);
};

PhonegapBuildApiProxy.getToken = function (phonegappLogin, onSuccessCallback) {
  return this._doApiCall('POST', "token", null, phonegappLogin, onSuccessCallback);
};

PhonegapBuildApiProxy._doApiCall = function (type, service, data, phonegappLogin, onSuccessCallback) {
  var headers = {};
  if (!phonegappLogin.isTokenLogin()) {
    headers = {"Authorization": "Basic " + btoa(phonegappLogin.email + ":" + phonegappLogin.password) };
  }
  $.ajax({
    type: type,
    data: data,
    url: this.getEndpoint() + service + (phonegappLogin.isTokenLogin() ? "?auth_token=" + phonegappLogin.token : ""),
    headers: headers,
    timeout: 10000,
    async: false,
    statusCode: {
      401: function() {alert("status 401")},
      0: function() {alert("status 0")}
    },
    success: function (data) {
      if (onSuccessCallback != null) {
        onSuccessCallback(phonegappLogin, data);
      } else {
        alert("TODO implement callback for this data: " + JSON.stringify(data));
      }
    },
    error: function (xhr) {
      alert("Error :( \n\n" + JSON.stringify(xhr));
    }
  });
};