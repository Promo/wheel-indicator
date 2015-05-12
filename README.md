[In Russian](https://github.com/Promo/wheel-indicator/blob/master/README_ru.md)


# wheel-indicator
Generates event when user makes new movement (like a swipe on a touchscreen).

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