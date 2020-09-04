function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {

    const slides = document.querySelectorAll(slide);
    const prev = document.querySelector(prevArrow);
    const next = document.querySelector(nextArrow);
    const total = document.querySelector(totalCounter);
    const current = document.querySelector(currentCounter);
    const slidesWrapper = document.querySelector(wrapper);
    const clidesField = document.querySelector(field);
    const width = window.getComputedStyle(slidesWrapper).width;
    const slider = document.querySelector(container);

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
        dot.setAttribute('data-slide-to', i + 1); // каждоый точке ставим атрибут и ставим нумерацию начиная с 1
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
        dots[slideIndex - 1].style.opacity = 1;
    }

    function currentSlide() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }


    next.addEventListener('click', () => {
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

    prev.addEventListener('click', () => {
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
        dot.addEventListener('click', (evt) => { // используем объъект событие
            const slideTo = evt.target.getAttribute('data-slide-to');
            slideIndex = slideTo; // уставили индекс
            offset = offset = deleteNotDigits(width) * (slideTo - 1); // установили ширину

            clidesField.style.transform = `translateX(-${offset}px)`; // перемещаем слайд по клику

            // текущий слайд
            currentSlide();

            dotsToActive();

        });
    });
}

export default slider;