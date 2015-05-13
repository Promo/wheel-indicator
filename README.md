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
| `elem` | `Object` (dom node) | `document` | Dom node to listen `wheel` event. |
| `callback` | `Function` | - | The callback, which trigger on gesture. Gets with the first argument a `wheel` event, extended with `direction` property, which contains `'up'` or `'down'` value. |
| `preventMouse` | `Bool` | `true` | Disables mouse wheel working. In other words invokes `preventDefault()` for `wheel` event. | 

### Instance methods

| Method | Description |
| ------- | ------- | ---------------------------------------- |
| `turnOff()` | Turn off callback execution |
| `turnOn()` | Turn on callback execution |
| `setOptions( options )` | Sets the necessary options. The only argument have to be `Object`. |
