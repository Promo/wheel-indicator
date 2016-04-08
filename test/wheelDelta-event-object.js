/* global describe, it, global */

'use strict';

require('should');

describe('wheelDelta event object', function() {
    var testData = {
            down: {
                moves: [ 'down' ],
                delta: [ -120 ],
                device: 'Mac OSX opera 30 | notebook trackpad'
            }
        },
        currentDeltaArr;

    global.window = {
        addEventListener: function(){}
    };

    global.document = {
        addEventListener: function(type, handler){
            currentDeltaArr.forEach(function(delta){
                handler({
                    //ie contain wheelDelta instead of deltaY
                    wheelDelta: delta
                });
            });
        }
    };

    delete require.cache[require.resolve('../lib/wheel-indicator')];
    var WheelIndicator = require('../lib/wheel-indicator');

    Object.keys(testData).forEach(function(key){
        var test = testData[key],
            result = [];

        currentDeltaArr = test['delta'];

        new WheelIndicator({
            elem: document,
            callback: function(e){
                result.push(e.direction);
            }
        });

        it('Test: ' + key + ', Env: ' + test.device + ', moves: ' + test['moves'], function () {
            result.should.be.eql(test['moves']);
        });
    });

    global.document = {
        addEventListener: function(type, handler){
            currentDeltaArr.forEach(function(delta){
                handler({
                    //ie contain wheelDelta instead of deltaY
                    deltaY: delta
                });
            });
        }
    };

    delete require.cache[require.resolve('../lib/wheel-indicator')];
    WheelIndicator = require('../lib/wheel-indicator');
});
