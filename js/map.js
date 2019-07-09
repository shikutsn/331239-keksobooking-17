'use strict';

(function () {
  var PinPointerOffset = {
    X: -25,
    Y: -70
  };
  var MainPinPointerOffset = {
    X: -31,
    Y: -84 // проверить 80 или 84. Думаю, что 84 (картинка 62 и стрелка еще 22)
  };


  var getAdjustedPinCoords = function (coord) {
    var result = coord;
    result.x += PinPointerOffset.X;
    result.y += PinPointerOffset.Y;
    return result;
  };

  var renderPin = function (pin, template) {
    var pinEl = template.cloneNode(true);
    var adjustedCoords = getAdjustedPinCoords(pin.location);

    pinEl.style.left = adjustedCoords.x + 'px';
    pinEl.style.top = adjustedCoords.y + 'px';
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
    var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
    var fragment = fillFragment(pins, pinTemplate);
    var pinsEl = document.querySelector('.map__pins');

    pinsEl.appendChild(fragment);
  };

  var mapEl = document.querySelector('.map');
  var adFormEl = document.querySelector('.ad-form');
  var adFormFieldsetsEls = adFormEl.querySelectorAll('fieldset');
  var filtersFormEl = document.querySelector('.map__filters');
  var filtersFormSelectEls = filtersFormEl.querySelectorAll('select');
  var filtersFormFieldsetEls = filtersFormEl.querySelectorAll('fieldset');

  // больно много в этих двух функциях однотипного кода. Упростить?
  // типа мапы, которая будет подменять add на remove?
  var setMapInactive = function () {
    mapEl.classList.add('map--faded');
    adFormEl.classList.add('ad-form--disabled');
    adFormFieldsetsEls.forEach(function (it) {
      it.disabled = true;
    });
    filtersFormSelectEls.forEach(function (it) {
      it.disabled = true;
    });
    filtersFormFieldsetEls.forEach(function (it) {
      it.disabled = true;
    });
  };

  // почему эллипс вокруг главного пина не уменьшается до 62х62?
  var setMapActive = function () {
    mapEl.classList.remove('map--faded');
    adFormEl.classList.remove('ad-form--disabled');
    adFormFieldsetsEls.forEach(function (it) {
      it.disabled = false;
    });
    filtersFormSelectEls.forEach(function (it) {
      it.disabled = false;
    });
    filtersFormFieldsetEls.forEach(function (it) {
      it.disabled = false;
    });
  };


  window.map = {
    renderMapPins: renderMapPins,
    setMapActive: setMapActive,
    setMapInactive: setMapInactive
  };
})();
