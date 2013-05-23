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
    statusCode: {
      401: function() {alert(401)}
    },
//    dataType: 'json',
    success: function (data) {
      if (onSuccessCallback != null) {
        onSuccessCallback(phonegappLogin, data);
      } else {
        alert("TODO implement callback for this data: " + JSON.stringify(data));
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("XMLHttpRequest:" + JSON.stringify(XMLHttpRequest) + ", Status: " + textStatus + ", errorThrown: " + errorThrown);
    }
  });
};