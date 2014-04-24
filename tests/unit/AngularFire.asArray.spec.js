describe('AngularFire.$asArray', function() {
  var $firebase, $filter, $timeout, $q, fbRef, COUNTER=0;
  beforeEach(module('firebase'));
  beforeEach(inject(function (_$firebase_, _$filter_, _$timeout_, _$q_) {
    $firebase = _$firebase_;
    $filter = _$filter_;
    $timeout = _$timeout_;
    $q = _$q_;
    fbRef = new Firebase('Array'+(COUNTER++)+'://').child('data');
  }));

  describe('$indexOf', function() {
    it('should return correct index', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      var i = arr.length;
      // need more than 2 elements to test this properly
      expect(i).toBeGreaterThan(2);
      while(i--) {
        var k = arr[i].$id;
        expect(arr.$indexOf(k)).toBe(i);
      }
    });

    it('should return -1 for missing key', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      var i = arr.length;
      // need more than zero elements to test this properly
      expect(i).toBeGreaterThan(0);
      expect(arr.$indexOf('notavalidkey')).toBe(-1);
    });
  });

  describe('$add', function() {
    it('should add record to $firebase', function() {
      var ref = $firebase(fbRef);
      var arr = ref.$asArray();
      flush();
      var key = arr.$add({foo: 'bar'}).name();
      expect(ref[key]).toBeUndefined();
      flush();
      expect(ref[key]).toBeDefined();
    });
  });

  describe('$remove', function() {
    it('should remove record from $firebase', function() {
      var ref = $firebase(fbRef);
      var arr = ref.$asArray();
      flush();
      var len = ref.$getIndex().length;
      expect(len).toBeGreaterThan(1); // need 2 or more for this test
      expect(len).toEqual(arr.length);
      arr.$remove(arr[0].$id);
      flush();
      var newLen = ref.$getIndex().length;
      expect(newLen).toEqual(len-1);
      expect(arr.length).toEqual(newLen);
    })
  });

  describe('$update', function() {
    it('should update record in $firebase', function() {
      var ref = $firebase(fbRef);
      var arr = ref.$asArray();
      flush();
      var key = arr[0].$id;
      var dat = arr[0];
      expect(ref[key].aNumber).toEqual(dat.aNumber);
      var newCount = dat.aNumber+1;
      arr.$update(key, {aNumber: newCount});
      flush();
      expect(ref[key].aNumber).toEqual(newCount);
      expect(arr[0].aNumber).toEqual(newCount);
    });
  });

  describe('$move', function() {
    it('should set $priority in $firebase child', function() {
      fbRef.set({
        alpha: {'.priority': 200, foo: 'alpha'},
        bravo: {'.priority': 300, foo: 'bravo'},
        charlie: {'.priority': 100, foo: 'charlie'}
      });
      fbRef.flush();
      var ref = $firebase(fbRef);
      var arr = ref.$asArray();
      flush();
      expect(arr[0].$id).toEqual('charlie');
      expect(ref['charlie'].$priority).toEqual(100);
      arr.$move('charlie', 250);
      flush();
      expect(arr[0].$id).toEqual('alpha');
      expect(ref['charlie'].$priority).toEqual(250);
    });
  });

  describe('$firebase', function() {
    it('should point to the original $firebase instance', function() {
      var $fb = $firebase(fbRef);
      var arr = $fb.$asArray();
      expect(arr.$firebase).toBe($fb);
    });
  });

  describe('sync behaviors', function() {
    it('should add locally if added on server', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      var length = arr.length;
      expect(length).toBeGreaterThan(0);
      fbRef.push({foo: 'bar'});
      expect(arr.length).toEqual(length+1);
    });

    it('should remove locally if removed on server', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      var length = arr.length;
      expect(length).toBeGreaterThan(0);
      fbRef.child('a').remove();
      expect(arr.length).toEqual(length-1);
    });

    it('should update locally if updated at server', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      var dat = fbRef.getData().a;
      dat.extra = 'extra';
      expect(arr.$indexOf('a')).toBeGreaterThan(-1);
      fbRef.child('a').set(dat);
      expect(arr[arr.$indexOf('a')].extra).toEqual('extra');
    });

    it('should update even if array is resorted', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      var dat = fbRef.getData().a;
      dat.extra = 'extra';
      expect(arr.$indexOf('a')).toBe(0);
      expect(arr.length).toBeGreaterThan(1);
      arr.push(arr.shift());
      fbRef.child('a').set(dat);
      expect(arr.$indexOf('a')).toBe(arr.length-1);
      expect(arr[arr.length-1].extra).toEqual('extra');
    });

    it('should not recreate record if removed locally and updated at server', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      var dat = fbRef.getData().a;
      dat.extra = 'extra';
      expect(arr.$indexOf('a')).toBe(0);
      arr.shift();
      fbRef.child('a').set(dat);
      expect(arr.$indexOf('a')).toBe(-1);
    });

    it('should return a zero-length array if server data is null', function() {
      var ref = fbRef.child('notakey').autoFlush();
      var arr = $firebase(ref).$asArray();
      expect(arr.length).toBe(0);
      ref.push({hello: 'world'});
      expect(arr.length).toBe(1);
    });

    it('should survive deletion and restore at the server', function() {
      var arr = $firebase(fbRef.autoFlush()).$asArray();
      expect(arr.length).toBeGreaterThan(0);
      fbRef.remove();
      expect(arr.length).toBe(0);
      fbRef.set({foo: 'bar'});
      expect(arr.length).toBe(1);
    });
  });

  function flush() {
    Array.prototype.slice.call(arguments, 0).forEach(function(arg) {
      arg.flush();
    });
    fbRef.flush();
    try { $timeout.flush(); }
    catch(e) {}
    try { $q.flush(); }
    catch(e) {}
  }

});