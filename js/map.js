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

  var setMapInactive = function () {
    mapEl.classList.add('map--faded');
    adFormEl.classList.add('ad-form--disabled');
    adFormInnerEls.forEach(window.util.disableElement);
    filtersFormInnerEls.forEach(window.util.disableElement);
  };

  var setMapActive = function () {
    mapEl.classList.remove('map--faded');
    adFormEl.classList.remove('ad-form--disabled');
    adFormInnerEls.forEach(window.util.enableElement);
    filtersFormInnerEls.forEach(window.util.enableElement);
  };


  var mainPinEl = mapEl.querySelector('.map__pin--main');

  mainPinEl.addEventListener('click', function () {
    setMapActive();
  });

  var fillAddress = function (pin, offset) {
    // заполняет поле адреса, вычитая смещение из ДОМ-координат
    // 1) если брать координаты адреса из координат ДОМ-элемента, то смещение надо вычитать
    // 2) если же из координат адреса делать ДОМ-координаты, то смещение прибавлять
    // потому что изначальное смещение - отрицательное, то есть для случая (2)
    addressEl.value = (pin.offsetLeft - offset.X) + ', ' + (pin.offsetTop - offset.Y);
  };


  // первоначальное заполнение поля адреса
  fillAddress(mainPinEl, MainPinPointerInitialOffset);

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


  window.map = {
    renderMapPins: renderMapPins,
    setMapActive: setMapActive,
    setMapInactive: setMapInactive
  };
})();
