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

  var MapPinsCls = {
    ACTIVE: 'map__pin--active',
    ALL_BUT_MAIN: 'map__pin:not(.map__pin--main)'
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
      ACTION: function (cardTitleFieldEl, pin, key) {
        fillCardField(cardTitleFieldEl, pin.offer[key]);
      },
      DATA: ['title']
    },
    'popup__text--address': {
      ACTION: function (cardAddressFieldEl, pin, key) {
        fillCardField(cardAddressFieldEl, pin.offer[key]);
      },
      DATA: ['address']
    },
    'popup__text--price': {
      ACTION: function (cardPriceFieldEl, pin, key) {
        cardPriceFieldEl.textContent = fillCardField(cardPriceFieldEl, pin.offer[key]) + '₽/ночь';
      },
      DATA: ['price']
    },
    'popup__type': {
      ACTION: function (typeFieldEl, pin, key) {
        typeFieldEl.textContent = AdTypeMap[fillCardField(typeFieldEl, pin.offer[key])];
      },
      DATA: ['type']
    },
    'popup__text--capacity': {
      ACTION: function (capacityFieldEl, pin, keys) {
        var rooms = pin.offer[keys[0]];
        var guests = pin.offer[keys[1]];
        capacityFieldEl.textContent = fillCardField(capacityFieldEl, rooms) + ' ' +
        window.util.getPluralNoun(rooms, PLURAL_ENDINGS.ROOMS) + ' для ' +
        fillCardField(capacityFieldEl, guests) + ' ' + window.util.getPluralNoun(guests, PLURAL_ENDINGS.GUESTS);
      },
      DATA: ['rooms', 'guests']
    },
    'popup__text--time': {
      ACTION: function (timeFieldEl, pin, keys) {
        var checkin = pin.offer[keys[0]];
        var checkout = pin.offer[keys[1]];
        timeFieldEl.textContent = 'Заезд после ' + fillCardField(timeFieldEl, checkin) + ', выезд до ' + fillCardField(timeFieldEl, checkout);
      },
      DATA: ['checkin', 'checkout']
    },
    'popup__features': {
      ACTION: function (featuresFieldEl, pin, key) {
        var featuresList = Array.from(featuresFieldEl.children);
        var offeredFeatures = pin.offer[key];

        featuresList.forEach(function (feature) {
          var isCurrentFeatureAvailable = offeredFeatures.some(function (currentOfferedFeature) {
            return feature.classList.contains('popup__feature--' + currentOfferedFeature);
          });
          if (!isCurrentFeatureAvailable) {
            feature.remove();
          }
        });
      },
      DATA: ['features']
    },
    'popup__description': {
      ACTION: function (cardDescriptionFieldEl, pin, key) {
        fillCardField(cardDescriptionFieldEl, pin.offer[key]);
      },
      DATA: ['description']
    },
    'popup__photos': {
      ACTION: function (photosEl, pin, key) {
        var photos = pin.offer[key];
        if (!photos.length) {
          photosEl.style.display = 'none';
          return photos;
        }
        var fragment = document.createDocumentFragment();
        var imgTemplateEl = photosEl.querySelector('img');
        // удаляем первую картинку, которая всегда есть в шаблоне
        photosEl.querySelector('img').remove();

        photos.forEach(function (currentPhoto) {
          var newImg = imgTemplateEl.cloneNode(true);
          newImg.src = currentPhoto;
          fragment.appendChild(newImg);
        });

        return photosEl.appendChild(fragment);
      },
      DATA: ['photos']
    },
    'popup__avatar': {
      ACTION: function (avatarFieldEl, pin, key) {
        avatarFieldEl.src = pin.author[key];
      },
      DATA: ['avatar']
    }
  };

  var cardTemplateEl = document.querySelector('#card').content.querySelector('.map__card');
  var mapPinsEl = document.querySelector('.map__pins');

  var removeCard = function () {
    var mapCardEl = mapPinsEl.querySelector('.map__card');
    if (mapCardEl) {
      mapCardEl.remove();
    }
  };

  var onCardCloseBtnClick = function () {
    removeCard();
  };

  var onCardEscPress = function (evt) {
    if (window.util.isEscPressed(evt)) {
      removeCard();
    }
  };

  var renderCard = function (pin) {
    removeCard();
    var cardEl = cardTemplateEl.cloneNode(true);

    for (var key in FillCardMap) {
      if (FillCardMap.hasOwnProperty(key)) {
        var currentField = cardEl.querySelector('.' + key);
        var currentAction = FillCardMap[key].ACTION;
        var currentDataKeys = FillCardMap[key].DATA;

        currentAction(currentField, pin, currentDataKeys);
      }
    }

    mapPinsEl.insertBefore(cardEl, mapPinsEl.querySelector('.map__filters-container'));

    var cardCloseBtnEl = cardEl.querySelector('.popup__close');
    cardCloseBtnEl.addEventListener('click', onCardCloseBtnClick);
    document.addEventListener('keydown', onCardEscPress);
  };

  var activatePin = function (pin) {
    pin.classList.add(MapPinsCls.ACTIVE);
  };

  var deactivatePin = function () {
    var currentActivePin = mapPinsEl.querySelector('.' + MapPinsCls.ACTIVE);
    if (currentActivePin) {
      currentActivePin.classList.remove(MapPinsCls.ACTIVE);
    }
  };

  var onPinClick = function (evt) {
    var clickedPin = evt.target.closest('.' + MapPinsCls.ALL_BUT_MAIN);
    if (clickedPin) {
      deactivatePin();
      activatePin(clickedPin);
      var currentRenderedPins = Array.from(document.querySelectorAll('.' + MapPinsCls.ALL_BUT_MAIN));
      var currentPinIndex = currentRenderedPins.indexOf(clickedPin);
      // TODO: Все-таки данные фильтрованных пинов торчат из модуля фильтров, а не модуля данных.
      var clickedAd = window.filters.getPins()[currentPinIndex];
      renderCard(clickedAd);
    }

  };

  mapPinsEl.addEventListener('click', onPinClick);

  window.card = {
    remove: removeCard
  };
})();
