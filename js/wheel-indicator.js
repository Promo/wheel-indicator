/**
 * Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.0.2
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 */

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
        this.deltaArray = [ 0, 0, 0 ];
        this.isAcceleration = false;
        this.isStopped = true;
        this.direction = '';
        this.delta = '';
        this.timer = '';
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
        event.direction = this.direction;

        this._options.callback.call(this, event);
    }

    function getDeltaY(event){
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
    }

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
            arrayLength = self.deltaArray.length,
            changedDirection = false,
            repeatDirection = 0,
            sustainableDirection, i;

        clearTimeout(self.timer);

        self.timer = setTimeout(function() {
            self.deltaArray = [ 0, 0, 0 ];
            self.isStopped = true;
            self.direction = direction;
        }, 150);

        //проверяем сколько из трех последних значений дельты соответствуют определенному направлению
        for(i = 0; i < arrayLength; i++) {
            if(self.deltaArray[i] !== 0) {
                self.deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
            }
        }

        //если все три последних > 0 или все три < 0, значит произошла смена направления
        if(Math.abs(repeatDirection) === arrayLength) {
            //определяем тип устойчивого направления, т.е. направления при 3-х подрят положительных
            //или отрицательных значений дельт
            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

            if(sustainableDirection !== self.direction) {
                //произошла смена направления
                changedDirection = true;
                self.direction = direction;
            }
        }

        //если колесо в движение и данное событие дельты не первое в массиве
        if(!self.isStopped){
            if(changedDirection) {
                self.isAcceleration = true;
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
        if(self.isStopped) {
            self.isStopped = false;
            self.isAcceleration = true;
            self.direction = direction;
            triggerEvent.call(this, event);
        }

        self.deltaArray.shift();
        self.deltaArray.push(delta);
    }

    function analyzeArray(event) {
        var
            deltaArray0Abs  = Math.abs(this.deltaArray[0]),
            deltaArray1Abs  = Math.abs(this.deltaArray[1]),
            deltaArray2Abs  = Math.abs(this.deltaArray[2]),
            deltaAbs        = Math.abs(event.deltaY);

        if((deltaAbs       > deltaArray2Abs) &&
           (deltaArray2Abs > deltaArray1Abs) &&
           (deltaArray1Abs > deltaArray0Abs)) {

            if(!this.isAcceleration) {
                triggerEvent.call(this, event);
                this.isAcceleration = true;
            }
        }

        if((deltaAbs < deltaArray2Abs) &&
            (deltaArray2Abs <= deltaArray1Abs)) {
            this.isAcceleration = false;
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
