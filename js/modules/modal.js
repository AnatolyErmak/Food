function openModal(modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';

    
    console.log(modalTimerId);
    if (modalTimerId) {
        clearInterval(modalTimerId); // если пользоватьель открыл модалку, то не показываем повторно
    }   
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
        
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = "";
}

function modal(triggerSelector, modalSelector, modalTimerId) {
    // Modal

    // 2 функции открытие и закрытие и подвязать обработчики
    const modalTrigger = document.querySelectorAll(triggerSelector),
        modal = document.querySelector(modalSelector);

    modalTrigger.forEach((btn) => {
        btn.addEventListener("click", ()=> openModal(modalSelector, modalTimerId));
    });



    modal.addEventListener("click", (evt) => {
        if (evt.target === modal || evt.target.getAttribute('data-close') == '') {
            closeModal(modalSelector);
        }
    });

    document.addEventListener("keydown", (evt) => {
        if (evt.code === "Escape" && modal.classList.contains("show")) {
            closeModal(modalSelector);
        }
    });

    function showModalByScroll() {
        if (
            window.pageYOffset + document.documentElement.clientHeight >=
            document.documentElement.scrollHeight
        ) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener("scroll", showModalByScroll);
        }
    }

    window.addEventListener("scroll", showModalByScroll);
}

export default modal;
export {closeModal, openModal};