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
  * @param {Array|Function} racers
  * @return {Array} milliseconds for each racer to run `laps` times
  */
  expose('time', function(laps, racers) {
    if (typeof racers == 'function') racers = [racers];
    var start, end, f, n, r = [], i = 0, l = racers.length, stamp = api['timestamp'];
    for (start = end || stamp(); i < l; end = stamp(), r[i++] = end - start) {
      for (f = racers[i], n = 0; n++ < laps;) {
        f.call(api);
      }
    }
    return r;
  });

  /**
   * @param {number} laps
   * @param {Array|Function} racers
   * @return {number} operations per second
   */
  expose('speed', function(laps, racers) {
    for (var r = api['time'](laps, racers), i = r.length; i--;) r[i] = 1000*laps/r[i];
    return r;
  });
  
  
  api['race'] = api['time'];
  api['rate'] = api['speed'];
  return api;
}));