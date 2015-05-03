[In Russian](https://github.com/Promo/wheel-indicator/blob/master/README_ru.md)


# wheel-indicator
Normalizes the work of the inertial wheels (such as touchpads, the magic mouse, etc.) by generating event only when user
 makes new movement (like a swipe on a touchscreen). 

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
