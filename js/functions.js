window.onerror = function(message, file, line) {
  alert('Error gevangen: ' + file + ':' + line + '\n' + JSON.stringify(message));
};

function isAndroid() {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

function isIOS() {
  return navigator.userAgent.match(/(iPad|iPhone|iPod)/i);
}

function isMobile() {
  return isIOS() || isAndroid();
}

function getPlatformName() {
  return isAndroid() ? "android" : "ios";
}

function openWindow(pleaseTakeMeHere) {
  window.open(pleaseTakeMeHere, '_system');
}

function openChildBrowser(pleaseTakeMeHere) {
  window.plugins.childBrowser.showWebPage(pleaseTakeMeHere, {showAddressBar: false, showLocationBar: false, showNavigationBar: false});
}

function showAlert(title, txt) {
  if (isMobile()) {
    navigator.notification.alert(txt, function(){}, title);
  } else {
    alert(txt);
  }
}