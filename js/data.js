'use strict';

(function () {
  // FIX почистить мокдату
  var PinData = {
    COUNT: 8,
    ORDINATE: {
      MIN: 130,
      MAX: 630
    },
    ABSCISS: {
      MIN: 0,
      MAX: 1200
    }
  };

  var APARTMENT_TYPES = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];


  var getRandomPin = function (index) {
    return {
      author: {
        avatar: 'img/avatars/user0' + index + '.png'
      },
      offer: {
        type: APARTMENT_TYPES[window.util.getRandomNumber(0, APARTMENT_TYPES.length)]
      },
      location: {
        x: window.util.getRandomNumber(PinData.ABSCISS.MIN, PinData.ABSCISS.MAX + 1),
        y: window.util.getRandomNumber(PinData.ORDINATE.MIN, PinData.ORDINATE.MAX + 1)
      }
    };
  };

  var getPins = function (quantity) {
    var output = [];

    for (var i = 0; i < quantity; i++) {
      output.push(getRandomPin(i));
    }

    return output;
  };


  window.data = {
    // TODO разобраться с этим глобальным массивом (как в кекстаграме)
    pins: [],
    getMockData: function (onDataLoaded) {
      onDataLoaded(getPins(PinData.COUNT));
    }
  };
})();
