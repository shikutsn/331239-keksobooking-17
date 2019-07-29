'use strict';

(function () {
  var PLURAL_ENDINGS = {
    ROOMS: ['комната', 'комнаты', 'комнат'],
    GUESTS: ['гостя', 'гостей', 'гостей']
  };

  var AdTypeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var fillCardField = function (cardFieldEl, content) {
    if (content) {
      cardFieldEl.textContent = content;
    } else {
      cardFieldEl.style.display = 'none';
    }
    return cardFieldEl.textContent;
  };

  var FillCardMap = {
    'popup__title': {
      ACTION: fillCardField,
      DATA: 'title'
    },
    'popup__text--address': {
      ACTION: fillCardField,
      DATA: 'address'
    },
    'popup__text--price': {
      ACTION: function (cardPriceFieldEl, price) {
        cardPriceFieldEl.textContent = fillCardField(cardPriceFieldEl, price) + '₽/ночь';
      },
      DATA: 'price'
    },
    'popup__type': {
      ACTION: function (typeFieldEl, type) {
        typeFieldEl.textContent = AdTypeMap[fillCardField(typeFieldEl, type)];
      },
      DATA: 'type'
    },
    'popup__text--capacity': {
      ACTION: function (capacityFieldEl, rooms, guests) {
        capacityFieldEl.textContent = fillCardField(capacityFieldEl, rooms) + ' ' +
        window.util.getPluralNoun(rooms, PLURAL_ENDINGS.ROOMS) + ' для ' +
        fillCardField(capacityFieldEl, guests) + ' ' + window.util.getPluralNoun(guests, PLURAL_ENDINGS.GUESTS);
      },
      DATA: 'rooms',
      EXTRA_DATA: 'guests'
    },
    'popup__text--time': {
      ACTION: function (timeFieldEl, checkin, checkout) {
        timeFieldEl.textContent = 'Заезд после ' + fillCardField(timeFieldEl, checkin) + ', выезд до ' + fillCardField(timeFieldEl, checkout);
      },
      DATA: 'checkin',
      EXTRA_DATA: 'checkout'
    }
  };

  var cardTemplateEl = document.querySelector('#card').content.querySelector('.map__card');
  var mapPinsEl = document.querySelector('.map__pins');
  var currentPinIndex; // FIXME а используется ли эта переменная? пока что нет

  var renderCard = function (pin) {
    var cardEl = cardTemplateEl.cloneNode(true);
    // // поле с описанием
    // var cardDescription = card.querySelector('.popup__description');
    // // поле с указанием времени заезда и выезда
    // var cardTime = card.querySelector('.popup__text--time');
    // // поле со списком доступных удобств
    // var cardFeatures = card.querySelector('ul.popup__features');
    // // блок с фото
    // var photosList = card.querySelector('.popup__photos');
    // var photo = photosList.querySelector('.popup__photo');
    // // блок с аватаркой
    // var cardAvatar = card.querySelector('.popup__avatar');
    // // кнопка закрытия
    // var cardButton = card.querySelector('.popup__close');

    for (var key in FillCardMap) {
      if (FillCardMap.hasOwnProperty(key)) {
        var currentField = cardEl.querySelector('.' + key);
        var currentAction = FillCardMap[key].ACTION;
        var currentDataKey = FillCardMap[key].DATA;
        var currentExtraDataKey = FillCardMap[key].EXTRA_DATA;
        // если поля EXTRA_DATA нет, то третьим параметром передается undefined, который и не используется
        // TODO: а может, вообще сделать DATA массивом, но как тогда передавать все? Или обрабатывать в функциях же!
        currentAction(currentField, pin.offer[currentDataKey], pin.offer[currentExtraDataKey]);
      }
    }

    mapPinsEl.insertBefore(cardEl, mapPinsEl.querySelector('.map__filters-container'));
  };

  var onPinClick = function (evt) {
    var clickedPin = evt.target.closest('.map__pin:not(.map__pin--main)');
    if (clickedPin) {
      // TODO: как было в кекстаграмме - плохо, что фильтрованные пины торчат из модуля фильтров. Или прокатит?
      var currentRenderedPins = Array.from(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
      currentPinIndex = currentRenderedPins.indexOf(clickedPin);
      var clickedAd = window.filters.getPins()[currentPinIndex];
      // console.log('filteredPins: ', window.filters.getPins());
      // console.log('card: ', clickedAd);
      // console.log('clickedPin: ', clickedPin);
      // console.log('currentPinIndex: ', currentPinIndex);
      renderCard(clickedAd);
    }
  };

  mapPinsEl.addEventListener('click', onPinClick);
})();
