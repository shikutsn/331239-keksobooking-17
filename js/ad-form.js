'use strict';

(function () {
  // TODO: перекинуть все объявления переменных в начало
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAIN_PIN_DEFAULT_STYLE = 'left: 570px; top: 375px;';
  var AVATAR_DEFAULT_SRC = 'img/muffin-grey.svg';
  var ApartmentImageData = {
    ALT_TEXT: 'Фотография жилья',
    WIDTH: '70',
    HEIGHT: '70'
  };
  var InvalidFieldStyles = {
    VALIDITY: 'outline',
    INVALID: '3px dashed red',
    VALID: 'none'
  };
  var TitleFieldValidationData = {
    LENGTH: {
      MIN: 30,
      MAX: 100
    },
    INVALID_TEXT: 'Не меньше 30 и не больше 100 символов.'
  };
  var PriceFieldValidationData = {
    MAX_VALUE: 1000000,
    INVALID_TEXT: {
      MAX: 'Не больше 1 000 000.',
      MIN: 'Не меньше '
    }
  };
  var TypeFieldValidationData = {
    'bungalo': {
      MIN_PRICE: 0
    },
    'flat': {
      MIN_PRICE: 1000
    },
    'house': {
      MIN_PRICE: 5000
    },
    'palace': {
      MIN_PRICE: 10000
    },
  };
  var RoomCountValidationData = {
    '100': {
      CORRECT_VALUES: ['0'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимо только значение "Не для гостей".'
    },
    '3': {
      CORRECT_VALUES: ['3', '2', '1'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для 1, 2, 3 гостей".'
    },
    '2': {
      CORRECT_VALUES: ['2', '1'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для 1, 2 гостей".'
    },
    '1': {
      CORRECT_VALUES: ['1'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для одного гостя".'
    }
  };

  var adFormEl = document.querySelector('.ad-form');
  var titleEl = adFormEl.querySelector('#title');
  var typeEl = adFormEl.querySelector('#type');
  var priceEl = adFormEl.querySelector('#price');
  var timeinEl = adFormEl.querySelector('#timein');
  var timeoutEl = adFormEl.querySelector('#timeout');
  var roomCountEl = adFormEl.querySelector('#room_number');
  var capacityEl = adFormEl.querySelector('#capacity');
  var filtersFormEl = document.querySelector('.map__filters');
  var resetBtnEl = adFormEl.querySelector('.ad-form__reset');

  var mainEl = document.querySelector('main');
  var successTemplateEl = document.querySelector('#success').content.querySelector('.success');
  var errorTemplateEl = document.querySelector('#error').content.querySelector('.error');

  var avatarFileEl = adFormEl.querySelector('#avatar');
  var avatarImageEl = adFormEl.querySelector('.ad-form-header__preview img');
  var photoContainerEl = adFormEl.querySelector('.ad-form__photo-container');
  var photoFileEl = photoContainerEl.querySelector('#images');
  var photoEl = photoContainerEl.querySelector('.ad-form__photo');

  var isTitleFieldValid = function (titleField) {
    var currentLength = titleField.value.length;
    return currentLength >= TitleFieldValidationData.LENGTH.MIN && currentLength <= TitleFieldValidationData.LENGTH.MAX;
  };

  var setTitleFieldState = function (titleField, isValid) {
    if (isValid) {
      titleField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
      return titleField.setCustomValidity('');
    }

    titleField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    return titleField.setCustomValidity(TitleFieldValidationData.INVALID_TEXT);
  };

  var validateTitleField = function () {
    var result = isTitleFieldValid(titleEl);
    setTitleFieldState(titleEl, result);
    return result;
  };

  var isPriceFieldValid = function (priceField) {
    var minPrice = TypeFieldValidationData[typeEl.value].MIN_PRICE;
    return priceField.value > minPrice && priceField.value <= PriceFieldValidationData.MAX_VALUE;
  };

  var setPriceFieldState = function (priceField, isValid) {
    if (isValid) {
      priceField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
      return priceField.setCustomValidity('');
    }

    var minPrice = TypeFieldValidationData[typeEl.value].MIN_PRICE;
    var invalidText = '';
    if (minPrice) {
      invalidText = PriceFieldValidationData.INVALID_TEXT.MIN + minPrice + '. ';
    }
    invalidText += PriceFieldValidationData.INVALID_TEXT.MAX;
    priceField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    return priceField.setCustomValidity(invalidText);
  };

  var validatePriceField = function () {
    var result = isPriceFieldValid(priceEl);
    setPriceFieldState(priceEl, result);
    return result;
  };

  var onTypeFieldChange = function () {
    priceEl.placeholder = TypeFieldValidationData[typeEl.value].MIN_PRICE;
    // так как параметры типа апартаментов изменились, надо вручную проверить, что поле цены валидно
    validatePriceField();
  };

  var onTimeinFieldChange = function () {
    timeoutEl.selectedIndex = timeinEl.selectedIndex;
  };

  var onTimeoutFieldChange = function () {
    timeinEl.selectedIndex = timeoutEl.selectedIndex;
  };

  var isCapacityFieldValid = function () {
    return RoomCountValidationData[roomCountEl.value].CORRECT_VALUES.some(function (it) {
      return it === capacityEl.value;
    });
  };

  var setCapacityFieldState = function (capacityField, isValid) {
    if (isValid) {
      capacityField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
      return capacityField.setCustomValidity('');
    }

    capacityField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    return capacityField.setCustomValidity(RoomCountValidationData[roomCountEl.value].INVALID_TEXT);
  };

  var onAccomodationChange = function () {
    var result = isCapacityFieldValid();
    setCapacityFieldState(capacityEl, result);
    return result;
  };

  var validateForm = function () {
    return (validateTitleField() && validatePriceField());
  };

  var initAdForm = function () {
    // для поля числа комнат в разметке указано несоответствующее числу гостей значение,
    // а без их изменения не происходит валидации, поэтому вручную вызову валидацию на инициализации
    onAccomodationChange();
    // для указанного в разметке типа апартаментов плейсхолдер цены неправильный, поэтому вручную вызову валидацию на инициализации
    onTypeFieldChange();
  };

  var onTitleFieldInput = function () {
    validateTitleField();
  };

  var onPriceFieldInput = function () {
    validatePriceField();
  };

  var resetPage = function () {
    // TODO: как-то тут вызываются функции отовсюду =(
    // TODO: возможно, сделать одну функцию, которая вызывает методы сброса форм объявления и фильтров, если она еще где-нибудь понадобится
    // TODO А вообще, наверное, эту функцию стоит объединить с setMapActive, ведь по сути делают они все только вместе - вкл/выкл страницу
    adFormEl.reset();
    filtersFormEl.reset();

    // TODO выделить в отдельную функцию
    // очистка аватарки
    avatarImageEl.src = AVATAR_DEFAULT_SRC;
    // очистка фоток
    var uploadedPhotos = adFormEl.querySelectorAll('.ad-form__photo');
    uploadedPhotos.forEach(function (currentPhoto, index) {
      if (!index) {
        var imgEl = currentPhoto.querySelector('img');
        if (imgEl) {
          imgEl.remove();
        }
      } else {
        currentPhoto.remove();
      }
    });

    window.map.clearCurrentPins();
    window.card.remove();

    var mainPinEl = document.querySelector('.map__pin--main');
    mainPinEl.style = MAIN_PIN_DEFAULT_STYLE;
    // FIXME убрать эту константу (перемещая функцию fillAddress)
    // FIXME или сделать функцию в модуле map типа resetMainPin()
    var MainPinPointerOffset = {
      X: -31,
      Y: -84 // проверить 80 или 84. Думаю, что 84 (картинка 62 и стрелка еще 22)
    };
    window.map.fillAddress(mainPinEl, MainPinPointerOffset);
    window.map.setActive(false);
  };

  var onResetBtnClick = function () {
    resetPage();
  };

  titleEl.addEventListener('input', onTitleFieldInput);
  priceEl.addEventListener('input', onPriceFieldInput);

  typeEl.addEventListener('change', onTypeFieldChange);
  timeinEl.addEventListener('change', onTimeinFieldChange);
  timeoutEl.addEventListener('change', onTimeoutFieldChange);
  capacityEl.addEventListener('change', onAccomodationChange);
  roomCountEl.addEventListener('change', onAccomodationChange);

  resetBtnEl.addEventListener('click', onResetBtnClick);

  var uploadSuccess = function () {
    resetPage();

    var successPopupEl = successTemplateEl.cloneNode(true);
    mainEl.appendChild(successPopupEl);

    var removeSuccessPopup = function () {
      successPopupEl.remove();
      document.removeEventListener('click', onSuccessPopupClick);
      document.removeEventListener('keydown', onSuccessPopupEscPress);
    };

    var onSuccessPopupClick = function () {
      removeSuccessPopup();
    };

    var onSuccessPopupEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeSuccessPopup();
      }
    };

    document.addEventListener('click', onSuccessPopupClick);
    document.addEventListener('keydown', onSuccessPopupEscPress);
  };

  var uploadError = function () {
    var errorPopupEl = errorTemplateEl.cloneNode(true);
    mainEl.appendChild(errorPopupEl);

    var errorPopupCloseBtnEl = errorPopupEl.querySelector('.error__button');

    var removeErrorPopup = function () {
      errorPopupEl.remove();
      document.removeEventListener('click', onErrorPopupClick);
      document.removeEventListener('keydown', onErrorPopupEscPress);
    };

    var onErrorPopupClick = function () {
      removeErrorPopup();
    };

    var onErrorPopupEscPress = function (evt) {
      if (window.util.isEscPressed(evt)) {
        removeErrorPopup();
      }
    };

    var onErrorPopupCloseBtnClick = function () {
      removeErrorPopup();
    };

    errorPopupCloseBtnEl.addEventListener('click', onErrorPopupCloseBtnClick);
    document.addEventListener('click', onErrorPopupClick);
    document.addEventListener('keydown', onErrorPopupEscPress);
  };

  adFormEl.addEventListener('submit', function (evt) {
    if (validateForm()) {
      var uploadData = new FormData(adFormEl);
      evt.preventDefault();
      window.backend.upload(uploadData, uploadSuccess, uploadError);
    }
  });

  // TODO Возможно, выделить в отдельный модуль все манипуляции с файлами в форме (аватарки, перетаскивания и тд)
  var loadImgFromDisc = function (fileEl, imageEl) {
    var file = fileEl.files[0];
    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          imageEl.src = reader.result;
        });

        reader.readAsDataURL(file);
      }
    }
  };

  avatarFileEl.addEventListener('change', function () {
    loadImgFromDisc(avatarFileEl, avatarImageEl);
  });

  var createImage = function () {
    var imageEl = document.createElement('img');

    imageEl.alt = ApartmentImageData.ALT_TEXT;
    imageEl.width = ApartmentImageData.WIDTH;
    imageEl.height = ApartmentImageData.HEIGHT;

    return imageEl;
  };

  photoFileEl.addEventListener('change', function () {
    // TODO реализовать просмотр полноэкранных фоток и их упорядочивание перетаскиванием
    // TODO на самом деле перетаскивание тоже пока что не поддерживается
    // TODO да и аватарку перетащить нельзя
    if (!photoContainerEl.querySelector('.ad-form__photo img')) {
      photoEl.remove();
    }

    var imageEl = createImage();
    loadImgFromDisc(photoFileEl, imageEl);
    var newImageEl = photoEl.cloneNode(true);
    newImageEl.insertAdjacentElement('afterbegin', imageEl);
    photoContainerEl.insertAdjacentElement('beforeend', newImageEl);
  });

  window.adForm = {
    init: initAdForm
  };
})();
