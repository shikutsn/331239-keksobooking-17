'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

  var getRandomNumber = function (min, max) {
    // случайное целое число из полуинтервала [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  };

  var getRandomArrayElement = function (arr) {
    return arr[getRandomNumber(0, arr.length)];
  };

  var shuffleArray = function (arr) {
    // перемешивание алгоритмом Фишера — Йетса
    var result = arr.slice();
    for (var i = result.length - 1; i > 0; i--) {
      var j = getRandomNumber(0, i + 1);
      var tmp = result[j];
      result[j] = result[i];
      result[i] = tmp;
    }
    return result;
  };

  var debounce = function (debouncedAction) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        debouncedAction.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomArrayElement: getRandomArrayElement,
    shuffleArray: shuffleArray,
    debounce: debounce
  };

})();
