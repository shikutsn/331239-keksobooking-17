'use strict';

(function () {
  var AdTypeMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var FillCardMap = {
    'popup__title': {
      ACTION: fillCardField,
      DATA: 'title'
    },
    'popup__text--address': {
      ACTION: fillCardField,
      DATA: 'address'
    }
  };

  var cardTemplateEl = document.querySelector('#card')
  .content
  .querySelector('.map__card');
  var mapPinsEl = document.querySelector('.map__pins');
  var currentPinIndex; // fix а используется ли эта переменная? пока что нет

  var fillCardField = function (cardFieldEl, content) {
    if (content) {
      cardFieldEl.textContent = content;
    } else {
      cardFieldEl.style.display = 'none';
    }
    return cardFieldEl.textContent;
  };

  var onPinClick = function (evt) {
    var clickedPin = evt.target.closest('.map__pin:not(.map__pin--main)');
    if (clickedPin) {
      // TODO: как было в кекстаграмме - плохо, что фильтрованные пины торчат из модуля фильтров. Или прокатит?
      var currentRenderedPins = Array.from(document.querySelectorAll('.map__pin:not(.map__pin--main)'));
      currentPinIndex = currentRenderedPins.indexOf(clickedPin);
      var clickedAd = window.filters.getFilteredPins()[currentPinIndex];
      console.log('filteredPins: ', window.filters.getFilteredPins());
      console.log('card: ', clickedAd);
      console.log('clickedPin: ', clickedPin);
      console.log('currentPinIndex: ', currentPinIndex);
      renderCard(clickedAd);
    }
  };

  mapPinsEl.addEventListener('click', onPinClick);

  var fillPriceField = function (cardPriceFieldEl, price) {
    cardPriceFieldEl.textContent = fillCardField(cardPriceFieldEl, price) + '₽/ночь';
  };

  var fillTypeEl = function (typeFieldEl, type) {
    typeFieldEl.textContent = AdTypeMap[fillCardField(typeFieldEl, type)];
  };
  // TODO: а вообще, подумать, не переписать ли это на ассоциативный массив? То есть массив селекторов, а в его полях записано где искать и как и куда записывать данные в карточку. Ну и заполнить все простым перебором

  var renderCard = function (pin) {
    var cardEl = cardTemplateEl.cloneNode(true);

    // var cardTitleEl = cardEl.querySelector('.popup__title');
    // var cardAddressEl = cardEl.querySelector('.popup__text--address');
    // var cardPriceEl = cardEl.querySelector('.popup__text--price');
    // var cardTypeEl = cardEl.querySelector('.popup__type');
    // // поле с количеством гостей и комнат
    // var cardCapacity = card.querySelector('.popup__text--capacity');
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

    // -------------------------------
    // fillCardField(cardTitleEl, pin.offer.title);
    // fillCardField(cardAddressEl, pin.offer.address);
    // fillPriceField(cardPriceEl, pin.offer.price);
    // fillTypeEl(cardTypeEl, pin.offer.type);
    // -------------------------------
    for (var key in FillCardMap) {
      if (FillCardMap.hasOwnProperty(key)) {
        // filteredPins = filteredPins.filter(FiltersMap[key][filtersFormEl.querySelector('#' + key).value]);
        var currentField = cardEl.querySelector('.' + key);
        var currentAction = FillCardMap[key].ACTION;
        var currentDataKey = FillCardMap[key].DATA;
        currentAction(currentField, pin.offer[currentDataKey]);
        console.log('currentDataKey: ', currentDataKey);
        console.log('pin.offer[currentDataKey]: ', pin.offer[currentDataKey]);
        debugger;
      }
    }

    mapPinsEl.insertBefore(cardEl, mapPinsEl.querySelector('.map__filters-container'));
  };

})();
