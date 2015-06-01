/* global describe, it, global */

'use strict';

require('should');

describe('Methods', function(){
    before(function(){
        delete require.cache[require.resolve('../lib/wheel-indicator')];
        global.document = {
            addEventListener: function(type, handler){
                setTimeout(function(){
                    handler({
                        deltaY: testData.down.delta
                    });
                }, 0);
            }
        };
        var WheelIndicator = require('../lib/wheel-indicator')
    });

    var testData = {
            down: {
                moves: [ 'down' ],
                delta: [ 0.025,0.225,0.675,1.75,2.2,3.4,3.475,4.275,3.65,7.3,6.625,6.075,5.6,5.225,4.875,4.6,4.325,4.191666666666666,4.066666666666666,3.95,3.775,3.65,3.575,3.4,3.3,3.15,3.025,2.925,5.475,2.55,2.45,2.325,2.225,2.091666666666667,1.975,1.85,1.75,1.625,1.525,1.425,1.35,1.25,1.15,1.0416666666666667,0.975,0.9,0.825,0.775,0.675,0.625,0.575,0.5166666666666667,0.475,0.45,0.4,0.375,0.325,0.3,0.275,0.25,0.225,0.2,0.175,0.175,0.15,0.125,0.125,0.1,0.1,0.1,0.075,0.075,0.075,0.05,0.05,0.05,0.05,0.025,0.025,0.025,0.025,0.025,0.025,0.025,0.025,0.025,0.025,0.025,0.025,0.025 ],
                device: 'Mac OSX notebook trackpad'
            }
        };

    global.window = {
        addEventListener: function(){}
    };

    global.document = {
        addEventListener: function(type, handler){
            setTimeout(function(){
                handler({
                    deltaY: testData.down.delta
                });
            }, 0);
        }
    };

    delete require.cache[require.resolve('../lib/wheel-indicator')];

    var WheelIndicator = require('../lib/wheel-indicator'),
        result = [];

    it('Correct working of turnOff()', function (done) {
        var indicator = new WheelIndicator({
            elem: document,
            callback: function(){
                result.push('Happened');
            }
        });

        indicator.turnOff();

        setTimeout(function(){
            result.should.be.eql([]);
            done();
        }, 0);
    });

    it('Correct working of turnOn()', function (done) {
        var indicator = new WheelIndicator({
            elem: document,
            callback: function(){
                result.push('Happened');
            }
        });

        indicator
            .turnOff()
            .turnOn();

        setTimeout(function(){
            result.should.be.eql(['Happened']);
            done();
        }, 0);
    });

    it('Correct working of setOptions() and getOption()', function (done) {
        var indicator = new WheelIndicator({
            elem: document,
            preventMouse: true,
            callback: function(){ throw new Error('Not supposed to happen'); }
        });

        indicator.setOptions({
            preventMouse: false,
            callback: function(){}
        });

        setTimeout(function(){
            indicator.getOption('preventMouse').should.be.eql(false);

            done();
        }, 0);
    });
});
