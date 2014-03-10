# lap
#### JavaScript performance testing library for the browser or server

## API ([0.2](../../releases))

- <var>laps</var> refers to number of laps to run (positive integer)
- <var>racers</var> refers to function(s) to race (array or single function)

### Methods

#### `lap.timestamp()`
- Get a hi-resolution timestamp
- &rArr; number

#### `lap.time(laps, racers)`
- Time how long it takes racer to run the given number of laps.
- &rArr; array of times measured in milliseconds

#### `lap.speed(laps, racers)`
- Estimate each racer's average speed over a course of `laps`
- &rArr; array of speeds measured in operations per second

### `.async`

```js
// Methods are callable `.async` with the same arguments plus a `(err, result)` callback
lap.time.async(1e5, function() {
  [].concat([0, 1, 2, 3])
}, function(err, result) {
  err || console.log(result[0] + ' ms')
})
```

### `.sync`

```js
// .sync methods are just aliases
lap.time === lap.time.sync
```

## Compatibility

Works...everywhere<b>!</b> Tested in node, Chrome, FF, Opera, IE8

## Contribute
Make edits in [/<b>src</b>](./src). Run [tests](test) in [node](#cli) or in the [browser](test/index.html).

<a name="cli"></a>
```sh
$ npm install # install devDependencies
$ grunt jshint:sub # lint sub dirs
$ grunt test # run tests
```

## Fund
<b>[Tip the developer](https://www.gittip.com/ryanve/)</b> =)

## License
[MIT](package.json#L6-L7)