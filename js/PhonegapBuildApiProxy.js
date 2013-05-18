"use strict";

function PhonegapBuildApiProxy() {
}

PhonegapBuildApiProxy.getEndpoint = function () {
  return "https://build.phonegap.com/api/v1/";
};

PhonegapBuildApiProxy.doGET = function (service, username, password, token) {
  return this._doApiCall('GET', service, username, password, token);
};

PhonegapBuildApiProxy.doPOST = function (service, username, password, token) {
  return this._doApiCall('POST', service, username, password, token);
};

PhonegapBuildApiProxy._doApiCall = function (type, service, username, password, token) {
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
      alert(JSON.stringify(data));
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert("XMLHttpRequest:" + XMLHttpRequest + ", Status: " + textStatus + ", error: " + errorThrown);
    }
  });
};