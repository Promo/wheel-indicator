/**
 * Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.1.4
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 */

/* global module, window, document */

var WheelIndicator = (function(win, doc) {
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
        this._wheelHandler = function(event) {
            if (self._isWorking) {
                processDelta.call(self, event);

                if (self._options.preventMouse) {
                  preventDefault(event);
                }
            }
        };

        addEvent(this._options.elem, eventWheel, this._wheelHandler);
    }

    Module.prototype = {
        constructor: Module,

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

            if (neededOption !== undefined) {
              return neededOption;
            }

            throw new Error('Unknown option');
        },

        destroy: function(){
            removeEvent(this._options.elem, eventWheel, this._wheelHandler);

            return this;
        }
    };

    function triggerEvent(event){
        event.direction = this._direction;

        this._options.callback.call(this, event);
    }

    var getDeltaY = function(event){

        if(event.wheelDelta && !event.deltaY) {
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
        var
            self = this,
            delta = getDeltaY(event);

        if (delta === 0) return;

        var direction = delta > 0 ? 'down' : 'up',
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

        //check how many of last three deltas correspond to certain direction
        for(i = 0; i < arrayLength; i++) {
            if(self._deltaArray[i] !== 0) {
                self._deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
            }
        }

        //if all of last three deltas is greater than 0 or lesser than 0 then direction is switched
        if(Math.abs(repeatDirection) === arrayLength) {
            //determine type of sustainable direction
            //(three positive or negative deltas in a row)
            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

            if(sustainableDirection !== self._direction) {
                //direction is switched
                changedDirection = true;
                self._direction = direction;
            }
        }

        //if wheel`s moving and current event is not the first in array
        if(!self._isStopped){
            if(changedDirection) {
                self._isAcceleration = true;

                triggerEvent.call(this, event);
            } else {
                //check only if movement direction is sustainable
                if(Math.abs(repeatDirection) === arrayLength) {
                    //must take deltas to don`t get a bug
                    //[-116, -109, -103]
                    //[-109, -103, 1] - new impulse

                    analyzeArray.call(this, event);
                }
            }
        }

        //if wheel is stopped and current delta value is the first in array
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
            deltaAbs        = Math.abs(getDeltaY(event));

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
        if(elem.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handler);
        }
    }

    function removeEvent(elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on'+ type, handler);
        }
    }

    function extend(defaults, options) {
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

    return Module;
}(window, document));

if (typeof exports === 'object') {
    module.exports = WheelIndicator;
}
