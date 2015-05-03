# wheel-indicator
Добавляет новые события (scrollUp и scrollDown), основанные на анализе дельты события wheel (скроллинга колесом мыши или трекпада).

События scrollUp и scrollDown тригерятся на одно полное проскралливание колесом мыши или на одно проскралливание на трекпаде.

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

##Поддержка старых браузеров
Если вам нужна поддержка старых браузеров воспользуйтесь версией wheel-indicator из ветки jquery-trigger
