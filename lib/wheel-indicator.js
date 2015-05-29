/**
 * Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.0.2
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
        this._isAcceleration = false;
        this._isStopped = true;
        this._direction = '';
        this._timer = '';
        this._isWorking = true;

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
        if(event.wheelDelta) {
            getDeltaY = function(event) {
                return event.wheelDelta;
            }
        } else {
            getDeltaY = function(event) {
                return event.deltaY;
            }
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
        var
            self = this,
            delta = event.deltaY,
            direction = event.deltaY > 0 ? 'down' : 'up',
            arrayLength = self._deltaArray.length,
            changedDirection = false,
            repeatDirection = 0,
            sustainableDirection, i;

        clearTimeout(self._timer);

        self._timer = setTimeout(function() {
            self._deltaArray = [ 0, 0, 0 ];
            self._isStopped = true;
            self._direction = direction;
        }, 150);

        //проверяем сколько из трех последних значений дельты соответствуют определенному направлению
        for(i = 0; i < arrayLength; i++) {
            if(self._deltaArray[i] !== 0) {
                self._deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
            }
        }

        //если все три последних > 0 или все три < 0, значит произошла смена направления
        if(Math.abs(repeatDirection) === arrayLength) {
            //определяем тип устойчивого направления, т.е. направления при 3-х подрят положительных
            //или отрицательных значений дельт
            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

            if(sustainableDirection !== self._direction) {
                //произошла смена направления
                changedDirection = true;
                self._direction = direction;
            }
        }

        //если колесо в движение и данное событие дельты не первое в массиве
        if(!self._isStopped){
            if(changedDirection) {
                self._isAcceleration = true;
                triggerEvent.call(this, event);
            } else {
                //делаем проверку если только направление движение стабильно в одну сторону
                if(Math.abs(repeatDirection) === arrayLength) {
                    //надо брать дельты, чтобы не получать баг
                    //[-116, -109, -103]
                    //[-109, -103, 1] - новый импульс

                    analyzeArray.call(this, event);
                }
            }
        }

        //если колесо было остановлено и данное значение дельты первое в массиве
        if(self._isStopped) {
            self._isStopped = false;
            self._isAcceleration = true;
            self._direction = direction;
            triggerEvent.call(this, event);
        }

        self._deltaArray.shift();
        self._deltaArray.push(delta);
    }

    function analyzeArray(event) {
        var
            deltaArray0Abs  = Math.abs(this._deltaArray[0]),
            deltaArray1Abs  = Math.abs(this._deltaArray[1]),
            deltaArray2Abs  = Math.abs(this._deltaArray[2]),
            deltaAbs        = Math.abs(event.deltaY);

        if((deltaAbs       > deltaArray2Abs) &&
           (deltaArray2Abs > deltaArray1Abs) &&
           (deltaArray1Abs > deltaArray0Abs)) {

            if(!this._isAcceleration) {
                triggerEvent.call(this, event);
                this._isAcceleration = true;
            }
        }

        if((deltaAbs < deltaArray2Abs) &&
            (deltaArray2Abs <= deltaArray1Abs)) {
            this._isAcceleration = false;
        }
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
