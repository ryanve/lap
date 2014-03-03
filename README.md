# racer
#### JavaScript performance testing library for the browser or server

## API ([0.1](../releases))

#### `racer.timestamp()`
- Get a hi-resolution timestamp
- <b>@return</b> number

#### `racer.time(trials, fn)`
- Time how many milliseconds it takes `fn` to run `trials` times.
- <b>@return</b> number

#### `racer.speed(trials, fn)`
- Estimate operations per second by running `fn` `trials` times.
- <b>@return</b> number

#### `racer.race(trials, rivals)`
- Get a map of times (ms) it takes each rival function to run `trials` times.
- <b>@return</b> Array

#### `racer.rate(trials, rivals)`
- Get a map of speeds (op/s) it takes each rival function to run `trials` times.
- <b>@return</b> Array

### `.async` and `.sync`
#### Methods are callable `.async` with the same arguments plus a `(err, result)` callback

```js
racer.time.async(1e5, function() {
  [].concat([0, 1, 2, 3])
}, function(err, result) {
  err || console.log(result + ' ms')
})
```

#### `.sync` methods are aliases

```js
racer.time === racer.time.sync
```

## License
[MIT](package.json#L6-L7)