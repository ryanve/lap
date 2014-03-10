(function(root) {
  var common = typeof module != 'undefined' && !!module.exports;
  var aok = common ? require('aok') : root.aok;
  var lap = common ? require('../src') : root.lap;
  if (![].some) aok.prototype.express = aok.info; // alert in ie8-

  function are(stack, type) {
    return !aok.fail(stack, function(v) {
      return typeof v === type;
    }, stack, 1);
  }
  
  function isArray(o, l, type) {
    if (Array.isArray ? !Array.isArray(o) : !o) return false;
    if (typeof l == 'number' ? l !== o.length : typeof o.length != 'number') return false;
    return !type || are(o, type);
  }
  
  function count() { 
    typeof count.current == 'number' ? count.current++ : count.current = 1; 
  }
  
  function reset() { 
    count.current = 0;
    return true;
  }
  
  function counted(expect) { 
    var bool = expect === count.current;
    reset();
    return bool;
  }
  
  function testNum(method, laps, fn) {
    reset();
    var bool = lap[method](laps, fn) >= 0 && counted(laps);
    reset();
    return bool;
  }
  
  function testMap(method, laps, racers) {
    reset();
    var bool = isArray(lap[method](laps, racers), racers.length, 'number') && counted(laps*racers.length);
    reset();
    return bool;
  }
  
  aok('methods', !aok.fail(['timestamp', 'time', 'speed'], function(m) {
    return lap[m] && lap[m].sync && lap[m].async;
  }, aok, 1));
  
  aok('timestamp()', lap.timestamp() > 0);
  aok('time(laps, fn)', testNum('time', 1e3, count));
  aok('time(laps, racers) ', testMap('time', 1e3, [count, count]));
  aok('speed()', testMap('speed', 1e3, [count, count]));
  
  lap.time.async(1e3, count, function(err, result) {
    aok('async result', !err && isArray(result));
  });
  
  lap.time.async(1e3, function() {
    throw new Error;
  }, function(err) {
    aok('async error', !!err);
  });
}(this));