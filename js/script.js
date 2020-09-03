window.addEventListener("DOMContentLoaded", () => {
    // Tabs
    const tabs = document.querySelectorAll(".tabheader__item"),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabsParent = document.querySelector(".tabheader__items");

    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.style.display = "none";
        });

        tabs.forEach((item) => {
            item.classList.remove("tabheader__item_active");
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = "block";
        tabs[i].classList.add("tabheader__item_active");
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener("click", (evt) => {
        const target = evt.target;

        if (target && target.classList.contains("tabheader__item")) {
            // если эл. совпадает с тем массивом то тогда береём его номер и показываем на странице
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadLine = "2020-09-11";

    // задача функции передать разницу между датами

    function getTimeRamaining(endtime) {
        // принимает дедлайн
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        // возвращаем объект из функции

        return {
            total: t, // общее кол-во миллисекунд
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        };
    }

    // добавим нули для красивого отображения

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    // функция устанавливает таймер на страницу

    function setClock(selector, endtime) {
        // место куда передаём по элементу, и дедлайн который мы будем преедавать
        const timer = document.querySelector(selector), // ищем по селектору
            days = timer.querySelector("#days"), // ищем по id
            hours = timer.querySelector("#hours"),
            minutes = timer.querySelector("#minutes"),
            seconds = timer.querySelector("#seconds"),
            timeInterval = setInterval(updateClock, 1000); // обналяем таймер каждую секунду

        updateClock(); // запускаем при открытии , что бы не было мигания в вёрстке

        // функция которая, обнавляем таймер каждую секунду

        function updateClock() {
            const t = getTimeRamaining(endtime); // расчёт времени который остался на эту секунду

            // посметить на страницу эти элементы

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            // остановим таймер, если время вышло

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock(".timer", deadLine);

    // Modal

    // 2 функции открытие и закрытие и подвязать обработчики
    const modalTrigger = document.querySelectorAll("[data-modal]"),
        modal = document.querySelector(".modal");

    modalTrigger.forEach((btn) => {
        btn.addEventListener("click", openModal);
    });

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId); // если пользоватьель открыл модалку, то не показываем повторно
    }

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = "";
    }

    modal.addEventListener("click", (evt) => {
        if (evt.target === modal || evt.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener("keydown", (evt) => {
        if (evt.code === "Escape" && modal.classList.contains("show")) {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll() {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight
        ) {
            openModal();
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);

    // Используем классы для карточек

    class MenuCard {
        constructor(src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH(); 
        }

        changeToUAH() {
            this.price = this.price * this.transfer; 
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = "menu__item";
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    
    const getResource = async (url) => { // просто делаем запрос
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`); // создаем объет ошибки
        }

        return  await res.json(); // трансофрмируем в json промис
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            // перебираем элементы, назовём каждый отдельным элемент объектом, потому что массив состоит из объектов
            data.forEach(({img, altimg, title, descr, price}) => { // деструктуризация объекта
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render(); // деструктуризация объекта
            }); 
        });

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add("menu__item");

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;
    //         document.querySelector(".menu .container").append(element);
    //     });
    // }

    // Forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => { // настроиваем запрос, внутри будет ассихронный код
        const res = await fetch(url, { // фетчим, получаем ответ от сервера
            method: 'POST',
            headers: {
                 'Content-type' : 'application/json'
            },
            body: data
        });

        return  await res.json(); // трансофрмируем в json промис
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
                `;

            form.insertAdjacentElement('afterend', statusMessage);
                   
            const formData = new FormData(form); // берем формДата , которая собрала все данные с формы, превращаем в массив массивов, после этого превращаем в классический объект, превращаем в JSON этот объект

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json) // вызываем postData            
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove(); 
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    //API -  набор данных и возможностей которые дают готовые решение

    // слайдер

    //получить все элементы
    //получить индекс слайдера , при клике индекс меняется
    //функция которая занимается показом нашего слайда и скрытие других слайдов
    //внутри себя эта функция должна иметь условия , конец или начало
    //когда функция создана вешаем обработчики события на стрелки делаем что нам нужно
    //при создании должна быть нумерация 

    const slides = document.querySelectorAll('.offer__slide');
    const prev = document.querySelector('.offer__slider-prev');
    const next = document.querySelector('.offer__slider-next');
    const total = document.querySelector('#total');
    const current = document.querySelector('#current');
    const slidesWrapper = document.querySelector('.offer__slider-wrapper');
    const clidesField = document.querySelector('.offer__slider-inner');
    const width = window.getComputedStyle(slidesWrapper).width;
    const slider = document.querySelector('.offer__slider');

    let slideIndex = 1;
    let offset = 0;

    // инициализация

    if (slides.lenght < 10) {
        total.textContent = `0${slides.length}`; 
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = `0${slideIndex}`;
    }



    clidesField.style.width = 100 * slides.length + '%';
    clidesField.style.display = 'flex';
    clidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => { // установим слайдам одинаковую ширину
        slide.style.width = width; 
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol');
    const dots = []; // делаем пустой массив
    indicators.classList.add('carousel-indicators');
    
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+ 1); // каждоый точке ставим атрибут и ставим нумерацию начиная с 1
        dot.classList.add('dot');
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot); // пушим в массив точки
    }

    function deleteNotDigits(str) {
        return +str.replace(/\D/g, '');
    }

    
    function dotsToActive() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex -1 ].style.opacity = 1;
    }

    function currentSlide() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }


    next.addEventListener('click', ()=> {
        if (offset === deleteNotDigits(width) * (slides.length - 1)) { //  если последний слайд
            offset = 0;
        } else {
            offset += deleteNotDigits(width); // когда жмём вперед добавляем ширину слайда и он смещается
        }

        clidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        currentSlide();

        dotsToActive();
    });

    prev.addEventListener('click', ()=> {
        if (offset == 0) { 
            offset = deleteNotDigits(width) * (slides.length - 1);
        } else {
            offset -= deleteNotDigits(width); 
        }

        clidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        currentSlide();

        dotsToActive();
    
    });
    
    // по клику меняем слайдер цифру и смещаем

    dots.forEach(dot => { // переберём точки
        dot.addEventListener('click', (evt)=> { // используем объъект событие
            const slideTo = evt.target.getAttribute('data-slide-to');
            slideIndex = slideTo; // уставили индекс
            offset = offset = deleteNotDigits(width) * (slideTo - 1); // установили ширину

            clidesField.style.transform = `translateX(-${offset}px)`; // перемещаем слайд по клику

            // текущий слайд
            currentSlide();

            dotsToActive();

        });
    });

    // Calc

    const result = document.querySelector('.calculating__result span');

    let sex ,height, weight, age, ratio ;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSetting(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id')=== localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
    }
 
    initLocalSetting('#gender div', 'calculating__choose-item_active');
    initLocalSetting('.calculating__choose_big div', 'calculating__choose-item_active');
    
    
    // вызываем функцию каждый раз, когда клиент меняет значения

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) { // если не заполен хотябы 1 параметр
            result.textContent = '____';
            return;
        }
 
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)
            ) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)
            ) * ratio);
        }
    }

    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector); // получим все элементы

        elements.forEach(elem => {
            elem.addEventListener('click', (evt)=> {// нужен объект события
                if (evt.target.getAttribute('data-ratio')) {
                    ratio = +evt.target.getAttribute('data-ratio'); // если пользователь кликнул на умеренную активность , мы взяли и вытащили эту активность которая стояла в дата атрибуте
                    localStorage.setItem('ratio', +evt.target.getAttribute('data-ratio'));
                } else {
                    sex = evt.target.getAttribute('id');
                    localStorage.setItem('sex', evt.target.getAttribute('id'));
    
                }
    
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
    
                evt.target.classList.add(activeClass);
    
                calcTotal();
            });
        });

    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', ()=> { // пользователь что то вводит

            if(input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) { // каждый раз когда пользователь что-то вводит мы ориентируемся на уникальный индификатор и будет записывать данные в определённую переменную
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });

        
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');



});