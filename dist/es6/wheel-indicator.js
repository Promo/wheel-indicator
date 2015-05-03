var WheelIndicator = (function() {
    var eventWheel = 'onwheel' in document ? 'wheel' : 'mousewheel';

    function Module(elem){
        this.last5values = [ 0, 0, 0, 0, 0 ];
        this.memoryAcceleration = [ 0, 0 , 0 ];
        this.isAcceleration = false;
        this.isStopped = true;
        this.direction = '';
        this.delta = '';
        this.timer = '';

        var self = this;
        addEvent(elem, eventWheel, function(event) {
            processDelta(getDeltaY(event), self);
        });
    }

    Module.prototype = {
        Constructor: Module,

        on: function(cb){
            this.callback = cb || function(){};
        }
    };

    function triggerEvent(self){
        var event = {};
        event.direction = self.direction;
        self.callback(event);
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
        getDeltaY(event);
    };

    function processDelta(deltaY, self)  {
        var stepAcceleration = 0, i;

        self.direction = deltaY > 0 ? self.direction = 'down' : self.direction = 'up';
        self.delta = Math.abs(deltaY);

        clearTimeout(self.timer);

        self.timer = setTimeout(function() {
            self.last5values = [ 0, 0, 0, 0, 0 ];
            self.memoryAcceleration = [ 0, 0 , 0 ];
            self.isStopped = true;
            self.isAcceleration = false;
        }, 200);

        if(self.isStopped) {
            triggerEvent(self);
            self.isStopped = false;
            self.isAcceleration = true;
            stepAcceleration = 1;

            self.memoryAcceleration.shift();
            self.memoryAcceleration.push(stepAcceleration);
        } else {
            self.last5values.shift();
            self.last5values.push(self.delta);

            for(i = 5; i--; i == 1) {
                if(self.last5values[i - 1] < self.last5values[i]) {
                    stepAcceleration++;
                }
            }

            self.memoryAcceleration.shift();
            self.memoryAcceleration.push(stepAcceleration);

            if( (self.memoryAcceleration[2] < self.memoryAcceleration[1]) &&
                (self.memoryAcceleration[1] < self.memoryAcceleration[0])) {
                //Произошло затухание
                self.isAcceleration = false;
            }

            if( (self.memoryAcceleration[2] > self.memoryAcceleration[1]) &&
                (self.memoryAcceleration[1] > self.memoryAcceleration[0])) {
                //Произошло ускорение
                if(!self.isAcceleration) {
                    self.isAcceleration = true;
                    triggerEvent(self);
                }
            }
        }
    }

    function addEvent(elem, type, handler){
        if(window.addEventListener) {
            elem.addEventListener(type, handler, false);
        }
        if(window.attachEvent) {
            elem.attachEvent('on' + type, handler);
        }
    }

    return Module;
}());

export default WheelIndicator;
