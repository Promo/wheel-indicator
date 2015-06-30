/**
 * Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.0.4
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 */

/* global module, window, document */

var WheelIndicator = (function(win, doc) {
    function extend ( defaults, options ) {
        var extended = {},
            prop;

        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }

        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }

        return extended;
    }

    var eventWheel = 'onwheel' in doc ? 'wheel' : 'mousewheel',

    DEFAULTS = {
        callback: function(){},
        elem: doc,
        preventMouse: true
    };

    function Module(options){
        this._options = extend(DEFAULTS, options);
        this._deltaArray = [ 0, 0, 0 ];
        this._timesArray = [ 0, 0, 0 ];
        this._isAcceleration = false;
        this._isStopped = true;
        this._direction = '';
        this._timer = '';
        this._isWorking = true;
        this.time = new Date().getTime();

        var self = this;

        addEvent(this._options.elem, eventWheel, function(event) {
            if (self._isWorking) {
                processDelta.call(self, event);

                if (self._options.preventMouse) preventDefault(event);
            }
        });
    }

    Module.prototype = {
        Constructor: Module,

        turnOn: function(){
            this._isWorking = true;

            return this;
        },

        turnOff: function(){
            this._isWorking = false;

            return this;
        },

        setOptions: function(options){
            this._options = extend(this._options, options);

            return this;
        },

        getOption: function(option){
            var neededOption = this._options[option];

            if (neededOption !== undefined) return neededOption;

            throw new Error('Unknown option');
        }
    };

    function triggerEvent(event){
        event.direction = this._direction;

        this._options.callback.call(this, event);
    }

    var getDeltaY = function(event){

        if (event.wheelDelta) {
            getDeltaY = function(event) {
                return event.wheelDelta * -1;
            };
        } else {
            getDeltaY = function(event) {
                return event.deltaY;
            };
        }

        return getDeltaY(event);
    };

    function preventDefault(event){
        event = event || win.event;

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }
    
    function processDelta(event) {
        var self = this,
            delta = getDeltaY(event),
            arrayLength = self._deltaArray.length,
            l = self._deltaArray.length,
            breakPoint = false,
            _isAcceleration = false;


        delta = Math.abs(delta)
        clearTimeout(self._timer);







        //self._timer = setTimeout(function() {
        //    self._isStopped = true;
        //    self._deltaArray = [];
        //}, 200);
        //
        //if(self._isStopped) {
        //    self._isStopped = false;
        //
        //    self._deltaArray.push(delta);
        //    //console.warn('trigger - 3');
        //    console.error('trigger - 3');
        //    console.log(delta);
        //
        //    return;
        //}
        //
        //
        ////если значение в предыдущем значении была единица или 0
        //if(self._deltaArray[arrayLength - 1] <= 1) {
        //    //console.warn(self._deltaArray[arrayLength - 1]);
        //
        //    //может быть что подрят идут две однерки или два нуля
        //    if(self._deltaArray[arrayLength - 2] === self._deltaArray[arrayLength - 1]) {
        //
        //        if(self._deltaArray[arrayLength - 3] > 3) {
        //            if(delta > self._deltaArray[arrayLength - 1]) {
        //                console.error('trigger');
        //                _isAcceleration = true;
        //            }
        //        }
        //    }
        //
        //    if(self._deltaArray[arrayLength - 2] > 3) {
        //        if(delta > self._deltaArray[arrayLength - 1]) {
        //            console.error('trigger - 1');
        //            _isAcceleration = true;
        //        }
        //    }
        //}
        //
        ////проверяем ситуацию с резким тормажением. (например с 70 до 3)
        //if(!_isAcceleration && delta >=2) { //втрое условие исключает попадания не в ту  ветку
        //    //учитываем рандомные значения трекпада
        //    if(self._deltaArray[arrayLength - 2] / self._deltaArray[arrayLength - 3] < 3) {
        //        //может вылетить 0 и получим infinity при делении
        //        if(self._deltaArray[arrayLength - 2] !== 0 && self._deltaArray[arrayLength - 1] !==0) {
        //            if(self._deltaArray[arrayLength - 2] / self._deltaArray[arrayLength - 1] > 5) {
        //                console.error('trigger - 2');
        //            }
        //        }
        //    }
        //}




        var nowTime = new Date().getTime();
        var timeInterval = nowTime - self.time;


        if(timeInterval  > 100) {
            console.log(nowTime - self.time);
            console.error('trigger - 3 -> new inmpuls after stoped');
            timeInterval = 0;
            self._deltaArray = [];
            self._timesArray = [];
        }


        //надо проверять

        //  40 - 14
        //  9  - 30
        //  15 - 29
        //console.log(l);




        // M - more
        // L - less

        console.log(delta + ' - '+ timeInterval);
        var v = delta,
            v1 = self._deltaArray[l - 1],
            v2 = self._deltaArray[l - 2],

            t = timeInterval,
            t1 = self._timesArray[l - 1],
            t2 = self._timesArray[l - 2],

            vMv1   = v  > v1,   // текущая дельта больше последней
            v2Mv1  = v2 > v1,   // предпоследняя дельта больше последней

            tLt1   = t < t1,    // текущий тайм-аут меньше последнего
            t2Lt1  = t2 < t1;   // предпоследний тайм-аут меньше последнего


        if(l > 2) {
            if( ((vMv1) && (v2Mv1)) &&
                ((tLt1) && (t2Lt1)) ) {
                //блокирующие проверки
                //  1. Минимальное значение дельты не должно быть больше 15
                //  2. Минимальный таймаут между 2-я последними тригерами должен быть не менее 20
                //  3. Тригерим событие если только значение дельты не повторяется более 3 раз подрят
                if(
                    (self._deltaArray[l - 1] < 15) &&
                    (self._timesArray[l - 1] > 20) &&
                    (delta !== self._deltaArray[l - 1] || delta !== self._deltaArray[l - 2])
                ) {
                    console.error('trigger - 1');
                    breakPoint = true
                }

            }

            // ситуация при
            // 12 - 12
            // 3 - 73
            // 3 - 7
            if(!breakPoint) {
                if(t1 - t > 50 && v1 < 10) {
                    console.error('trigger - 2');
                }
            }

        }
        //if(
        //    ((delta <= 3) || (self._deltaArray[arrayLength - 1] / delta > 7)) &&
        //    (delta !== self._deltaArray[arrayLength - 1]) &&
        //    (timeInterval - self._timesArray[arrayLength - 1] > 10)
        //) {
        //    console.error('trigger - 2 -> ' + delta);
        //} else if(
        //    (self._deltaArray[arrayLength - 1] / delta > 3) &&
        //    (timeInterval > 35)
        //) {
        //    console.error('trigger - 1');
        //}

        //console.log(delta + ' - '+ timeInterval + ' - ' + self._timesArray[arrayLength - 1]);


        //console.log(self._timesArray);
        self.time = nowTime;
        self._deltaArray.push(delta);
        self._timesArray.push(timeInterval);


    }

    //function processDelta(event) {
    //    var
    //        self = this,
    //        delta = getDeltaY(event),
    //        direction = delta > 0 ? 'down' : 'up',
    //        arrayLength = self._deltaArray.length,
    //        changedDirection = false,
    //        repeatDirection = 0,
    //        sustainableDirection, i;
    //
    //    clearTimeout(self._timer);
    //
    //    self._timer = setTimeout(function() {
    //        self._deltaArray = [ 0, 0, 0 ];
    //        self._isStopped = true;
    //        self._direction = direction;
    //    }, 150);
    //
    //    //проверяем сколько из трех последних значений дельты соответствуют определенному направлению
    //    for(i = 0; i < arrayLength; i++) {
    //        if(self._deltaArray[i] !== 0) {
    //            self._deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
    //        }
    //    }
    //
    //    //если все три последних > 0 или все три < 0, значит произошла смена направления
    //    if(Math.abs(repeatDirection) === arrayLength) {
    //        //определяем тип устойчивого направления, т.е. направления при 3-х подрят положительных
    //        //или отрицательных значений дельт
    //        sustainableDirection = repeatDirection > 0 ? 'down' : 'up';
    //
    //        if(sustainableDirection !== self._direction) {
    //            //произошла смена направления
    //            changedDirection = true;
    //            self._direction = direction;
    //        }
    //    }
    //
    //    //если колесо в движении и данное событие дельты не первое в массиве
    //    if(!self._isStopped){
    //        if(changedDirection) {
    //            self._isAcceleration = true;
    //
    //            triggerEvent.call(this, event);
    //        } else {
    //            //делаем проверку если только направление движение стабильно в одну сторону
    //            if(Math.abs(repeatDirection) === arrayLength) {
    //                //надо брать дельты, чтобы не получать баг
    //                //[-116, -109, -103]
    //                //[-109, -103, 1] - новый импульс
    //
    //                analyzeArray.call(this, event);
    //            }
    //        }
    //    }
    //
    //    //если колесо было остановлено и данное значение дельты первое в массиве
    //    if(self._isStopped) {
    //        self._isStopped = false;
    //        self._isAcceleration = true;
    //        self._direction = direction;
    //
    //        triggerEvent.call(this, event);
    //    }
    //
    //    self._deltaArray.shift();
    //    self._deltaArray.push(delta);
    //}
    //
    //function analyzeArray(event) {
    //    var
    //        deltaArray0Abs  = Math.abs(this._deltaArray[0]),
    //        deltaArray1Abs  = Math.abs(this._deltaArray[1]),
    //        deltaArray2Abs  = Math.abs(this._deltaArray[2]),
    //        deltaAbs        = Math.abs(getDeltaY(event));
    //
    //    if((deltaAbs       > deltaArray2Abs) &&
    //       (deltaArray2Abs > deltaArray1Abs) &&
    //       (deltaArray1Abs > deltaArray0Abs)) {
    //
    //        if(!this._isAcceleration) {
    //            triggerEvent.call(this, event);
    //            this._isAcceleration = true;
    //        }
    //    }
    //
    //    if((deltaAbs < deltaArray2Abs) &&
    //        (deltaArray2Abs <= deltaArray1Abs)) {
    //        this._isAcceleration = false;
    //    }
    //}

    function addEvent(elem, type, handler){
        if(win.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (win.attachEvent) {
            elem.attachEvent('on' + type, handler);
        }
    }

    return Module;
}(window, document));

if (typeof exports === 'object') {
    module.exports = WheelIndicator;
}
