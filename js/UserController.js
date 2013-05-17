function UserController() {

  var LSKEY_USERS = "UserController.users";

  this.users = [];

  this.loadUsers = function() {
    var loadedUsers = JSON.parse(localStorage.getItem(LSKEY_USERS));
    if (loadedUsers != null) {
      this.users = loadedUsers;
    }
  };

  this.signIn = function(username, password) {
    alert("TODO impl signIn");
    var xml = new XMLHttpRequest();
    $.ajax({
      type : 'POST',
      url : 'https://build.phonegap.com/token',
      dataType : 'json',
      headers : {"Authorization" : "Basic " + btoa(username + ":" + password) },
      success : function(data) {
        alert(data);
      },
      error : function(XMLHttpRequest, textStatus, errorThrown) {
        alert("XMLHttpRequest:" + XMLHttpRequest + ", Status: " + textStatus + ", error: " + errorThrown);
      }
    });
  };

  this.storeToken = function(token) {
    alert("TODO impl storeToken");
  };

  this.delete = function(user) {
    alert("TODO impl delete");
  };

  this._saveUsers = function() {
    localStorage.setItem(LSKEY_USERS, JSON.stringify(this.users));
  };

  this._init = function() {
    alert("init userController");
    this.loadUsers();
  };

  // call this 'private' method upon class construction
  this._init();
}