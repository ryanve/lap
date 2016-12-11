!function(root) {
  var aok = require('aok');
  var lap = typeof window == 'undefined' ? require('./') : root.lap;
  var spy = surveil();
  var hires = lap.timestamp() < lap.timestamp(); // process.hrtime
  if (![].some) aok.prototype.express = aok.info; // alert in ie8-

  /**
   * @param {{length:number}} stack
   * @param {string} type
   * @return {boolean}
   */
  function are(stack, type) {
    return !aok.fail(stack, function(v) {
      return typeof v === type;
    }, stack, 1);
  }

  /**
   * @param {*} o value to test
   * @param {!(number|Array)=} of expected length
   * @param {string=} type expected type for values
   * @return {boolean}
   */
  function isArray(o, of, type) {
    if (Array.isArray ? !Array.isArray(o) : !o) return false;
    if (o.length !== (of === +of ? of : isArray(of) ? of.length : +o.length)) return false;
    return !type || are(o, type);
  }

  /**
   * @param {Array} a
   * @return {boolean}
   */
  function ascends(a) {
    return a.join() === a.slice().sort().join();
  }

  /**
   * @param {Function=} fn
   * @return {Function}
   */
  function surveil(fn) {
    var did = 0, spy = function() {
      ++did;
      return !fn || fn.apply(this, arguments);
    };
    spy.reset = function(to) {
      did = to === +to ? to : 0;
    };
    spy.ran = function(expected) {
      return null == expected ? 0 < did : expected === did;
    };
    return spy;
  }

  /**
   * @param {string} method
   * @param {number} laps
   * @param {Array|Function} racers
   * @return {boolean}
   */
  function verify(method, laps, racers) {
    spy.reset();
    var field = typeof racers == 'function' ? 1 : racers.length;
    var output = lap[method](laps, racers);
    var bool = racers !== output && isArray(output, field, 'number') && spy.ran(laps*field);
    spy.reset();
    return bool;
  }

  /**
   * @param {string} method
   * @param {number} laps
   * @param {Array|Function} racers
   * @param {Function} test
   * @return {boolean}
   */
  function tends(method, laps, racers, test) {
    var samples = 64, i = samples, enough = samples - Math.sqrt(samples), tally = 0;
    while (i--) if (test(lap[method](laps, racers)) && ++tally >= enough) return true;
    return false;
  }

  aok('methods', !aok.fail(['timestamp', 'time', 'speed'], function(m) {
    return lap[m] && lap[m].sync && lap[m].async;
  }, aok, 1));

  aok('timestamp()', typeof lap.timestamp() == 'number' && lap.timestamp() > 0);
  aok('time(laps, fn)', verify('time', 1e3, spy));
  aok('time(laps, racers) ', verify('time', 1e3, [spy, spy]));
  aok('speed(laps, fn)', verify('speed', 1e3, spy));
  aok('speed(laps, racers)', verify('speed', 1e3, [spy, spy]));
  aok('ascends', ascends([0, 1, 1]) && ascends([0, 1]) && !ascends([2, 1]) && !ascends([1, 0, 1]));

  hires && setTimeout(function() {
    function faster() {}
    function slower() {
      return [+new Date].concat(1);
    }
    aok('logical times', tends('time', 1e4, [faster, slower], ascends));
    aok('logical speeds', tends('speed', 1e4, [slower, faster], ascends));
  }, 0);

  lap.time.async(1e3, spy, function(err, result) {
    aok('async result', !err && isArray(result, 1, 'number'));
  });

  lap.time.async(1e3, function() {
    throw new Error;
  }, function(err) {
    aok('async error', !!err);
  });
}(this);
