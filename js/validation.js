'use strict';

(function () {
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

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


  var adFormEl = document.querySelector('.ad-form');
  // заголовок объявления
  var titleEl = adFormEl.querySelector('#title');
  // тип жилья (селект)
  var typeEl = adFormEl.querySelector('#type');
  // цена за ночь
  var priceEl = adFormEl.querySelector('#price');
  // адрес (ручное редактирование запрещено)
  var addressEl = adFormEl.querySelector('#address');
  // Поля «Время заезда» и «Время выезда» синхронизированы: при изменении значения одного поля,
  // во втором выделяется соответствующее ему. Например, если время заезда указано «после 14»,
  // то время выезда будет равно «до 14» и наоборот.
  var timeinEl = adFormEl.querySelector('#timein');
  var timeoutEl = adFormEl.querySelector('#timeout');
  // число комнат
  var roomCountEl = adFormEl.querySelector('#room_number');
  // число гостей
  var capacityEl = adFormEl.querySelector('#capacity');


  var isTitleFieldValid = function (titleField) {
    var currentLength = titleField.value.length;
    return currentLength >= TitleFieldValidationData.LENGTH.MIN && currentLength <= TitleFieldValidationData.LENGTH.MAX;
  };

  var setTitleFieldState = function (titleField, isValid) {
    // TODO возможно, чтобы не плодить такие фукнции для каждого поля, надо посмотреть, получится ли сделать универсальную
    if (isValid) {
      titleField.setCustomValidity('');
      titleField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      titleField.setCustomValidity(TitleFieldValidationData.INVALID_TEXT);
      titleField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.INVALID;
    }
  };

  var validateTitleField = function () {
    // TODO да и функции валидации полей тоже больно похожи. Сделать универсальную
    var result = isTitleFieldValid(titleEl);
    setTitleFieldState(titleEl, result);
    return result;
  };

  var isPriceFieldValid = function (priceField) {
    var minPrice = getMinPricePerNight();
    return priceField.value >= minPrice && priceField.value <= PriceFieldValidationData.MAX_VALUE;
  };

  var setPriceFieldState = function (priceField, isValid) {
    if (isValid) {
      priceField.setCustomValidity('');
      priceField.style[InvalidFieldStyles.VALIDITY] = InvalidFieldStyles.VALID;
    } else {
      var minPrice = getMinPricePerNight();
      var invalidText = '';
      if (minPrice) {
        invalidText += PriceFieldValidationData.INVALID_TEXT.MIN + minPrice + '. '
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
    // так как параметры изменились, надо вручную проверить, что поле цены валидно
    validatePriceField();
    // TODO: уточнить, хорошая ли это практика - вручную вызывать события
    // var event = new Event('input');
    // priceEl.dispatchEvent(event);
  };

  var getMinPricePerNight = function () {
    return TypeFieldValidationData[typeEl.value].MIN_PRICE;
  };

  // моки функций остальной валидации
  var validateAddressField = function () {
    return true;
  };

  var validateTimeinField = function () {
    return true;
  };

  var validateTimeoutField = function () {
    return true;
  };

  var validateRoomCountField = function () {
    return true;
  };

  var validateCapacityField = function () {
    return true;
  };

  var validateForm = function () {
    // TODO: пока что тоже скелет структуры валидации
    return (validateTitleField()
      && validatePriceField()
      && validateAddressField()
      && validateTimeinField()
      && validateTimeoutField()
      && validateRoomCountField()
      && validateCapacityField());
  };


  // TODO: пока что просто аое повторяю структуру из кекстаграмма
  // TODO: возможно, тут и другие события нужны будут, не инпут. Особенно на селектах
  titleEl.addEventListener('input', validateTitleField);
  typeEl.addEventListener('change', onTypeFieldChange);
  priceEl.addEventListener('input', validatePriceField);
  addressEl.addEventListener('input', validateAddressField);
  timeinEl.addEventListener('input', validateTimeinField);
  timeoutEl.addEventListener('input', validateTimeoutField);
  roomCountEl.addEventListener('input', validateRoomCountField);
  capacityEl.addEventListener('input', validateCapacityField);

  // TODO: непосредственно функция отправки объявления, пока что мок

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
})();
