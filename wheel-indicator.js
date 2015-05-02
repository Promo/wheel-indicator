var WheelIndicator = (function() {
    // console.log('mousewheel' in document);
    // console.log('onwheel' in document);
    // console.log('onmousewheel' in document);

    // console.log('wheel' in document);
    // console.log('DOMMouseScroll' in document);
    // console.log('MozMousePixelScroll' in document);
    
    // console.log('mousewheel' in document);

    function Module(elem){
        this.last5values = [ 0, 0, 0, 0, 0 ];
        this.memoryAcceleration = [ 0, 0 , 0 ];
        this.isAcceleration = false;
        this.isStopped = true;
        this.direction = '';
        this.delta = '';
        this.timer = '';
        this.eventWheel = 'onwheel' in document ? 'wheel' : 'mousewheel';

        this.addEvent(elem, this.eventWheel, function(event) {
            this.processDelta(this.getDeltaY(event));
        }.bind(this));
    }

    Module.prototype = {
        Constructor: Module,

        addEvent: function(elem, type, handler){
            if(window.addEventListener) {
                elem.addEventListener(type, handler, false);
            }
            if(window.attachEvent) {
                elem.attachEvent('on' + type, handler);
            }
        },

        getDeltaY: function(event) {
            if(event.wheelDelta) {
                this.getDeltaY = function(event) {
                    return event.wheelDelta / -120;
                }
            } else {
                this.getDeltaY = function(event) {
                    return event.deltaY;
                }
            }
            return this.getDeltaY(event);
        },

        processDelta: function(deltaY)  {
            var self = this,
                stepAcceleration = 0, i;

            self.direction = deltaY > 0 ? direction = 'down' : direction = 'up';
            self.delta = Math.abs(deltaY);

            clearTimeout(self.timer);

            self.timer = setTimeout(function() {
                self.last5values = [ 0, 0, 0, 0, 0 ];
                self.memoryAcceleration = [ 0, 0 , 0 ];
                self.isStopped = true;
                self.isAcceleration = false;
            }, 200);

            if(self.isStopped) {
                self.triggerEvent();
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
                        self.triggerEvent();
                    }
                }
            }
        },

        triggerEvent: function() {
            var event = {};
            event.direction = this.direction === 'up' ? 'backward' : 'forward';
            this.callback(event);
        },

        on: function(cb){
            this.callback = cb || function(){};
        }
    };

    //var wheelIndicator = {
    //    last5values: [ 0, 0, 0, 0, 0 ],
    //    memoryAcceleration: [ 0, 0 , 0 ],
    //    isAcceleration: false,
    //    isStopped: true,
    //    direction: '',
    //    delta: '',
    //    timer: '',
    //    eventWheel: 'onwheel' in document ? 'wheel' : 'mousewheel',
    //
    //
    //};

    return Module;
}());