[In Russian](https://github.com/Promo/wheel-indicator/blob/master/README_ru.md)


# wheel-indicator
Generates event when user makes new movement (like a swipe on a touchscreen).

## Connection
```html
<script src="wheel-indicator.js"></script>
```

## Usage
**globals**  
```javascript
  var indicator = new WheelIndicator(document.querySelector('.element'));
  
  indicator.on(function(e){
      e.prevent(); // If necessary
      console.log(e.direction); // "up" or "down"
  });
```

**jquery**  
```javascript
  $('.jquery').on('wheel-indicator', function(e){
      e.prevent(); // If necessary
      console.log(e.direction); // "up" or "down"
  });
```
