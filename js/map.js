'use strict';

(function () {
  var PinPointerOffset = {
    X: 25,
    Y: 70
  };
  var MainPinPointerOffset = {
    X: 31,
    Y: 42
  };


  var renderPin = function (pin, template) {
    var pinEl = template.cloneNode(true);

    pinEl.style.cssText = 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;';
    pinEl.src = pin.author.avatar;
    pinEl.alt = 'заголовок объявления';

    return pinEl;
  };

  var fillFragment = function (pins, template) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < pins.length; i++) {
      fragment.appendChild(renderPin(pins[i], template));
    }

    return fragment;
  };

  var renderMapPins = function (pins) {
    // пока что нет поправки на ширину пинов
    var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
    var fragment = fillFragment(pins, pinTemplate);
    var pinsEl = document.querySelector('.map__pins');

    pinsEl.appendChild(fragment);
  };


  window.map = {
    renderMapPins: renderMapPins
  };
})();
