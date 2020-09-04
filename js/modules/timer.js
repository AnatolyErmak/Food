function timer(id, deadLine) {
    // Timer

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

    setClock(id, deadLine);
}

export default timer;