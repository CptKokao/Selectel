'use strict';

// Фильтр
const range = document.querySelector('#range');
const gpuCheckbox = document.querySelector('#gpu');
const raidCheckbox = document.querySelector('#raid');
const ssdCheckbox = document.querySelector('#ssd');
const resultWrap = document.querySelector('.result__wrap');
const loader = document.querySelector('.loader');
let myData = [];

// получает данные
function getData() {

  return fetch('https://api.jsonbin.io/b/5df3c10a2c714135cda0bf0f/1')
      .then((response) => {
        if (response.ok) {
          // после загрузки скрываем loader
          loader.setAttribute('style', 'display: none');
          // получаем данные
          return response.json();
        } else {
          throw new Error('Данные не были получены, ошибка: ' + response.status);
        }
      })
      .then(data => {
        // записываем в переменную
        myData = data;
        return data;

      })
      .catch(err => {
        console.log(err);
      });
}

// основной фильтр
const filter = (data) => {
  const rangeValue = Number(document.querySelector('#range').value);
  const result = data.filter(el => (rangeValue === el.cpu.cores * el.cpu.count) && filterGPU(el) && filterRAID(el) && filterSSD(el));
  render(result);
};

// фильтр GPU
function filterGPU(el) {
  if (gpuCheckbox.checked) {
    return (el.gpu) ? true : false;
  } else {
    return true;
  }
}

// фильтр RAID
function filterRAID(el) {
  if (raidCheckbox.checked) {
    return (el.disk.count >= 2) ? true : false;
  } else {
    return true;
  }
}

// фильтр SSD
function filterSSD(el) {
  if (ssdCheckbox.checked) {
    return (el.disk.type === 'SSD') ? true : false;
  } else {
    return true;
  }
}

// Рендер результата
function render(data) {
  resultWrap.innerHTML = ``;
  // если результат filter() пустой
  if (data.length === 0) {
    const p = document.createElement('p');
    p.className = 'result__error';
    p.innerHTML = `Нет результатов`;
    resultWrap.appendChild(p);
  } else {
    data.forEach((el) => {
      const div = document.createElement('div');
      div.className = 'result__block';
      div.innerHTML = `
        <div class="result__cpu">
          <p>${el.name}</p>
          <span>${el.cpu.name}, ${el.cpu.count * el.cpu.cores} ядер</span>
        </div>
        <div class="result__ram">
          <p>${el.ram}</p>
        </div>
        <div class="result__hard">
          <p>${el.disk.count} x ${el.disk.value} ${el.disk.type}</p>
        </div>
        <div class="result__gpu">
          <p>${el.gpu ? el.gpu : ''}</p>
        </div>
        <div class="result__price">
          <p>${el.price} ₽/месяц</p>
          <a class="btn result__btn">Заказать</a>
        </div>
        `;
      resultWrap.appendChild(div);
    });
  }
}

// изменетя значение input[type="range"]
function changeValue(e) {
  const target = e.target.value;
  const rangeValue = document.querySelector('.config__range-value');

  rangeValue.innerHTML = `${target} ядер`;
}

getData().then(data => {
  filter(data);
});

range.addEventListener('change', function (e) {
  changeValue(e);
  filter(myData);
});

raidCheckbox.addEventListener('change', function () {
  filter(myData);
});

gpuCheckbox.addEventListener('change', function () {
  filter(myData);
});

ssdCheckbox.addEventListener('change', function () {
  filter(myData);
});


