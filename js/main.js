'use strict';

var ANNOUNCEMENTS_COUNT = 8;
var ANNOUNCEMENT_ORDINATE_MIN = 130;
var ANNOUNCEMENT_ORDINATE_MAX = 630;

var ANNOUNCEMENT_ABSCISS_MIN = 0;
var ANNOUNCEMENT_ABSCISS_MAX = parseInt(document.querySelector('.map__pins').offsetWidth);

// console.log(ANNOUNCEMENT_ABSCISS_MAX);
// console.log('js: ' + parseInt('12px'));
// console.log('js: ' + document.querySelector('.map__pins').offsetWidth);

var APARTMENT_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var getRandomNumber = function (min, max) {
  // случайное целое число из полуинтервала [min, max)
  return Math.floor(Math.random() * (max - min)) + min;
};

var announcements = [];

var generateRandomAnnouncement = function (announcementNumber) {
  // toString() нужно ли? Или полагаться на динамическое преобразование типов
  return {
    author: {
      avatar: 'img/avatars/user0' + announcementNumber.toString() + '.png'
    },
    offer: {
      type: APARTMENT_TYPES[getRandomNumber(0, APARTMENT_TYPES.length)]
    },
    location: {
      x: getRandomNumber(ANNOUNCEMENT_ABSCISS_MIN, ANNOUNCEMENT_ABSCISS_MAX + 1),
      y: getRandomNumber(ANNOUNCEMENT_ORDINATE_MIN, ANNOUNCEMENT_ORDINATE_MAX + 1)
    }
  }
};

for (var i = 1; i <= ANNOUNCEMENTS_COUNT; i++) {
  announcements.push(generateRandomAnnouncement(i));
}

console.log(announcements);


var mapContainer = document.querySelector('.map');
mapContainer.classList.remove('map--faded');


var announcementTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');

var renderAnnouncement = function (announcement) {
  var announcementElement = announcementTemplate.cloneNode(true);

  announcementElement.style.cssText = 'left: ' + announcement.location.x + 'px; top: ' + announcement.location.y + 'px;';
  console.log('left: ' + announcement.location.x + 'px; top: ' + announcement.location.y + 'px;');
  announcementElement.src = announcement.author.avatar;
  announcementElement.alt = 'заголовок объявления';

  return announcementElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < announcements.length; i++) {
  fragment.appendChild(renderAnnouncement(announcements[i]));
}

var picturesContainer = document.querySelector('.map__pins');
picturesContainer.appendChild(fragment);


