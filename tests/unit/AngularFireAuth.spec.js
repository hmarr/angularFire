
describe("AngularFireAuth", function() {
  //constants
  var existingUser = {
    email: "email@firebase.com",
    password: "aaaaaaaa"
  }
  var newUserInf = {
    email: "a" + Math.round(Math.random()*10000000000) + "@email.com",
    password: "Pw",
    newPW: "sdljf"
  };

  //globals
  var $firebase;
  var $firebaseSimpleLogin;
  var $timeout;
  var $rootScope;
  var ngFireRef;
  var ngSimpleLogin;
  var $q;

  beforeEach(module('firebase'));
  beforeEach(inject(function(_$firebase_, _$firebaseSimpleLogin_, _$timeout_, _$rootScope_, _$q_) {
    $firebase = _$firebase_;
    $firebaseSimpleLogin = _$firebaseSimpleLogin_;
    $timeout = _$timeout_;
    $rootScope = _$rootScope_;
    $q = _$q_;
    var ref = new Firebase("Auth://");
    ngFireRef = $firebase(ref);
    ngSimpleLogin = $firebaseSimpleLogin(ref);
  }));

  describe('$login', function() {
    it('should reject promise if auth fails');

    it('should resolve promise on success');

    it('should return (what exactly??)');

    it('should do what on a bad provider??');

    it('should work with email provider');

    it('should work with oauth provider');

    it('should trigger $firebaseSimpleLogin:login event');
  });

  describe('$getUserInfo', function() {
    it('should initially be null');

    it('should trigger promise');

    it('should return user when resolved');

    it('should reject promise on failure');

    it('should return user if already logged in');
  });

  describe('$logout', function() {
    it('should call FirebaseSimpleLogin.logout()');

    it('should set current user to null');

    it('should trigger $firebaseSimpleLogin:logout event');
  });

  describe('$createUser', function() {
    it('should call FirebaseSimpleLogin.createUser()');

    it('should resolve promise on success');

    it('should reject promise on failure');

    it('should reject promise if account already exists');
  });

  describe('$changePassword', function() {
    it('should call FirebaseSimpleLogin.changePassword()');

    it('should resolve promise on success');

    it('should reject promise on failure');

    it('should reject promise if bad oldPassword');

    it('should reject promise if bad email address');
  });

  describe('$sendPasswordResetEmail', function() {
    it('should call FirebaseSimpleLogin.sendPasswordResetEmail()');

    it('should resolve promise on success');

    it('should reject promise on failure');

    it('should reject promise on bad email address');
  });

  describe('$removeUser', function() {
    it('should call FirebaseSimpleLogin.removeUser()');

    it('should resolve promise on success');

    it('should reject promise on failure');

    it('should reject promise on bad email address');

    it('should reject promise on bad password');
  });

  function flush() {
     Array.prototype.slice.call(arguments, 0).forEach(function(arg) {
       arg.flush();
     });
    try { $timeout.flush(); }
    catch(e) {}
    try { $q.flush(); }
    catch(e) {}
  }

});
