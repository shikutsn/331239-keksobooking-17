'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var ESC_KEYCODE = 27;

  // случайное целое число из полуинтервала [min, max)
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

  // FIXME: нужно ли оно в кексобукинге?
  var getRandomArrayElement = function (arr) {
    return arr[getRandomNumber(0, arr.length)];
  };

  var disableElement = function (element) {
    element.disabled = true;
  };

  var enableElement = function (element) {
    element.disabled = false;
  };

  // перемешивание алгоритмом Фишера — Йетса
  // TODO: а понадобится ли оно?
  var shuffleArray = function (arr) {
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

  var isEscPressed = function (evt) {
    return evt.keyCode === ESC_KEYCODE;
  };

  // number - число, endings - окончания для 1, 4, 5 штук этих объектов
  var getPluralNoun = function (number, endings) {
    var currentEnding;
    var i;
    number = number % 100;
    if (number >= 11 && number <= 19) {
      currentEnding = endings[2];
    } else {
      i = number % 10;
      switch (i) {
        case (1): currentEnding = endings[0]; break;
        case (2):
        case (3):
        case (4): currentEnding = endings[1]; break;
        default: currentEnding = endings[2];
      }
    }
    return currentEnding;
  };

  window.util = {
    getRandomNumber: getRandomNumber,
    getRandomArrayElement: getRandomArrayElement,
    disableElement: disableElement,
    enableElement: enableElement,
    shuffleArray: shuffleArray,
    debounce: debounce,
    isEscPressed: isEscPressed,
    getPluralNoun: getPluralNoun
  };
})();
