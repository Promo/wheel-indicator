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
        this._deltaArray = [ ];
        this._timesArray = [ ];
        this._isAcceleration = false;
        this._isStopped = true;
        this._direction = '';
        this._timer = '';
        this._isWorking = true;
        this.time = new Date().getTime();
        this.processDelta = processDelta;

        this.iterate = 0;
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

        // на время закоментил! При такой проверке в Ya попадает значение wheelDelta, которое в 3 раза больше нормального

        //if (event.wheelDelta) {
        //    getDeltaY = function(event) {
        //        return event.wheelDelta * -1;
        //    };
        //} else {
        //    getDeltaY = function(event) {
        //        return event.deltaY;
        //    };
        //}

        getDeltaY = function(event) {
            return event.deltaY;
        };

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

    function processDelta(event, timeout) {
        // event.deltaY
        // wheelDelta
        // event.wheelDeltaY

        //console.log(event);

        ++this.iterate;
        var self = this,
            delta = getDeltaY(event),
            l = self._deltaArray.length,
            breakPoint = false;


        var dir; // current direction

        var nowTime = new Date().getTime();
        var timeOut = timeout || nowTime - self.time;

        //для тестов. Значение -1 означает, что была остоновка более 100мс между соседними фаерами события
        if(timeout === -1) {
            timeOut = 500
        }

        if(l > 2) {
            if((delta > 0) && (self._deltaArray[l - 1] > 0) && (self._deltaArray[l - 2] > 0)) {
                dir = 'down';
            }

            if((delta < 0) && (self._deltaArray[l - 1] < 0) && (self._deltaArray[l - 2] < 0)) {
                dir = 'up';
            }

            //если все дельты > 0 или < 0 проверяем направление
            if(dir) {
                if(dir !== this._direction) {
                    this._direction = dir;

                    event.scheme = '1: new impuls';
                    triggerEvent.call(self, event);
                    return writeLog.call(self, delta, timeOut, nowTime);
                }
            } else {
                //иначе просто записываем в лог без действий
                console.log('return');
                return writeLog.call(self, delta, timeOut, nowTime);
            }
        }


        console.log(dir);

        if(delta > 0) {
            this._direction = 'down';
        } else {
            this._direction = 'up';
        }

        clearTimeout(self._timer);




        if(timeOut  > 100) {

            event.scheme = '1: new impuls';
            triggerEvent.call(self, event);

            timeOut = -1; // хитро сохраняем -1, для тестов
            //self._deltaArray = [];
            //self._timesArray = [];
        }


        //надо проверять

        //  40 - 14
        //  9  - 30
        //  15 - 29

        // M - more
        // L - less



        //console.log(delta + ' - '+ timeOut + ' \t\t\t' + this.iterate);


        var
            dc = Math.abs(delta),
            d1 = Math.abs(self._deltaArray[l - 1]),
            d2 = Math.abs(self._deltaArray[l - 2]),

            tc = Math.abs(timeOut),
            t1 = Math.abs(self._timesArray[l - 1]),
            t2 = Math.abs(self._timesArray[l - 2]);


        if(l > 2) {
            //опрелеляем направление



            if( ((dc > d1 ) && (d2 > d1 )) && // (текущая дельта больше последней) и (предпоследняя дельта больше последней)
                ((tc < t1) && (t2 < t1)) ) { // (текущий тайм-аут меньше последнего) и (предпоследний тайм-аут меньше последнего)
                //блокирующие проверки
                //  1. Минимальное значение дельты не должно быть больше 15
                //  2. Минимальный таймаут между 2-я последними тригерами должен быть не менее 20
                //  3. Тригерим событие если только значение дельты не повторяется более 3 раз подрят
                if(
                    (d1  < 15) &&
                    (t1 > 20) &&
                    (dc !== d1  || dc !== d2)
                ) {
                    event.scheme = '2: base condition';
                    triggerEvent.call(self, event);
                    breakPoint = true;
                }

            }

            // ситуация при
            // 12 - 12
            // 3 - 73
            // 3 - 7
            if(!breakPoint) {
                if(t1 - tc > 50 && d1  < 10) {

                    event.scheme = '3: condition';
                    triggerEvent.call(self, event);
                    breakPoint = true;
                }
            }


            // ситуация при (опасная проверка) - хорошо работает в Ya, но в ФФ тригерит много лишнего
            // 3 - 15
            // 1 - 51
            // 1 - 2

            if(!breakPoint) {
                if(t1 - (tc + t2) > 30 && d1  < 10 && (dc !== d1  || d1  !== d2)) {

                    event.scheme = '4: condition';
                    breakPoint = true;
                }
            }
        }

        return writeLog.call(self, delta, timeOut, nowTime);
    }

    function writeLog(delta, timeOut, time) {
        this.time = time;
        this._deltaArray.push(delta);
        this._timesArray.push(timeOut);
    }


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
