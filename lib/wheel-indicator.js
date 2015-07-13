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
        this._browser = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident)/ig)[0] || 'Chrome';
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

        console.log(this._browser);

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

        //есть необходимость блочить возможные события в фф, так как отдает данные очень похожие на новое событие сразу
        //после нового события
        this._lastEvent = 100;
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

        this._lastEvent -= timeOut;
        if(this._lastEvent > 0) {

            return writeLog.call(self, delta, timeOut, nowTime);
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

                    event.scheme = '1: change direction';
                    triggerEvent.call(self, event);
                    return writeLog.call(self, delta, timeOut, nowTime);
                }
            } else {
                //иначе просто записываем в лог без действий
                //console.log('return');
                return writeLog.call(self, delta, timeOut, nowTime);
            }
        }


        //console.log(dir);

        if(delta > 0) {
            this._direction = 'down';
        } else {
            this._direction = 'up';
        }

        clearTimeout(self._timer);


        var maxTimeOut = ({ Chrome: 100, Firefox: 150 })[self._browser];


        if(timeOut  > maxTimeOut) {

            event.scheme = '1: new impuls';
            triggerEvent.call(self, event);

            console.info('timeOut - ', timeOut);
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



        //не бывает двух ускорений подряд
        if(timeOut === -1 || self._timesArray[l - 1] === -1 || self._timesArray[l - 2] === -1) {
            console.log('ahtung');
            console.log(delta + ' - '+ timeOut + '   -> ' + counter);
            return writeLog.call(self, delta, timeOut, nowTime);
        }

        var
            dc = Math.abs(delta),
            d1 = Math.abs(self._deltaArray[l - 1]),
            d2 = Math.abs(self._deltaArray[l - 2]),
            d3 = Math.abs(self._deltaArray[l - 3]),
            d4 = Math.abs(self._deltaArray[l - 4]),

            tc = Math.abs(timeOut),
            t1 = Math.abs(self._timesArray[l - 1]),
            t2 = Math.abs(self._timesArray[l - 2]),
            t3 = Math.abs(self._timesArray[l - 3]),
            t4 = Math.abs(self._timesArray[l - 4]);

        var counter = 0;
        

        if(self._browser === 'Firefox') {

            if(l > 4) {

                    if((d2 < d1 && d2 < d3) || (t2 > t1 && t2 > t3)) {


                        //!!!
                        if((t2 > t1 && t2 > t3) && (d2 < d1 && d2 < d3)) {
                            event.scheme = '1: base condition';
                            counter = 6;


                            //блоккер 1
                            //d4 "41 - 45
                            //d3 "11 - 14
                            //d2 "10 - 33
                            //d1 "18 - 26
                            //dc "8 - 8

                            //не влияет на тесты
                            if((d3 - d2 <= 3) && (d2 >= 10)){
                                counter = 0;
                            }

                            //блоккер 2
                            //d4 "4 - 3
                            //d3 "4 - 18
                            //d2 "3 - 28
                            //d1 "6 - 23
                            //dc "2 - 15

                            //влияет на тесты
                            if((dc < 10) && (d1 < 10) && (d2 < 10) && (d3 < 10) && (d4 < 10)) {
                                counter = 0;
                            }

                            //блоккер 3
                            //d4 12 - 11
                            //d3 6 - 6
                            //d2 5 - 13
                            //d1 11 - 4
                            //dc 6 - 14

                            //влияет на тесты
                            if((d2 > 2) && (d3 / d2 < 5) && (d4 / d3 < 2)) {
                                counter = 0;
                            }
                        }


                        if(d2 < d1 && d2 < d3) {


                            //d4 "91 - 11
                            //d3 "157 - 43
                            //d2 "4 - 24
                            //d1 "41 - 8
                            //dc "383 - 26

                            //не влияет на тесты
                            //if((t2 > t1 || t2 > t3) && (dc > d1) && (d1 / d2 > 5)) {
                            //    counter = 6;
                            //    event.scheme = '71: base condition';
                            //}

                            // кто мне скажет, что делать с этим пиздецом?
                            //d4 "10 - 3
                            //d3 "17 - 38
                            //d2 "1 - 30
                            //d1 "53 - 33
                            //dc "70 - 18

                            //не влияет на тесты
                            //if((t3 / t2 < 2 || t1 / t2 < 2) && (dc > d1)) {
                            //    event.scheme = '77: base condition';
                            //}



                            //d4 "29 - 14
                            //d3 "25 - 41
                            //d2 "2 - 17
                            //d1 "44 - 33
                            //dc "26 - 1

                            //не влияет на тесты
                            //if((d3 - d2 > 20 && d1 - d2 > 20) && (d2 < 10) && (d4 > d3)){
                            //    event.scheme = '99: base condition';
                            //}


                            //d4 "4 - 1
                            //d3 "4 - 37
                            //d2 "1 - 21
                            //d1 "3 - 13
                            //dc "5 - 3

                            //d4 "2 - 11
                            //d3 "2 - 18
                            //d2 "3 - 33
                            //d1 "1 - 15
                            //dc "2 - 34

                            if(
                                (t2 > t1 || t2 > t3) && (dc > d1) && (d2 < d1 || d2 < d3)

                            ) {
                                counter = 6
                                event.scheme = '2: base condition';

                                //блоккер 1
                                //d4 2 - 3
                                //d3 5 - 6
                                //d2 3 - 10
                                //d1 4 - 6
                                //dc 5 - 11

                                //не влияет на тесты
                                //if (dc > 10 || d1 > 10 || d2 > 10 || d3 > 10 || d4 > 10) {
                                //    counter = 0
                                //}


                                //блоккер 2
                                //d4 8 - 11
                                //d3 15 - 2
                                //d2 11 - 14
                                //d1 18 - 3
                                //dc 19 - 26
                                //влияет на тесты
                                if ((d2 > 2) && (d3 / d2 < 5) && (d4 / d3 < 2)) {
                                    counter = 0
                                }
                            }

                            //d4 "96 - 45
                            //d3 "42 - 13
                            //d2 "1 - 22
                            //d1 "47 - 30
                            //dc "46 - 12

                            //не влияет на тесты
                            //if((t2 > t1 || t2 > t3) && ((d4 / d2 > 5) && (d3 / d2 > 5) && (d1 / d2 > 5) && (dc / d2 > 5))) {
                            //    counter = 6
                            //    event.scheme = '3: base condition';
                            //}

                            // d4 "15 - 9
                            // d3 "13 - 39
                            // d2 "1 - 27
                            // d1 "70 - 31
                            // dc "53 - 15

                            //не влияет на тесты
                            //if((t3 - t2 < 15 && t1 - t2 < 15) && (d3 / d2 > 5 && d1 / d2 > 5)) {
                            //    counter = 6
                            //    event.scheme = '4: base condition';
                            //}

                            //d4 "16 - 8
                            //d3 "15 - 56
                            //d2 "1 - 51
                            //d1 "26 - 27
                            //dc "31 - 13

                            //не влияет на тесты
                            //if(
                            //    (t2 > t1 || t2 > t3) && ((d4 > d3) && (dc > d1) && (d1 > d2)) &&
                            //    // !при такой отрабатывает лишний триггер
                            //    //d4 "1 - 8
                            //    //d3 "3 - 29
                            //    //d2 "2 - 14
                            //    //d1 "3 - 5
                            //    //dc "4 - 14
                            //    (d3 > 10 || d2 > 10 || d1 > 10 || dc > 10)
                            //) {
                            //    counter = 6
                            //    event.scheme = '5: base condition';
                            //}

                        }

                        if(t2 > t1 && t2 > t3) {


                            //d4 "8 - 18
                            //d3 "15 - 33
                            //d2 "1 - 101
                            //d1 "1 - 8
                            //dc "8 - 30
                            //влияет на тесты
                            if(
                                (d2 === d1) && (d3 > d2) && ((t2 / t1 > 2) && (t2 / t3 > 2)) &&
                                //блоккер
                                //d4 2 - 30
                                //d3 2 - 1
                                //d2 1 - 27
                                //d1 1 - 7
                                //dc 1 - 16
                                (dc > 10 || d1 > 10 || d2 > 10 || d3 > 10 || d4 > 10)
                            ) {

                                counter = 6
                                event.scheme = '7: base condition';

                            }


                            //d4 "15 - 12
                            //d3 "13 - 28
                            //d2 "1 - 48
                            //d1 "1 - 2
                            //dc "1 - 7
                            //влияет на тесты
                            if(
                                (d2 === d1) && (d3 > d2) && ((t2 > t1) && (t2 > t3)) && ((t2 / t1 > 5) || (t2 / t3 > 5)) &&
                                //блокирующее условие
                                //d4 7 - 17
                                //d3 7 - 15
                                //d2 6 - 30
                                //d1 6 - 4
                                //dc 5 - 25
                                (dc > 10 || d1 > 10 || d2 > 10 || d3 > 10 || d4 > 10)


                            ) {

                                counter = 6
                                event.scheme = '88: base condition';

                                //блокирующее условие
                                //d4 "11 - 18
                                //d3 "9 - 15
                                //d2 "8 - 30
                                //d1 "8 - 4
                                //dc "7 - 32

                                if(d2 > 3 && d3 / d2 < 2 && d4 / d3 < 2) {
                                    counter = 0;
                                }
                            }
                        }
                    }


                console.log(delta + ' - '+ timeOut + '   -> ' + counter);

                if((counter > 4 && d2 < 15)) {

                    console.log('!! ', event.scheme);
                    triggerEvent.call(self, event);
                    breakPoint = true;

                }

            }

        }

        if(self._browser === 'Chrome') {
            // 6 - 5
            // 5 - 58
            // 9 - 1

            if(l > 2) {
                //опрелеляем направление

                if( ((dc > d1 ) && (d2 > d1 )) && // (текущая дельта больше последней) и (предпоследняя дельта больше последней)
                    ((tc < t1) && (t2 < t1)) ) { // (текущий тайм-аут меньше последнего) и (предпоследний тайм-аут меньше последнего)
                    //  блокирующие проверки
                    //  1. Минимальное значение дельты не должно быть больше 15
                    //  2. Минимальный таймаут между 2-я последними тригерами должен быть не менее 20
                    //  3. Тригерим событие если только значение дельты не повторяется более 3 раз подрят
                    if(
                        (d1 < 15) &&
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
