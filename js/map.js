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
  var MainPinPointerInitialOffset = {
    X: -31,
    Y: -31
  };
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var MapStates = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
  };
  var MapStatesMap = {
    'active': {
      styleAction: 'remove',
      elementsAction: window.util.enableElement
    },
    'inactive': {
      styleAction: 'add',
      elementsAction: window.util.disableElement
    },
    'mapClass': 'map--faded',
    'formClass': 'ad-form--disabled'
  };

  var getAdjustedPinCoords = function (coord) {
    // подразумеваю, что в данных хранятся координаты, на которые указывает острие пина
    // соответственно, для вычисления координат самой кнопки нужно вычесть смещение
    var result = coord;
    result.x += PinPointerOffset.X;
    result.y += PinPointerOffset.Y;
    return result;
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

  // Удаляет пины - еще пригодится
  // function clearPins() {
  //   var mapPinEls = document.querySelectorAll('.map__pin:not(.map__pin--main)');
  //   mapPinEls.forEach(function (it) {
  //     it.remove();
  //   });
  // };


  var mapEl = document.querySelector('.map');
  var adFormEl = document.querySelector('.ad-form');
  var addressEl = adFormEl.querySelector('#address');
  var adFormInnerEls = Array.from(adFormEl.children);
  var filtersFormEl = document.querySelector('.map__filters');
  var filtersFormInnerEls = Array.from(filtersFormEl.children);

  var setMapState = function (action) {
    mapEl.classList[MapStatesMap[action].styleAction](MapStatesMap.mapClass);
    adFormEl.classList[MapStatesMap[action].styleAction](MapStatesMap.formClass);
    adFormInnerEls.forEach(MapStatesMap[action].elementsAction);
    filtersFormInnerEls.forEach(MapStatesMap[action].elementsAction);
  };

  var setMapActive = function (mapState) {
    if (mapState) {
      setMapState(MapStates.ACTIVE);
    } else {
      setMapState(MapStates.INACTIVE);
    }
  };


  var mainPinEl = mapEl.querySelector('.map__pin--main');

  var onLoadingError = function (errorMessage) {
    // посмотреть, возможно, тут другая верстка сообщения о сетевой ошибке
    // TODO: Если при отправке данных произошла ошибка запроса, покажите соответствующее сообщение в блоке main, используя блок #error из шаблона template
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.padding = '20px';
    node.style.width = '100%';
    node.style.left = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  var onLoadingSuccess = function (pins) {
    window.data.pins = pins;

    // отладка в левом верхнем углу
    console.log(window.data.pins);
    window.data.pins[0].location.x = 1;
    window.data.pins[0].location.y = 130;
    console.log(window.data.pins);
    // ---------------


    // window.data.discussedPhotos = [];
    window.map.renderMapPins(pins);
    // window.filters.showFiltersForm();

    // временно для 4-го задания
    // document.querySelector('.map').classList.remove('map--faded');
    // document.querySelector('.map--faded .map__filters').opacity = 1;
    // ------------------

    // после загрузки делаем карту активной
    // но пока что не делаем
    // window.map.setMapActive();
  };

  // window.data.getMockData(onLoadingSuccess);

  // данные загружать, но не рисовать до клика по главному пину что ли?
  // а проще загружать после клика по главному пину

  mainPinEl.addEventListener('click', function () {
    setMapActive(true);
    // Полный список похожих объявлений загружается после перехода страницы в активное состояние
    window.backend.download(DOWNLOAD_URL, onLoadingSuccess, onLoadingError);
  });

  var fillAddress = function (pin, offset) {
    // заполняет поле адреса, вычитая смещение из ДОМ-координат
    // 1) если брать координаты адреса из координат ДОМ-элемента, то смещение надо вычитать
    // 2) если же из координат адреса делать ДОМ-координаты, то смещение прибавлять
    // потому что изначальное смещение - отрицательное, то есть для случая (2)
    addressEl.value = (pin.offsetLeft - offset.X) + ', ' + (pin.offsetTop - offset.Y);
  };

  // document.querySelector('.promo img').style.position = 'absolute';
  // document.querySelector('.promo img').style.left = mainPinEl.offsetLeft + 'px';
  // console.log(mainPinEl.offsetLeft);
  // document.querySelector('.promo img').style.top = mainPinEl.offsetTop + 'px';

  // ---------------
  // var node = document.createElement('div');
  // node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: green; opacity: 0.5';
  // node.style.position = 'absolute';
  // node.style.width = '62px';
  // node.style.height = '62px';
  // node.style.left = mainPinEl.offsetLeft + 'px';
  // node.style.top = mainPinEl.offsetTop + 'px';
  // node.textContent = 'qqq';
  // document.querySelector('.map').insertAdjacentElement('afterbegin', node);
  // ---------------

  // первоначальное заполнение поля адреса при еще неактивной странице
  // в начале же он круглый, поэтому там другие смещения
  fillAddress(mainPinEl, MainPinPointerInitialOffset);

  window.map = {
    renderMapPins: renderMapPins,
    setMapActive: setMapActive
  };
})();
