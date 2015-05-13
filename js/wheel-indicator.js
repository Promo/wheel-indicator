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
        this.last5values = [ 0, 0, 0, 0, 0 ];
        this.memoryAcceleration = [ 0, 0, 0 ];
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
        var stepAcceleration = 0,
            deltaY = getDeltaY(event),
            i;

        this.direction = deltaY > 0 ? this.direction = 'down' : this.direction = 'up';

        this.delta = Math.abs(deltaY);

        clearTimeout(this.timer);

        var self = this;

        this.timer = setTimeout(function() {
            self.last5values = [ 0, 0, 0, 0, 0 ];
            self.memoryAcceleration = [ 0, 0, 0 ];
            self.isStopped = true;
            self.isAcceleration = false;
        }, 200);

        if(this.isStopped) {
            triggerEvent.call(this, event);
            this.isStopped = false;
            this.isAcceleration = true;
            stepAcceleration = 1;

            this.memoryAcceleration.shift();
            this.memoryAcceleration.push(stepAcceleration);
        } else {
            this.last5values.shift();
            this.last5values.push(this.delta);

            for(i = 5; i--; i == 1) {
                if(this.last5values[i - 1] < this.last5values[i]) {
                    stepAcceleration++;
                }
            }

            this.memoryAcceleration.shift();
            this.memoryAcceleration.push(stepAcceleration);

            if( (this.memoryAcceleration[2] < this.memoryAcceleration[1]) &&
                (this.memoryAcceleration[1] < this.memoryAcceleration[0])) {
                //Произошло затухание
                this.isAcceleration = false;
            }

            if( (this.memoryAcceleration[2] > this.memoryAcceleration[1]) &&
                (this.memoryAcceleration[1] > this.memoryAcceleration[0])) {
                //Произошло ускорение
                if(!this.isAcceleration) {
                    this.isAcceleration = true;
                    triggerEvent.call(this, event);
                }
            }
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
