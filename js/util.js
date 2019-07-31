'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;
  var ESC_KEYCODE = 27;

  var disableElement = function (element) {
    element.disabled = true;
  };

  var enableElement = function (element) {
    element.disabled = false;
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
    disableElement: disableElement,
    enableElement: enableElement,
    debounce: debounce,
    isEscPressed: isEscPressed,
    getPluralNoun: getPluralNoun
  };
})();
