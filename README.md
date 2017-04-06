# wheel-indicator
Indicates when user makes swipe gesture on a trackpad or mouse wheel.

[![Build Status][travis-image]][travis-url]

![trackpad](https://cloud.githubusercontent.com/assets/769992/7619952/b77d9ce6-f9d5-11e4-8ed1-bc01dd972092.jpg)

## Installing
```bash
npm i -S wheel-indicator
```
or oldschool method:
```html
<script src="wheel-indicator.js"></script>
```

## Usage
```javascript
var WheelIndicator = require('wheel-indicator'); // ← if you use build system

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
| `elem` | `Object` (dom node) | `document` | No | DOM node to listen `wheel` event on. |
| `callback` | `Function` | - | Yes | The callback, which will be triggered on gesture. Gets for the first argument a native `wheel` event object, extended by `direction` property, taking value `'up'` or `'down'`. |
| `preventMouse` | `Bool` | `true` | Yes | Disables mouse wheel working. In other words applies `preventDefault()` to `wheel` event. | 

### Instance methods
| Method | Description |
| ------- | ---------------------------------------- |
| `turnOff()` | Turns off callback triggering. |
| `turnOn()` | Turns on callback trigerring. |
| `setOptions(options)` | Sets the mutable options. The only argument must be `Object`. |
| `getOption('option')` | Returns option value. The only argument must be `String`. |
| `destroy()` | Removes event listener. |

[travis-url]: http://travis-ci.org/Promo/wheel-indicator
[travis-image]: http://img.shields.io/travis/Promo/wheel-indicator.svg?branch=master&style=flat
