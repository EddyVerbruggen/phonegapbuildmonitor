"use strict";

function PhonegapBuildApiProxy() {
}

PhonegapBuildApiProxy.getEndpoint = function () {
  return "https://build.phonegap.com/api/v1/";
};

PhonegapBuildApiProxy.doGET = function (service, username, password, token, onSuccessCallback) {
  return this._doApiCall('GET', service, username, password, token, onSuccessCallback);
};

PhonegapBuildApiProxy.doPOST = function (service, username, password, token, onSuccessCallback) {
  return this._doApiCall('POST', service, username, password, token, onSuccessCallback);
};

PhonegapBuildApiProxy._doApiCall = function (type, service, username, password, token, onSuccessCallback) {
  var headers = {};
  if (username != null && username != "") {
    headers = {"Authorization": "Basic " + btoa(username + ":" + password) };
  }
  $.ajax({
    type: type,
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