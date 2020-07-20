import 'normalize.css';
import './swiper-bundle.min.css';
import './fonts.css';
import './sass/index.scss';
import './sass/lazy.scss';

import './browserconfig.xml';

import './icons/ms-icon-70x70.png';
import './icons/ms-icon-150x150.png';
import './icons/ms-icon-310x150.png';
import './icons/ms-icon-310x310.png';

import './icons/android-icon-36x36.png';
import './icons/android-icon-48x48.png';
import './icons/android-icon-96x96.png';
import './icons/android-icon-512x512.png';

import './icons/apple-touch-icon-57x57.png';
import './icons/apple-touch-icon-60x60.png';
import './icons/apple-touch-icon-72x72.png';
import './icons/apple-touch-icon-76x76.png';
import './icons/apple-touch-icon-114x114.png';
import './icons/apple-touch-icon-120x120.png';
import './icons/apple-touch-icon-144x144.png';
import './icons/apple-touch-icon-152x152.png';
import './icons/apple-touch-icon.png';
import './icons/maskable_icon.png';

document.oncontextmenu = () => false;

const Swiper = require('./swiper-bundle.min.js');

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos(input, pos) {
  setSelectionRange(input, pos, pos);
}

function clickPhone(e) {
  let element = e.currentTarget;
  let mask = '+7(___)___-____';
  if (!element.value) {
    element.value = mask;
  }
  setCaretToPos(element, element.value.search("_"));
}

function blurPhone(e) {
  let element = e.currentTarget;
  let numberPhone = element.value.match(/(\d)/g);
  if (numberPhone && numberPhone.length <= 1) {
    element.value = '';
  }
}

function inputPhone(e) {
  let element = e.currentTarget;
  let mask = '+7(___)___-____',
    numberPhone = element.value.match(/(\d)/g);
  if (numberPhone && element.value.length != mask.length) {
    let reg1 = /\)/g,
      reg2 = /\-/g;
    numberPhone.splice(0, 1);
    if (numberPhone[0] === '8') {
      numberPhone.splice(0, 1);
    }
    if (!reg1.test(element.value)) {
      numberPhone.splice(2, 1);
    }
    if (!reg2.test(element.value)) {
      numberPhone.splice(5, 1);
    }
    while (numberPhone.length < 10) {
      numberPhone.push('_');
    }
    numberPhone.splice(12, numberPhone.length);
    numberPhone.splice(6, 0, '-');
    numberPhone.splice(3, 0, ')');
    numberPhone.splice(0, 0, '+7(');
    element.value = numberPhone.join('');
    setCaretToPos(element, element.value.search("_"));
  }
}

for (let i of document.querySelectorAll('input[type="tel"]')) {
  i.addEventListener("click", clickPhone);
  i.addEventListener("focus", clickPhone);
  i.addEventListener("blur", blurPhone);
  i.addEventListener('input', inputPhone);
}

const swiperHeader = new Swiper('.header__swiper', {
  loop: true,
  parallax: true,
  effect: 'fade',
  fadeEffect: {
    crossFade: true
  },
  autoplay: {
    delay: 5000,
  },
  navigation: {
    prevEl: '#header-prev',
    nextEl: '#header-next',
  },
  pagination: {
    el: '#header-pagination',
    clickable: true,
  },
});
const swiperModal = new Swiper('.modal__slider', {
  navigation: {
    prevEl: '#modal-prev',
    nextEl: '#modal-next',
  },
  pagination: {
    el: '#modal-pagination',
    clickable: true,
  },
});

function showSlider(e) {
  let path = e.currentTarget.dataset.path;
  let files = e.currentTarget.dataset.content.split(',');
  let wrapper = document.querySelector('#modal-wrapper');
  wrapper.innerHTML = '';

  for (let i of files) {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide', 'modal__slide');

    let view;
    if ((/mp4$/).test(i)) {
      view = `<video controls preload="none" muted>
                    <source src="/img/${path}/${i}" type="video/mp4">
                </video>`;
    } else {
      view = `<img class="modal__img" src="/img/${path}/${i}" alt="">`;
    }

    slide.innerHTML = `<div class="_container _row">
                           <div class="_col-12 _ptb-n">
                             ${view}
                           </div>
                         </div>`;
    wrapper.appendChild(slide);
  }

  swiperModal.update();
  swiperModal.slideTo(0);
  document.querySelector('#modal-slider').checked = true;
}

function playVideo(e) {
  let element = e.target;
  if (element.tagName === 'VIDEO') {
    if (element.paused && element.duration) {
      element.pause();
    } else {
      element.play();
    }
  }
}
document.querySelector('#modal-wrapper').addEventListener('click', playVideo)

for (let i of document.querySelectorAll('.gallery__item')) {
  i.addEventListener('click', showSlider);
}

function scrollTop() {
  let scrolled = window.pageYOffset || document.documentElement.scrollTop;
  let step = 0;
  let t = setInterval(
    function() {
      scrolled -= step;
      if ( scrolled <= 0 ) {
        clearInterval(t);
        window.scrollTo(0,0);
      } else {
        window.scrollBy(0,-step);
      }
      step += 5;
    },
    1000/60
  );
}

document.querySelector('.button-top').addEventListener('click', scrollTop);

const sendForm = function (e) {
  e.preventDefault();
  const formElement = e.currentTarget;
  const inputsForm = formElement.querySelectorAll('input');
  if (formElement.dataset.ym) {
    ym(+formElement.dataset.ym, 'reachGoal', formElement.dataset.target);
  }
  let formData = new FormData();
  for (let i of inputsForm) {
    let val = i.files ? i.files[0] : i.value;
    formData.append(i.getAttribute('name'), val);
  }
  fetch(formElement.getAttribute('action'), {
    method: 'post',
    body: formData,
  }).then((res) => {
    if (200 <= res.status && res.status < 300){
      return res.text();
    } else {
      throw new Error('Error status: ' + res.status);
    }
  }).then((i) => {
    document.querySelector('#complete-modal').checked = true;
  }).catch((err) => {
    document.querySelector('#error-modal').checked = true;
  });
};

for (let i of document.querySelectorAll('form')) {
  i.addEventListener('submit', sendForm);
}

function checkPersonal(e) {
  e.currentTarget.parentNode.parentNode.querySelector('[type=submit]').disabled = !e.target.checked;
}

for (let i of document.querySelectorAll('input[name=check-personal]')) {
  i.addEventListener('change', checkPersonal);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('service-worker.js')
  });
}