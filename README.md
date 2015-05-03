# wheel-indicator
Нормализует работу инерционных устройств ввода (таких, как тачпад, magic mouse), генерируя событие только тогда, когда
пользователь сделал новый жест (по сути swipe). Плагин избавляет от проблем генерации множества ненужных событий такого рода девайсами.

##Подключаем
```html
<script src="whell-indicator.js"></script>
```

##Используем
**globals**  
```javascript
  var indicator = new WheelIndicator(document.querySelector('.element'));
  
  indicator.on(function(e){
      console.log(e.direction); // "up" or "down"
  });
```

**jquery**  
```javascript
  $('.jquery').on('wheel-indicator', function(e){
      console.log(e.direction); // "up" or "down"
  });
```
