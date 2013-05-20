"use strict";

function PhonegapBuildApiProxy() {
}

PhonegapBuildApiProxy.getEndpoint = function () {
  return "https://build.phonegap.com/api/v1/";
};

PhonegapBuildApiProxy.doGET = function (service, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('GET', service, null, phonegappLogin, onSuccessCallback);
};

PhonegapBuildApiProxy.doPOST = function (service, data, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('POST', service, data, phonegappLogin, onSuccessCallback);
};

PhonegapBuildApiProxy.doPUT = function (service, data, phonegappLogin, onSuccessCallback) {
  return this._doApiCall('PUT', service, data, phonegappLogin, onSuccessCallback);
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
    dataType: 'json',
    statusCode: {
      302: function() {alert(302)}
    },
    success: function (data) {
      if (onSuccessCallback != null) {
        onSuccessCallback(phonegappLogin, data);
      } else {
        alert("TODO implement callback for this data: " + JSON.stringify(data));
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("XMLHttpRequest:" + XMLHttpRequest + ", Status: " + textStatus + ", error: " + errorThrown);
    }
  });
};

PhonegapBuildApiProxy.loadWithRedirect = function (service, phonegappLogin) {
  var headers = {};
  if (!phonegappLogin.isTokenLogin()) {
    headers = {"Authorization": "Basic " + btoa(phonegappLogin.email + ":" + phonegappLogin.password) };
  }
  $.ajax({
    type: 'GET',
    url: this.getEndpoint() + service + (phonegappLogin.isTokenLogin() ? "?auth_token=" + phonegappLogin.token : ""),
    headers: headers,
    statusCode: {
      302: function() {alert(302)}
    },
//    dataType: 'json',
    success: function (data) {
      alert("TODO implement callback for this data: " + JSON.stringify(data));
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("XMLHttpRequest:" + XMLHttpRequest + ", Status: " + textStatus + ", error: " + errorThrown);
    }
  });
};
