# wheel-indicator
Нормализует работу инерционных устройств ввода (таких, как тачпад, magic mouse), генерируя событие только тогда, когда
пользователь сделал новый жест (по сути swipe). Плагин избавляет от проблем генерации множества ненужных событий такого рода девайсами.

##Подключаем
```html
<script src="wheel-indicator.js"></script>
```

##Используем
**globals**  
```javascript
  var indicator = new WheelIndicator(document.querySelector('.element'));
  
  indicator.on(function(e){
      e.prevent(); // если необходимо
      console.log(e.direction); // "up" или "down"
  });
```

**jquery**  
```javascript
  $('.jquery').on('wheel-indicator', function(e){
      e.prevent(); // если необходимо
      console.log(e.direction); // "up" or "down"
  });
```
