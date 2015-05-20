var WheelIndicator = (function(win, doc) {
    /**
     * Merge defaults with user options
     * @private
     * @param {Object} defaults Default settings
     * @param {Object} options User options
     * @returns {Object} Merged values of defaults and options
     */
    var extend = function ( defaults, options ) {
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
    };

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

    var getDeltaY = function(event){
        if(event.wheelDelta) {
            getDeltaY = function(event) {
                return event.wheelDelta / -120;
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
        var self = this,
            delta = Math.abs(event.deltaY),
            direction = event.deltaY > 0 ? 'up' : 'down';

        clearTimeout(self.timer);

        self.timer = setTimeout(function() {
            self.deltaArray = [ 0, 0, 0 ];
            self.isStopped = true;
            self.direction = direction;
        }, 200);

        if(self.isStopped) {
            self.isStopped = false;
            self.isAcceleration = true;
            self.direction = direction;
            triggerEvent.call(this, event);
        } else {
            if(direction !== self.direction) {
                self.isAcceleration = true;
                self.direction = direction;
                triggerEvent.call(this, event);
            } else {
                if((delta > self.deltaArray[2]) &&
                   (self.deltaArray[2] > self.deltaArray[1]) &&
                   (self.deltaArray[1] > self.deltaArray[0])) {

                    if(!self.isAcceleration) {
                        triggerEvent.call(this, event);
                        self.isAcceleration = true;
                    }
                }

                if((delta < self.deltaArray[2]) &&
                   (self.deltaArray[2] <= self.deltaArray[1])) {
                    self.isAcceleration = false;
                }
            }
        }

        self.deltaArray.shift();
        self.deltaArray.push(delta);
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
