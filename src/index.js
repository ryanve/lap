(function(root, name, make) {
  if (typeof module != 'undefined' && module.exports) module.exports = make();
  else root[name] = make();
}(this, 'racer', function() {
  var racer = {}, slice = [].slice;

  /**
   * @param {string} name
   * @param {Function} fn
   */
  function expose(name, fn) {
    fn['sync'] = fn;
    fn['async'] = async;
    racer[name] = fn;
  }
  
  /** 
   * @this {Function} sync function to run async
   */
  function async() {
    var fn = this, args = slice.call(arguments), cb = args.pop();
    setTimeout(function() {
      var err, result;
      try {
        result = fn.apply(racer, args);
      } catch (e) { 
        err = e; 
      }
      cb.call(racer, err, result);
    }, 0);
  }

  /**
   * @param {{length:number}} rivals
   * @param {Function} fn
   * @param {number} trials
   */
  function map(rivals, fn, trials) {
    for (var r = [], l = rivals.length, i = 0; i < l;) r[i] = fn.call(racer, trials, rivals[i++]);
    return r;
  }

  /**
  * @return {number} hi-res timestamp in milliseconds
  */
  expose('timestamp', typeof performance != 'undefined' && performance.now ? function() {
    return performance.now();
  } : typeof process != 'undefined' && process.hrtime ? function() {
      var a = process.hrtime(); // [seconds, nanoseconds]
      return 1e3*a[0] + a[1]/1e6;
  } : Date.now || function() {
    return +new Date;
  });

  /**
  * @param {number} trials
  * @param {Function} fn
  * @return {number} milliseconds for `fn` to run `trials` times
  */
  expose('time', function(trials, fn) {
    var i = 0, start = racer['timestamp']();
    while (i++ < trials) fn.call(racer);
    return racer['timestamp']()-start;
  });

  /**
  * @param {Function} fn
  * @return {number} operations per second
  */
  expose('speed', function(trials, fn) {
    return 1000*trials/racer['time'](trials, fn);
  });

  /**
  * @param {number} trials
  * @param {Array} rivals
  * @return {Array} map of times
  */
  expose('race', function(trials, rivals) {
    return map(rivals, racer['time'], trials);
  });

  /**
  * @param {number} trials
  * @param {Array} rivals
  * @return {Array} map of speeds
  */
  expose('rate', function(trials, rivals) {
    return map(rivals, racer['speed'], trials);
  });
  
  return racer;
}));