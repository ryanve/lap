(function(root, name, make) {
  if (typeof module != 'undefined' && module.exports) module.exports = make();
  else root[name] = make();
}(this, 'lap', function() {
  var api = {}, slice = [].slice;

  /**
   * @param {string} name
   * @param {Function} fn
   */
  function expose(name, fn) {
    fn['sync'] = fn;
    fn['async'] = async;
    api[name] = fn;
  }
  
  /** 
   * @this {Function} sync function to run async
   */
  function async() {
    var fn = this, args = slice.call(arguments), cb = args.pop();
    setTimeout(function() {
      var err, result;
      try {
        result = fn.apply(api, args);
      } catch (e) { 
        err = e; 
      }
      cb.call(api, err, result);
    }, 0);
  }

  /**
   * @param {{length:number}} racers
   * @param {Function} fn
   * @param {number} laps
   */
  function map(racers, fn, laps) {
    for (var r = [], l = racers.length, i = 0; i < l;) r[i] = fn.call(api, laps, racers[i++]);
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
  * @param {number} laps
  * @param {Function} fn
  * @return {number} milliseconds for `fn` to run `laps` times
  */
  expose('time', function(laps, fn) {
    var i = 0, start = api['timestamp']();
    while (i++ < laps) fn.call(api);
    return api['timestamp']()-start;
  });

  /**
  * @param {Function} fn
  * @return {number} operations per second
  */
  expose('speed', function(laps, fn) {
    return 1000*laps/api['time'](laps, fn);
  });

  /**
  * @param {number} laps
  * @param {Array} racers
  * @return {Array} map of times
  */
  expose('race', function(laps, racers) {
    return map(racers, api['time'], laps);
  });

  /**
  * @param {number} laps
  * @param {Array} racers
  * @return {Array} map of speeds
  */
  expose('rate', function(laps, racers) {
    return map(racers, api['speed'], laps);
  });
  
  return api;
}));