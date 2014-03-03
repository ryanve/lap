(function(root) {
  var common = typeof module != 'undefined' && !!module.exports;
  var aok = common ? require('aok') : root.aok;
  var racer = common ? require('../src') : root.racer;
  
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
  
  function testNum(method, trials, fn) {
    reset();
    var bool = typeof racer[method](trials, fn) == 'number' && counted(trials);
    reset();
    return bool;
  }
  
  function testMap(method, trials, rivals) {
    reset();
    var bool = isArray(racer[method](trials, rivals), rivals.length, 'number') && counted(trials*rivals.length);
    reset();
    return bool;
  }
  
  aok('methods', !aok.fail(['timestamp', 'time', 'speed', 'race', 'rate'], function(m) {
    return racer[m] && racer[m].sync && racer[m].async;
  }, aok, 1));
  
  aok('timestamp()', racer.timestamp() > 0);
  aok('time()', testNum('time', 1e3, count));
  aok('speed()', testNum('speed', 1e3, count));
  aok('race()', testMap('race', 1e3, [count, count]));
  aok('rate()', testMap('rate', 1e3, [count, count]));
  
  racer.time.async(1e3, count, function(err, result) {
    aok('async result', !err && typeof result == 'number');
  });
  
  racer.time.async(1e3, function() {
    throw new Error;
  }, function(err) {
    aok('async error', !!err);
  });
}(this));