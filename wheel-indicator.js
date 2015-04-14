(function() {
    // console.log('mousewheel' in document);
    // console.log('onwheel' in document);
    // console.log('onmousewheel' in document);

    // console.log('wheel' in document);
    // console.log('DOMMouseScroll' in document);
    // console.log('MozMousePixelScroll' in document);
    
    // console.log('mousewheel' in document);

    var wheelIndicator = {
        last5values: [ 0, 0, 0, 0, 0 ],
        memoryAcceleration: [ 0, 0 , 0 ],
        isAcceleration: false,
        isStopped: true,
        direction: '',
        delta: '',
        timer: '',
        eventWheel: 'onwheel' in document ? 'wheel' : 'mousewheel',

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
                wheelIndicator.getDeltaY = function(event) {
                    return event.wheelDelta / -120;
                }
            } else {
                wheelIndicator.getDeltaY = function(event) {
                    return event.deltaY;
                }
            }
            return wheelIndicator.getDeltaY(event);
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
            this.direction === 'up' ? $(document).trigger('scrollUp') : $(document).trigger('scrollDown');
        }
    };

    wheelIndicator.addEvent(document, wheelIndicator.eventWheel, function(event) {
        wheelIndicator.processDelta(wheelIndicator.getDeltaY(event));
    });
}());