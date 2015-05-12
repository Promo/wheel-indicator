# wheel-indicator
Генерирует событие только тогда, когда пользователь совершает новый жест по трекпаду (подобно жеству свайпа на мобильных
девайсах).

##Подключаем
```html
<script src="wheel-indicator.js"></script>
```
или если вы используете сборочную систему
```javascript
var WheelIndicator = require('wheel-indicator');
```

##Используем
**globals**  
```javascript
  var indicator = new WheelIndicator(document.querySelector('.element'));
  
  indicator.onGesture(function(e){
      e.prevent(); // Отключает системную работу колеса мыши
      console.log(e.direction); // "up" или "down"
  });
```
