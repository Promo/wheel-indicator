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
        this.processDelta = processDelta;

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
        var self = this,
            delta = getDeltaY(event),
            l = self._deltaArray.length,
            breakPoint = false;

        if(delta > 0) {
            this._direction = 'down';
        } else {
            this._direction = 'up';
        }

        delta = Math.abs(delta);
        clearTimeout(self._timer);

        var nowTime = new Date().getTime();
        var timeInterval = timeout || (nowTime - self.time);


        if(timeInterval  > 100) {
            //console.error('trigger - 3 -> new inmpuls after stoped');
            triggerEvent.call(self, event);
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
                    //console.error('trigger - 1');
                    triggerEvent.call(self, event);
                    breakPoint = true;
                }

            }

            // ситуация при
            // 12 - 12
            // 3 - 73
            // 3 - 7
            if(!breakPoint) {
                if(t1 - t > 50 && v1 < 10) {
                    //console.error('trigger - 2');
                    triggerEvent.call(self, event);
                    breakPoint = true;
                }
            }


            // ситуация при (опасная проверка) - хорошо работает в Ya, но в ФФ тригерит много лишнего
            // 3 - 15
            // 1 - 51
            // 1 - 2

            if(!breakPoint) {
                if(t1 - (t + t2) > 30 && v1 < 10 && (v !== v1 || v1 !== v2)) {
                    console.error('trigger - 4');
                    breakPoint = true;
                }
            }

        }
        


        //console.log(self._timesArray);
        self.time = nowTime;
        self._deltaArray.push(delta);
        self._timesArray.push(timeInterval);


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
