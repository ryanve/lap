/*!
 * lap 0.2.5+201403111908
 * https://github.com/ryanve/lap
 * MIT License (c) 2014 Ryan Van Etten
 */

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
    fn['sync'] = api[name] = fn;
    fn['async'] = async;
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
   * @param {Array|Function} o
   * @param {Function} fn
   * @param {number} laps
   * @return {Array}
   */
  function map(o, fn, laps) {
    if (typeof o == 'function') return [fn(laps, o)];
    for (var r = [], i = 0, l = o.length; i < l;) r[i] = fn(laps, o[i++]);
    return r;
  }

  /**
   * @param {number} laps
   * @param {number} ms duration in milliseconds
   * @return {number} laps/second
   */
  function rate(laps, ms) {
    return 1000*laps/ms;
  }

  /**
   * @param {number} laps
   * @param {Function} racer
   * @return {number} time (milliseconds) for `racer` to run `laps` times
   */
  function time(laps, racer) {
    for (var i = 0, stamp = api['timestamp'], start = stamp(); i++ < laps;) racer.call(api);
    return stamp() - start;
  }
  
  /**
   * @param {number} laps
   * @param {Array|Function} racers
   * @return {Array} times (milliseconds) for each racer to run `laps` times
   */
  expose('time', function(laps, racers) {
    return map(racers, time, laps);
  });

  /**
   * @param {number} laps
   * @param {Array|Function} racers
   * @return {Array} speeds (operations/second) for each racer to run `laps` times
   */
  expose('speed', function(laps, racers) {
    return map(api['time'](laps, racers), rate, laps);
  });

  /**
   * @return {number} hi-res timestamp in milliseconds
   */
  expose('timestamp', typeof performance != 'undefined' && performance.now ? function() {
    return performance.now();
  } : typeof process != 'undefined' && process.hrtime ? function() {
    var a = process.hrtime(); // [seconds, nanoseconds]
    return 1e3*a[0] + a[1]/1e6;
  } : Date.now ? function() {
    return Date.now();
  } : function() {
    return (new Date).getTime();
  });

  return api;
}));