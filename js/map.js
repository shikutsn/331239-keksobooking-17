'use strict';

(function () {
  // TODO: пройтись по замечаниям Вадима из readme.md от 29.07. Поискать подобные случаи и их фикс
  var PINS_MAX_COUNT = 5;
  var PinPointerOffset = {
    X: -25,
    Y: -70
  };
  var MainPinPointerOffset = {
    X: -31,
    Y: -84 // проверить 80 или 84. Думаю, что 84 (картинка 62 и стрелка еще 22)
  };
  var MainPinPointerInitialOffset = {
    X: -31,
    Y: -31
  };
  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 84
  };
  var BlockStates = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  };
  var BlockStatesMap = {
    'active': {
      styleAction: 'remove',
      elementsAction: window.util.enableElement
    },
    'inactive': {
      styleAction: 'add',
      elementsAction: window.util.disableElement
    }
  };
  var DISABLED_MAP_CLS = 'map--faded';
  var DISABLED_AD_FORM_CS = 'ad-form--disabled';
  var PinData = {
    ORDINATE: {
      MIN: 130,
      MAX: 630
    },
    ABSCISS: {
      MIN: 0,
      MAX: 1200
    }
  };

  var getAdjustedPinCoords = function (coord) {
    return {
      x: coord.x + PinPointerOffset.X,
      y: coord.y + PinPointerOffset.Y
    };
  };

  var renderPin = function (pin, template) {
    var pinEl = template.cloneNode(true);
    var pinImgEl = pinEl.querySelector('img');
    var adjustedCoords = getAdjustedPinCoords(pin.location);

    pinEl.style.left = adjustedCoords.x + 'px';
    pinEl.style.top = adjustedCoords.y + 'px';
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
    var fragment = fillFragment(pinsWithOffer.slice(0, PINS_MAX_COUNT), pinTemplate);
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

  var setMapState = function (action) {
    mapEl.classList[BlockStatesMap[action].styleAction](DISABLED_MAP_CLS);
    adFormEl.classList[BlockStatesMap[action].styleAction](DISABLED_AD_FORM_CS);
    adFormInnerEls.forEach(BlockStatesMap[action].elementsAction);
  };

  var setFiltersFormState = function (action) {
    filtersFormInnerEls.forEach(BlockStatesMap[action].elementsAction);
  };

  var setMapActive = function (mapState) {
    return mapState ? setMapState(BlockStates.ACTIVE) : setMapState(BlockStates.INACTIVE);
  };

  var setFiltersFormActive = function (filtersFormState) {
    return filtersFormState ? setFiltersFormState(BlockStates.ACTIVE) : setFiltersFormState(BlockStates.INACTIVE);
  };

  var mainPinEl = mapEl.querySelector('.map__pin--main');

  var onLoadingError = function (errorMessage) {
    var mainEl = document.querySelector('main');
    var errorTemplateEl = document.querySelector('#error').content.querySelector('.error');
    var errorEl = errorTemplateEl.cloneNode(true);
    var errorTextEl = errorEl.querySelector('.error__message');
    errorTextEl.textContent = errorMessage;
    mainEl.appendChild(errorEl);
    var errorPopupCloseBtnEl = errorEl.querySelector('.error__button');

    var removeErrorPopup = function () {
      mainEl.removeChild(errorEl);
      errorPopupCloseBtnEl.removeEventListener('click', onErrorPopupClose);
      document.removeEventListener('click', onErrorPopupClose);
      document.removeEventListener('keydown', onErrorEscPress);
    };

    var onErrorPopupClose = function () {
      removeErrorPopup();
    };

    var onErrorEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeErrorPopup();
      }
    };

    document.addEventListener('click', onErrorPopupClose);
    document.addEventListener('keydown', onErrorEscPress);
  };

  var onLoadingSuccess = function (pins) {
    setFiltersFormActive(true);
    window.data.set(pins);
    renderMapPins(pins);
  };

  var fillAddress = function (pin, offset) {
    // заполняет поле адреса, вычитая смещение из ДОМ-координат
    // 1) если брать координаты адреса из координат ДОМ-элемента, то смещение надо вычитать
    // 2) если же из координат адреса делать ДОМ-координаты, то смещение прибавлять
    // потому что изначальное смещение - отрицательное, то есть для случая (2)
    addressEl.value = (pin.offsetLeft - offset.X) + ', ' + (pin.offsetTop - offset.Y);
  };

  // первоначальное заполнение поля адреса при еще неактивной странице
  // в начале же он круглый, поэтому там другие смещения
  fillAddress(mainPinEl, MainPinPointerInitialOffset);

  mainPinEl.addEventListener('mousedown', function (evt) {
    if (mapEl.classList.contains(DISABLED_MAP_CLS)) {
      window.backend.download(onLoadingSuccess, onLoadingError);
      setMapActive(true);
    }

    var startCoord = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftCoord = {
        x: moveEvt.clientX - startCoord.x,
        y: moveEvt.clientY - startCoord.y
      };

      var newCoord = {
        x: mainPinEl.offsetLeft + shiftCoord.x,
        y: mainPinEl.offsetTop + shiftCoord.y
      };

      // TODO упростить расчеты координат
      if (newCoord.x < PinData.ABSCISS.MIN) {
        newCoord.x = PinData.ABSCISS.MIN;
      }
      if (newCoord.x > PinData.ABSCISS.MAX - MainPinSize.WIDTH) {
        newCoord.x = PinData.ABSCISS.MAX - MainPinSize.WIDTH;
      }
      if (newCoord.y < PinData.ORDINATE.MIN) {
        newCoord.y = PinData.ORDINATE.MIN;
      }
      if (newCoord.y > PinData.ORDINATE.MAX) {
        newCoord.y = PinData.ORDINATE.MAX;
      }
      mainPinEl.style.left = newCoord.x + 'px';
      mainPinEl.style.top = newCoord.y + 'px';

      fillAddress(mainPinEl, MainPinPointerOffset);

      startCoord = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      fillAddress(mainPinEl, MainPinPointerOffset);

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  setMapActive(false);
  setFiltersFormActive(false);

  window.map = {
    renderPins: renderMapPins,
    clearCurrentPins: clearCurrentPins
  };
})();
