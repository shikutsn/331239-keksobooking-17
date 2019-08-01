'use strict';

(function () {
  // TODO: пройтись по замечаниям Вадима из readme.md от 29.07. Поискать подобные случаи и их фикс
  // TODO а вообще, интересная тема - вынести функции по переключению режимов страницы в отдельный модуль
  // TODO и другая интересная тема - манипуляции с mainPin тоже вынести в отдельный модуль
  var PinData = {
    MAX_COUNT: 5,
    SIZE: {
      WIDTH: 50,
      HEIGHT: 70
    },
    COORD: {
      ABSCISS: {
        MIN: 0,
        MAX: 1200
      },
      ORDINATE: {
        MIN: 130,
        MAX: 630
      }
    }
  };
  var MainPinSize = {
    MAP_ACTIVE: {
      WIDTH: 65,
      HEIGHT: 65
    },
    MAP_INACTIVE: {
      WIDTH: 65,
      HEIGHT: 84
    }
  };
  var MAIN_PIN_DEFAULT_STYLE = 'left: 570px; top: 375px;';
  // TODO эти константы надо переделать, логика работы функции (раз)блокировки карты сильно эволюционировала
  // var BlockStates = {
  //   ACTIVE: 'active',
  //   INACTIVE: 'inactive'
  // };
  // var BlockStatesMap = {
  //   'active': {
  //     styleAction: 'remove',
  //     elementsAction: window.util.enableElement
  //   },
  //   'inactive': {
  //     styleAction: 'add',
  //     elementsAction: window.util.disableElement
  //   }
  // };
  var DISABLED_MAP_CLS = 'map--faded';
  var DISABLED_AD_FORM_CLS = 'ad-form--disabled';

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
    if (filtersFormState) {
      filtersFormInnerEls.forEach(window.util.enableElement);
    } else {
      filtersFormInnerEls.forEach(window.util.disableElement);
    }
  };

  var setMapActive = function (mapState) {
    if (mapState) {
      mapEl.classList.remove(DISABLED_MAP_CLS);
      adFormEl.classList.remove(DISABLED_AD_FORM_CLS);
      adFormInnerEls.forEach(window.util.enableElement);
      window.validation.init();
    } else {
      mapEl.classList.add(DISABLED_MAP_CLS);
      adFormEl.classList.add(DISABLED_AD_FORM_CLS);
      adFormInnerEls.forEach(window.util.disableElement);
      window.data.reset();
    }
  };

  var onLoadingSuccess = function (pins) {
    setFiltersFormActive(true);
    window.data.set(pins);
    renderMapPins(pins);
  };

  var fillAddressField = function (addressFieldEl, pinEl, isMapActive) {
    var addressX = isMapActive ? pinEl.offsetLeft + MainPinSize.MAP_ACTIVE.WIDTH / 2 : pinEl.offsetLeft + MainPinSize.MAP_INACTIVE.WIDTH / 2;
    var addressY = isMapActive ? pinEl.offsetTop + MainPinSize.MAP_ACTIVE.HEIGHT : pinEl.offsetTop + MainPinSize.MAP_INACTIVE.HEIGHT;
    addressFieldEl.value = Math.round(addressX) + ', ' + addressY;
  };

  var resetMainPin = function () {
    mainPinEl.style = MAIN_PIN_DEFAULT_STYLE;
    fillAddressField(addressEl, mainPinEl, false);
  };

  mainPinEl.addEventListener('mousedown', function (evt) {
    if (mapEl.classList.contains(DISABLED_MAP_CLS)) {
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
      // TODO объект boundaries?
      // см лекцию 8, 50мин. Там про объекты, конструкторы, методы прототипов. Мб стоит демку там же посмотреть, даже точно стоит!
      // TODO а вообще, двигается плохо - если мышка двигается из-за границы карты, то пин ползает, не будучи привязанным к курсору мыши. Так же было в кекстаграме
      if (newCoord.x < PinData.COORD.ABSCISS.MIN) {
        newCoord.x = PinData.COORD.ABSCISS.MIN;
      }
      // TODO: cделать так, чтобы поведение перетаскивания метки было как в фильтре кекстаграмма
      // запоминаем ""коорд мыши"", запоминаем коорд пина
      // на маузмуве:
      // записываем координаты смещения (shiftCoord)
      // от коорд пина отнимаем коорд смещения
      // перезаписываем ""коорд мыши""
      // меняем координаты пина (стили): если меньше ограничителя снизу, то равно ему, если больше огр сверху, то равно ему
      // иначе равно координатам пина
      if (newCoord.x > PinData.COORD.ABSCISS.MAX - MainPinSize.MAP_ACTIVE.WIDTH) {
        newCoord.x = PinData.COORD.ABSCISS.MAX - MainPinSize.MAP_ACTIVE.WIDTH;
      }
      if (newCoord.y < PinData.COORD.ORDINATE.MIN) {
        newCoord.y = PinData.COORD.ORDINATE.MIN;
      }
      if (newCoord.y > PinData.COORD.ORDINATE.MAX) {
        newCoord.y = PinData.COORD.ORDINATE.MAX;
      }
      mainPinEl.style.left = newCoord.x + 'px';
      mainPinEl.style.top = newCoord.y + 'px';

      fillAddressField(addressEl, mainPinEl, true);

      startCoord = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
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
