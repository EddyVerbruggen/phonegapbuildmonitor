"use strict";

function PhonegapBuildApiProxy() {
}

PhonegapBuildApiProxy.getEndpoint = function () {
  return "https://build.phonegap.com/api/v1/";
};

PhonegapBuildApiProxy.doGET = function (service, username, password, token, onSuccessCallback) {
  return this._doApiCall('GET', service, null, username, password, token, onSuccessCallback);
};

PhonegapBuildApiProxy.doPOST = function (service, data, username, password, token, onSuccessCallback) {
  return this._doApiCall('POST', service, data, username, password, token, onSuccessCallback);
};

PhonegapBuildApiProxy.doPUT = function (service, data, username, password, token, onSuccessCallback) {
  return this._doApiCall('PUT', service, data, username, password, token, onSuccessCallback);
};

PhonegapBuildApiProxy._doApiCall = function (type, service, data, username, password, token, onSuccessCallback) {
  var headers = {};
  if (username != null && username != "") {
    headers = {"Authorization": "Basic " + btoa(username + ":" + password) };
  }
  $.ajax({
    type: type,
    data: data,
    url: this.getEndpoint() + service + (token == null || token == "" ? "" : "?auth_token=" + token),
    headers: headers,
    dataType: 'json',
    success: function (data) {
      if (onSuccessCallback != null) {
        onSuccessCallback(data);
      } else {
        alert("TODO implement callback for this data: " + JSON.stringify(data));
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("XMLHttpRequest:" + XMLHttpRequest + ", Status: " + textStatus + ", error: " + errorThrown);
    }
  });
};