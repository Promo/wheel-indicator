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
```javascript
  var indicator = new WheelIndicator({
    elem: document.querySelector('.element'),
    callback: function(e){
      console.log(e.direction) // "up" or "down"
    }
  });
  
  //The method call
  indicator.getOption('preventMouse'); // true
```

## API

### Options
| Field | Type | Default value | Mutable (by `setOptions()`) | Description |
| ------- | --------- | ----------- | ---- | ---------------------------------------- |
| `elem` | `Object` (dom node) | `document` | No | Dom node to listen `wheel` event on. |
| `callback` | `Function` | - | Yes | The callback, which will be triggered on gesture. Gets for the first argument a native `wheel` event object, extended by `direction` property, taking value `'up'` or `'down'`. |
| `preventMouse` | `Bool` | `true` | Yes | Disables mouse wheel working. In other words apply `preventDefault()` to `wheel` event. | 

### Instance methods
| Method | Description |
| ------- | ------- | ---------------------------------------- |
| `turnOff()` | Turn off callback triggering |
| `turnOn()` | Turn on callback trigerring |
| `setOptions( options )` | Sets the mutable options. The only argument must be `Object`. |
| `getOption( 'option' )` | Returns option value. The only argument must be `String`. |

[travis-url]: http://travis-ci.org/Promo/wheel-indicator
[travis-image]: http://img.shields.io/travis/Promo/wheel-indicator.svg?branch=master&style=flat