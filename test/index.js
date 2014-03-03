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
  
  aok('timestamp()', racer.timestamp() > 0);
  aok('time()', testNum('time', 100, count));
  aok('speed()', testNum('speed', 100, count));
  aok('race()', testMap('race', 100, [count, count]));
  aok('rate()', testMap('rate', 100, [count, count]));
}(this));