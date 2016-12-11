# lap
#### JavaScript performance testing library for the browser or server

## API
<a name="methods-toc"></a>
#### Methods

- <a href="#time"><b>lap.time</b>(laps, racers)</a>
- <a href="#speed"><b>lap.speed</b>(laps, racers)</a>
- <a href="#timestamp"><b>lap.timestamp</b>()</a>

#### Parameters

- <var>laps</var> refers to number of laps to run (positive integer)
- <var>racers</var> refers to function(s) to race (array or single function)

#### Usage tips

- Use JavaScript exponential notation like `1e3` (rather than `1000`) for expressing large numbers
- Accurate results require many <var>laps</var>. The ideal amount depends on how complex the racers are:
  - `Infinity` speeds and `0` times both indicate inadequate <var>laps</var>
  - Results taking too long indicates excessive <var>laps</var>. Use less <var>laps</var> <b>or</b> use the [`.async`](#async-sync) syntax

<a name="time"></a>
#### `lap.time(laps, racers)`
- Time how long it takes each racer to run the given number of laps
- <b>@return</b> array of times measured in milliseconds

##### `.time` example
```js
lap.time(1e5, [
  function() { document.getElementById('example') },
  function() { document.querySelector('#example') },
  function() { document.querySelectorAll('#example')[0] }
]) // => [40.000000000873115, 44.99999999825377, 116.00000000180444]
```

<a name="speed"></a>
#### `lap.speed(laps, racers)`
- Estimate each racer's average speed over a course of <var>laps</var>
- <b>@return</b> array of speeds measured in operations per second

##### `.speed` example
```js
lap.speed(1e5, [
  function() { document.getElementById('example') },
  function() { document.querySelector('#example') },
  function() { document.querySelectorAll('#example')[0] }
]) // => [2500000.0004001777, 2222222.2219491494, 884955.7522315352]
```

<a name="timestamp"></a>
#### `lap.timestamp()`
- Get a hi-resolution timestamp
- <b>@return</b> number measured in milliseconds

##### `.timestamp` example
```js
lap.timestamp() // => 1610.000000000582
```

<a name="async-sync"></a>
#### `.async`
- [Methods](#methods-toc) are callable `.async` with the same arguments plus a `(err, result)` callback
- <b>@return</b> undefined

##### `.async` syntax
- `lap.time.async(laps, racers, callback)`
- `lap.speed.async(laps, racers, callback)`
- `lap.timestamp.async(callback)`

##### `.async` example
```js
lap.time.async(1e5, function() {
  [].concat([0, 1, 2, 3])
}, function(err, result) {
  err || console.log(result[0] + ' ms')
}) // => undefined
```

#### `.sync`

`.sync` methods are included for expressiveness but these are just aliases. `lap.time === lap.time.sync` etc.

##### `.sync` example
```js
lap.time.sync(1e5, [
  function() { document.getElementById('example') },
  function() { document.querySelector('#example') },
  function() { document.querySelectorAll('#example')[0] }
]) // => [40.000000000873115, 45.99999999481952, 115.00000000523869]
```

## Compatibility

Works...everywhere<b>!</b> Tested in node, Chrome, FF, Opera, IE8

## Contribute

<a name="cli"></a>
```sh
$ npm start
$ npm test
```
