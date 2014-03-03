(function(root, name, make) {
  if (typeof module != 'undefined' && module.exports) module.exports = make();
  else root[name] = make();
}(this, 'racer', function() {
  var racer = {};

  function map(rivals, fn, trials) {
    for (var r = [], l = rivals.length, i = 0; i < l;) r[i] = fn.call(racer, trials, rivals[i++]);
    return r;
  }

  /**
  * @return {number} hi-res timestamp in milliseconds
  */
  racer['timestamp'] = typeof performance != 'undefined' && performance.now ? function() {
    return performance.now();
  } : typeof process != 'undefined' && process.hrtime ? function() {
      var a = process.hrtime(); // [seconds, nanoseconds]
      return 1e3*a[0] + a[1]/1e6;
  } : Date.now || function() {
    return +new Date;
  };

  /**
  * @param {number} trials
  * @param {Function} fn
  * @return {number} milliseconds for `fn` to run `trials` times
  */
  racer['time'] = function(trials, fn) {
    var i = 0, start = racer['timestamp']();
    while (i++ < trials) fn.call(racer);
    return racer['timestamp']()-start;
  };

  /**
  * @param {Function} fn
  * @return {number} operations per second
  */
  racer['speed'] = function(trials, fn) {
    return 1000*trials/racer['time'](trials, fn);
  };

  /**
  * @param {number} trials
  * @param {Array} rivals
  * @return {Array} map of times
  */
  racer['race'] = function(trials, rivals) {
    return map(rivals, racer['time'], trials);
  };

  /**
  * @param {number} trials
  * @param {Array} rivals
  * @return {Array} map of speeds
  */
  racer['rate'] = function(trials, rivals) {
    return map(rivals, racer['speed'], trials);
  };
  
  return racer;
}));