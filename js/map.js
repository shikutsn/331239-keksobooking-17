'use strict';

(function () {
  // TODO: пройтись по замечаниям Вадима из readme.md от 29.07. Поискать подобные случаи и их фикс
  var PinData = {
    MAX_COUNT: 5,
    SIZE: {
      WIDTH: 50,
      HEIGHT: 70
    }
  };
  var MainPinData = {
    SIZE: {
      ACTIVE: {
        WIDTH: 65,
        HEIGHT: 65
      },
      INACTIVE: {
        WIDTH: 65,
        HEIGHT: 84
      }
    },
    COORD_LIMITS: {
      ABSCISS: {
        MIN: 0,
        MAX: 1200
      },
      ORDINATE: {
        MIN: 130,
        MAX: 630
      }
    },
    DEFAULT_STYLE: 'left: 570px; top: 375px;'
  };
  var DisabledCls = {
    MAP: 'map--faded',
    AD_FORM: 'ad-form--disabled'
  };

  var renderPin = function (pin, template) {
    var pinEl = template.cloneNode(true);
    var pinImgEl = pinEl.querySelector('img');

    pinEl.style.left = pin.location.x - PinData.SIZE.WIDTH / 2 + 'px';
    pinEl.style.top = pin.location.y - PinData.SIZE.HEIGHT + 'px';
    pinImgEl.src = pin.author.avatar;
    pinImgEl.alt = pin.offer.title;

    return pinEl;
  };

  var fillFragment = function (pins, template) {
    var fragment = document.createDocumentFragment();

    pins.forEach(function (currentPin) {
      fragment.appendChild(renderPin(currentPin, template));
    });

    return fragment;
  };

  var renderMapPins = function (pins) {
    var pinsWithOffer = pins.filter(function (pin) {
      return 'offer' in pin;
    });
    var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
    var fragment = fillFragment(pinsWithOffer.slice(0, PinData.MAX_COUNT), pinTemplate);
    var pinsEl = document.querySelector('.map__pins');

    pinsEl.appendChild(fragment);
  };

  var clearCurrentPins = function () {
    document.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (currentPin) {
      currentPin.remove();
    });
  };

  var mapEl = document.querySelector('.map');
  var adFormEl = document.querySelector('.ad-form');
  var addressEl = adFormEl.querySelector('#address');
  var adFormInnerEls = Array.from(adFormEl.children);
  var filtersFormEl = document.querySelector('.map__filters');
  var filtersFormInnerEls = Array.from(filtersFormEl.children);
  var mainPinEl = mapEl.querySelector('.map__pin--main');

  var setFiltersFormActive = function (filtersFormState) {
    return filtersFormState ? filtersFormInnerEls.forEach(window.util.enableElement) : filtersFormInnerEls.forEach(window.util.disableElement);
  };

  var setMapActive = function (mapState) {
    var activateMap = function () {
      mapEl.classList.remove(DisabledCls.MAP);
      adFormEl.classList.remove(DisabledCls.AD_FORM);
      adFormInnerEls.forEach(window.util.enableElement);
      window.validation.init();
    };

    var deactivateMap = function () {
      mapEl.classList.add(DisabledCls.MAP);
      adFormEl.classList.add(DisabledCls.AD_FORM);
      adFormInnerEls.forEach(window.util.disableElement);
      window.data.reset();
    };

    return mapState ? activateMap() : deactivateMap();
  };

  var onLoadingSuccess = function (pins) {
    setFiltersFormActive(true);
    window.data.set(pins);
    renderMapPins(pins);
  };

  var fillAddressField = function (addressFieldEl, pinEl, isMapActive) {
    var addressX = isMapActive ? pinEl.offsetLeft + MainPinData.SIZE.ACTIVE.WIDTH / 2 : pinEl.offsetLeft + MainPinData.SIZE.INACTIVE.WIDTH / 2;
    var addressY = isMapActive ? pinEl.offsetTop + MainPinData.SIZE.ACTIVE.HEIGHT : pinEl.offsetTop + MainPinData.SIZE.INACTIVE.HEIGHT;
    addressFieldEl.value = Math.round(addressX) + ', ' + addressY;
  };

  var resetMainPin = function () {
    mainPinEl.style = MainPinData.DEFAULT_STYLE;
    fillAddressField(addressEl, mainPinEl, false);
  };

  var Rect = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  };

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  var PinCoordinate = function (x, y, constraints) {
    Coordinate.call(this, x, y);
    this._constraints = constraints;
  };
  PinCoordinate.prototype = Object.create(Coordinate.prototype);

  PinCoordinate.prototype.setCoord = function (x, y) {
    var setSingleCoord = function (coord, minValue, maxValue) {
      if (coord < minValue) {
        return minValue;
      }
      if (coord > maxValue) {
        return maxValue;
      }
      return coord;
    };

    this.x = setSingleCoord(x, this._constraints.left, this._constraints.right);
    this.y = setSingleCoord(y, this._constraints.top, this._constraints.bottom);
  };

  var coordRect = new Rect(MainPinData.COORD_LIMITS.ABSCISS.MIN - Math.round(MainPinData.SIZE.ACTIVE.WIDTH / 2), MainPinData.COORD_LIMITS.ORDINATE.MIN, MainPinData.COORD_LIMITS.ABSCISS.MAX - Math.round(MainPinData.SIZE.ACTIVE.WIDTH / 2), MainPinData.COORD_LIMITS.ORDINATE.MAX);

  mainPinEl.addEventListener('mousedown', function (evt) {
    if (mapEl.classList.contains(DisabledCls.MAP)) {
      setMapActive(true);
    }
    var startCoord = new Coordinate(evt.clientX, evt.clientY);
    var pinStartCoord = new Coordinate(mainPinEl.offsetLeft, mainPinEl.offsetTop);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftCoord = new Coordinate(moveEvt.clientX - startCoord.x, moveEvt.clientY - startCoord.y);

      var newPinCoord = new PinCoordinate(0, 0, coordRect);
      newPinCoord.setCoord(pinStartCoord.x + shiftCoord.x, pinStartCoord.y + shiftCoord.y);

      mainPinEl.style.left = newPinCoord.x + 'px';
      mainPinEl.style.top = newPinCoord.y + 'px';

      fillAddressField(addressEl, mainPinEl, true);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (!window.data.isLoaded()) {
        window.backend.download(onLoadingSuccess, window.adForm.showErrorPopup);
      }

      fillAddressField(addressEl, mainPinEl, true);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  fillAddressField(addressEl, mainPinEl, false);

  window.map = {
    renderPins: renderMapPins,
    clearCurrentPins: clearCurrentPins,
    setActive: setMapActive,
    resetMainPin: resetMainPin
  };
})();
