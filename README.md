# wheel-indicator
Generates event when user makes new movement (like a swipe on a touchscreen).

[![Build Status][travis-image]][travis-url]

## Connection
```html
<script src="wheel-indicator.js"></script>
```
or if you use build system:
```javascript
var WheelIndicator = require('wheel-indicator');
```

## Usage
**globals**  
```javascript
  var indicator = new WheelIndicator(document.querySelector('.element'));
  
  indicator.onGesture(function(e){
      e.prevent(); // Disables mousewheel work
      console.log(e.direction); // "up" or "down"
  });
```

[travis-url]: http://travis-ci.org/Promo/wheel-indicator
[travis-image]: http://img.shields.io/travis/Promo/wheel-indicator.svg?branch=master&style=flat

## API

### Options
| Field | Type | Default value | Description |
| ------- | ------- | ----------- | ---------------------------------------- |
| `elem` | `Object` (dom node) | `document` | Dom node to listen `wheel` event on. |
| `callback` | `Function` | - | The callback, which will be triggered on gesture. Gets for the first argument a native `wheel` event object, extended by `direction` property, taking value `'up'` or `'down'`. |
| `preventMouse` | `Bool` | `true` | Disables mouse wheel working. In other words apply `preventDefault()` to `wheel` event. | 

### Instance methods

| Method | Description |
| ------- | ------- | ---------------------------------------- |
| `turnOff()` | Turn off callback triggering |
| `turnOn()` | Turn on callback trigerring |
| `setOptions( options )` | Sets the necessary options. The only argument must be `Object`. |
