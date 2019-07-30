'use strict';

(function () {
  // TODO: перекинуть все объявления переменных в начало
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
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
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для 3, 2, 1 гостей".'
    },
    '2': {
      CORRECT_VALUES: ['2', '1'],
      INVALID_TEXT: 'Для выбранного числа комнат допустимы значения "Количество мест: для 2, 1 гостей".'
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


  var isTitleFieldValid = function (titleField) {
    var currentLength = titleField.value.length;
    return currentLength >= TitleFieldValidationData.LENGTH.MIN && currentLength <= TitleFieldValidationData.LENGTH.MAX;
  };

  var setTitleFieldState = function (titleField, isValid) {
    if (isValid) {
      titleField.setCustomValidity('');
      titleField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      titleField.setCustomValidity(TitleFieldValidationData.INVALID_TEXT);
      titleField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    }
  };

  var validateTitleField = function () {
    var result = isTitleFieldValid(titleEl);
    setTitleFieldState(titleEl, result);
    return result;
  };

  var isPriceFieldValid = function (priceField) {
    var minPrice = getMinPricePerNight();
    return priceField.value > minPrice && priceField.value <= PriceFieldValidationData.MAX_VALUE;
  };

  var setPriceFieldState = function (priceField, isValid) {
    if (isValid) {
      priceField.setCustomValidity('');
      priceField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      var minPrice = getMinPricePerNight();
      var invalidText = '';
      if (minPrice) {
        invalidText = PriceFieldValidationData.INVALID_TEXT.MIN + minPrice + '. ';
      }
      invalidText += PriceFieldValidationData.INVALID_TEXT.MAX;
      priceField.setCustomValidity(invalidText);
      priceField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    }
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

  var getMinPricePerNight = function () {
    return TypeFieldValidationData[typeEl.value].MIN_PRICE;
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
      capacityField.setCustomValidity('');
      capacityField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      capacityField.setCustomValidity(RoomCountValidationData[roomCountEl.value].INVALID_TEXT);
      capacityField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    }
  };

  var onAccomodationChange = function () {
    var result = isCapacityFieldValid();
    setCapacityFieldState(capacityEl, result);
    return result;
  };

  var validateForm = function () {
    return (validateTitleField() && validatePriceField());
  };


  titleEl.addEventListener('input', validateTitleField);
  priceEl.addEventListener('input', validatePriceField);

  typeEl.addEventListener('change', onTypeFieldChange);
  timeinEl.addEventListener('change', onTimeinFieldChange);
  timeoutEl.addEventListener('change', onTimeoutFieldChange);
  capacityEl.addEventListener('change', onAccomodationChange);
  roomCountEl.addEventListener('change', onAccomodationChange);

  // похоже, надо один раз вызвать обработчик события change поля количества комннт,
  // потому что в разметке указано несоответствующее ТЗ значение
  // TODO: похоже, все эти три ручных вызова надо будет класть в обновление формы нового объявления
  onAccomodationChange();
  // ну и разок вызвать валидацию поля цены (потому что при дефолтном значении "квартира")
  // дефолтное значение ноль - не подходит
  validatePriceField();
  onTypeFieldChange();

  // TODO: доделать потом, потому что нужно понимать, как работает показ карточек и тд, чтобы успешно чистить все это при отправке

  var uploadSuccess = function () {
    // closeImgEditWindow();
    //
    // var successPopupEl = successTemplate.cloneNode(true);
    // mainEl.appendChild(successPopupEl);
    //
    // var successPopupCloseBtnEl = document.querySelector('.success__button');
    //
    // var removeSuccessPopup = function () {
    //   if (mainEl.contains(successPopupEl)) {
    //     mainEl.removeChild(successPopupEl);
    //   }
    //   successPopupCloseBtnEl.removeEventListener('click', removeSuccessPopup);
    //   window.removeEventListener('click', removeSuccessPopup);
    //   document.removeEventListener('keydown', onUploadSuccessEscPress);
    // };
    //
    // var onUploadSuccessEscPress = function (evt) {
    //   if (window.util.isEscPressed(evt)) {
    //     removeSuccessPopup();
    //   }
    // };
    //
    // successPopupCloseBtnEl.addEventListener('click', removeSuccessPopup);
    // window.addEventListener('click', removeSuccessPopup);
    // document.addEventListener('keydown', onUploadSuccessEscPress);
  };

  var uploadError = function () {
    // imgEditWindowEl.classList.add('hidden');
    //
    // var errorPopupEl = errorTemplate.cloneNode(true);
    // mainEl.appendChild(errorPopupEl);
    //
    // var errorPopupAgainBtnEl = document.querySelector('.error__button--again');
    // var errorPopupAnotherBtnEl = document.querySelector('.error__button--another');
    //
    // var removeErrorEvtListeners = function () {
    //   window.removeEventListener('click', removeErrorPopup);
    //   document.removeEventListener('keydown', removeErrorPopup);
    // };
    //
    // var removeErrorPopup = function () {
    //   if (mainEl.contains(errorPopupEl)) {
    //     mainEl.removeChild(errorPopupEl);
    //   }
    //   removeErrorEvtListeners();
    // };
    //
    // var onUploadErrorEscPress = function (evt) {
    //   if (window.util.isEscPressed(evt)) {
    //     removeErrorPopup();
    //   }
    // };
    //
    // window.addEventListener('click', removeErrorPopup);
    // document.addEventListener('keydown', onUploadErrorEscPress);
    //
    // errorPopupAgainBtnEl.addEventListener('click', function (evt) {
    //   evt.stopPropagation();
    //   mainEl.removeChild(errorPopupEl);
    //   imgEditWindowEl.classList.remove('hidden');
    //   removeErrorEvtListeners();
    // });
    //
    // errorPopupAnotherBtnEl.addEventListener('click', function (evt) {
    //   evt.stopPropagation();
    //   closeImgEditWindow();
    //   removeErrorPopup();
    //   uploadFileEl.click();
    // });
  };

  adFormEl.addEventListener('submit', function (evt) {
    var isformValid = validateForm();
    var uploadData = new FormData(adFormEl);
    if (isformValid) {
      evt.preventDefault();
      window.backend.upload(UPLOAD_URL, uploadData, uploadSuccess, uploadError);
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

  var avatarFileEl = adFormEl.querySelector('#avatar');
  var avatarImageEl = adFormEl.querySelector('.ad-form-header__preview img');
  var photoContainerEl = adFormEl.querySelector('.ad-form__photo-container');
  var photoFileEl = photoContainerEl.querySelector('#images');
  var photoEl = photoContainerEl.querySelector('.ad-form__photo');


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
    // TODO реализивать просмотр полноэкранных фоток и их упорядочивание перетаскиванием
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
  // TODO При сбросе формы, страница возвращается в исходное неактивное состояние и метка перемещается на изначальные координаты. Соответствующее значение поля ввода адреса так же должно быть обновлено.
})();
