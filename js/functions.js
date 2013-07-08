// used to switch between iOS and Android for desktop development
var desktopIsAndroid = true;

window.onerror = function(message, file, line) {
//  alert('Error gevangen: ' + file + ':' + line + '\n' + JSON.stringify(message));
};

function isAndroid() {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1 ||
      (isDesktop() && desktopIsAndroid);
}

function isIOS() {
  return navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ||
      (isDesktop() && !desktopIsAndroid);
}

function isMobile() {
  return navigator.userAgent.match(/(iPad|iPhone|iPod)/i) || navigator.userAgent.toLowerCase().indexOf("android") > -1;
}

function isDesktop() {
  return !isMobile();
}

function getPlatformName() {
  return isAndroid() ? "android" : "ios";
}

function refresh() {
  window.location='index.html';
}

function openWindow(pleaseTakeMeHere) {
  window.open(pleaseTakeMeHere, '_system');
}

// TODO call when state changes from pending to install
function vibrate() {
  navigator.notification.vibrate(200);
}

function emptyCallback(e) {
}

function googleAnalytics(page) {
  if (gaPlugin !== undefined) {
    gaPlugin.trackPage(emptyCallback, emptyCallback, page);
  }
}

function showAlert(title, txt) {
  if (isMobile()) {
    navigator.notification.alert(txt, function(){}, title);
  } else {
    alert(title + "\n\n" + txt);
  }
}