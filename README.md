[In Russian](https://github.com/Promo/wheel-indicator/blob/master/README_ru.md)

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