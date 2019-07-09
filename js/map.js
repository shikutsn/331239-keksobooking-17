'use strict';

(function () {
  var PinPointerOffset = {
    X: 25,
    Y: 70
  };
  var MainPinPointerOffset = {
    X: 31,
    Y: 42
  };


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
  for (var i = 0; i < window.data.announcements.length; i++) {
    fragment.appendChild(renderAnnouncement(window.data.announcements[i]));
  }

  var picturesContainer = document.querySelector('.map__pins');
  picturesContainer.appendChild(fragment);

})();
