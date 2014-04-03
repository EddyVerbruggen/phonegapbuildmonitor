"use strict";

function AppController() {

  this.loadApps = function(phonegappLogin, callback, errorCallback) {
    PhonegapBuildApiProxy.doGET('apps', phonegappLogin, callback, errorCallback);
  };

  this.getAppDetails = function(phonegappLogin, appid, callback) {
    PhonegapBuildApiProxy.doGET('apps/'+appid, phonegappLogin, callback);
  };

  this.buildFromRepo = function(phonegappLogin, appid, callback) {
    var data = 'data=' + encodeURIComponent('{"pull":"true"}');
    PhonegapBuildApiProxy.doPUT('apps/'+appid, data, phonegappLogin, callback);
  };

  this.buildWithSigningKey = function(phonegappLogin, appid, signingKeyID, certPassword, keystorePassword, doPull, callback, errorCallback) {
    var pullOption = doPull == 'true' ? ', "pull":"true"' : '';
    var dataToEncode;
    // TODO set to no signing key (for Android at least), but no idea how (setting to null doesn't seem to work)...
    if (signingKeyID == "") {
      dataToEncode = '{'+this._getPullOption(doPull, true)+'}';
    } else if (certPassword == null || certPassword == "") {
      dataToEncode = '{"keys":{"'+getPlatformName()+'":{"id":'+signingKeyID+'}}'+this._getPullOption(doPull, false)+'}';
    } else {
      if (isAndroid()) {
        dataToEncode = '{"keys":{"'+getPlatformName()+'":{"id":'+signingKeyID+', "key_pw":"'+certPassword+'", "keystore_pw":"'+keystorePassword+'"}}'+this._getPullOption(doPull, false)+'}';
      } else {
        dataToEncode = '{"keys":{"'+getPlatformName()+'":{"id":'+signingKeyID+', "password":"'+certPassword+'"}}'+this._getPullOption(doPull, false)+'}';
      }
    }
    var data = 'data=' + encodeURIComponent(dataToEncode);
    PhonegapBuildApiProxy.doPUT('apps/'+appid, data, phonegappLogin, callback, errorCallback);
  };

  this._getPullOption = function(doPull, isOnlyOption) {
    return doPull == 'true' ? ((isOnlyOption ? '' : ', ') + '"pull":"true"') : '';
  };

  this.getSigningKeys = function(phonegappLogin, platform, callback) {
    PhonegapBuildApiProxy.doGET('keys/'+platform, phonegappLogin, callback);
  };

  this.getBuildStatus = function(app, platform) {
    return eval('app.status.'+platform);
  };

  this.getBuildError = function(app) {
    return eval('app.error.'+getPlatformName());
  };

  this.getDownloadLink = function(app, phonegappLogin, platform) {
    if (platform == 'ios') {
      // use username/pwd if we have it, because that prolly works better for multi-account usage
      if (phonegappLogin.password != null && phonegappLogin.password != "") {
        var url = 'https://'+encodeURIComponent(phonegappLogin.email)+':'+encodeURIComponent(phonegappLogin.password)+'@build.phonegap.com/'+PhonegapBuildApiProxy.getApiVersion()+'apps/'+app.id+'/'+platform;
        alert(url);
        return url;
      } else {
        return 'https://build.phonegap.com/apps/'+app.id+'/download/'+platform+'?auth_token='+phonegappLogin.token;
      }
    } else if (platform == 'android') {
      return 'https://build.phonegap.com/'+PhonegapBuildApiProxy.getApiVersion()+'apps/'+app.id+'/'+platform +'?auth_token='+phonegappLogin.token;
    } else {
      console.log("Please notify the admin, as we've encountered an unsupported platform.");
      return null;
    }
  };

  this.getShareLink = function(app, platform) {
    return 'https://build.phonegap.com/apps/'+app.id+'/download/'+platform;
  };
}